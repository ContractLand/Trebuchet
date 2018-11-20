const BN = require("bn.js");
const Web3 = require("web3");
const { times, zipWith, every } = require("lodash");
const Funder = require("./funder");

const RPC = "http://localhost:8545";
const FUNDING_ACCOUNT_PRIVATE =
  "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";
const FUNDING_ACCOUNT_ADDRESS = "0x3c7539cd57b7E03f722C3AEb636247188b25dcC4";

test("constructor", () => {
  const funder = new Funder({
    rpc: RPC,
    fundingAccount: FUNDING_ACCOUNT_PRIVATE
  });
  expect(funder.rpc).toBe(RPC);
  expect(funder.web3).toBeTruthy();
  expect(funder.account.address).toBe(FUNDING_ACCOUNT_ADDRESS);
  expect(funder.account.privateKey).toBe(FUNDING_ACCOUNT_PRIVATE);
});

describe("methods", () => {
  let web3;
  let funder;

  beforeAll(() => {
    web3 = new Web3(RPC);
    funder = new Funder({
      rpc: RPC,
      fundingAccount: FUNDING_ACCOUNT_PRIVATE
    });
  });

  describe("fund", () => {
    test("single transaction", async () => {
      const amountToFund = "100";
      const accountToFund = "0x27e2bfc8de48d61cb92bce9b42bb3d20e366312b";

      const balanceBefore = await web3.eth.getBalance(accountToFund);
      const beforeBn = new BN(balanceBefore);

      const fundingTx = await funder.fund(accountToFund, amountToFund);

      const balanceAfter = await web3.eth.getBalance(accountToFund);
      const afterBn = new BN(balanceAfter);

      const diff = afterBn.sub(beforeBn).sub(new BN(amountToFund));

      expect(fundingTx).toBeTruthy();
      expect(diff.toString(10)).toBe("0");
    }, 20000);

    test("multiple transaction", async () => {
      const amountToFund = "100";
      const accounts = times(10, () => web3.eth.accounts.create());

      const balancesBeforePromises = accounts.map(acc =>
        web3.eth.getBalance(acc.address)
      );
      const balancesBefore = await Promise.all(balancesBeforePromises);
      const balancesBeforeBn = balancesBefore.map(bal => new BN(bal));

      const promises = accounts.map(acc =>
        funder.fund(acc.address, amountToFund)
      );
      const resolvedPromises = await Promise.all(promises);

      const balancesAfterPromises = accounts.map(acc =>
        web3.eth.getBalance(acc.address)
      );
      const balancesAfter = await Promise.all(balancesAfterPromises);
      const balancesAfterBn = balancesAfter.map(bal => new BN(bal));

      const balanceDiff = zipWith(
        balancesAfterBn,
        balancesBeforeBn,
        (after, before) => after.sub(before)
      );

      const fundedCorrectly = every(
        balanceDiff,
        diff => diff.cmp(new BN(amountToFund)) === 0
      );
      expect(fundedCorrectly).toBe(true);
    }, 20000);
  });
});
