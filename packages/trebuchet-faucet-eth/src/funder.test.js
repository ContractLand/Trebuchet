const sinon = require("sinon");
const Funder = require("./funder");

const fundingAccount =
  "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";
const rpc = "http://localhost:8545";

describe("funder", () => {
  describe("constructor", () => {
    test("should set properties correctly", () => {
      const funder = new Funder({
        rpc,
        fundingAccount
      });
      expect(funder.rpc).toBe(rpc);
      expect(funder.web3).toBeTruthy();
      expect(funder.account.privateKey).toBe(fundingAccount);
      expect(funder.account.address).toBe(
        "0x3c7539cd57b7E03f722C3AEb636247188b25dcC4"
      );
      expect(funder.mutex).toBeTruthy();
    });

    test("should throw if rpc is not set", () => {
      expect(
        () =>
          new Funder({
            fundingAccount
          })
      ).toThrow("RPC and fundingAccount needs to be defined");
    });

    test("should throw if fundingAccount is not set", () => {
      expect(
        () =>
          new Funder({
            rpc
          })
      ).toThrow("RPC and fundingAccount needs to be defined");
    });
  });

  describe("methods", () => {
    let funder;

    beforeEach(() => {
      funder = new Funder({
        rpc,
        fundingAccount
      });
    });

    describe("initNonce", () => {
      test("should return nonce if it's defined", async () => {
        funder.nonce = 2;
        const nonce = await funder.initNonce();
        expect(nonce).toBe(2);
      });

      test("should get nonce from node if nonce is not defined", async () => {
        funder.web3 = { eth: { getTransactionCount: sinon.stub() } };
        funder.web3.eth.getTransactionCount.resolves(5);
        const nonce = await funder.initNonce();
        expect(nonce).toBe(5);
        expect(funder.web3.eth.getTransactionCount.called).toBe(true);
        expect(funder.web3.eth.getTransactionCount.args[0]).toEqual([
          "0x3c7539cd57b7E03f722C3AEb636247188b25dcC4",
          "pending"
        ]);
      });
    });

    describe("fund", () => {
      test("should wrap transaction creation and signing in a mutex", async () => {
        let wrappedFn;
        funder.mutex = {
          async use(fn) {
            wrappedFn = fn;
            await fn();
          }
        };
        funder.nonce = 5;
        funder.account = {
          address: "0x3c7539cd57b7E03f722C3AEb636247188b25dcC4",
          signTransaction: sinon.stub()
        };
        funder.account.signTransaction.resolves({
          rawTransaction: "RAW_TRANSACTION"
        });
        funder.web3 = { eth: { sendSignedTransaction: sinon.stub() } };
        funder.web3.eth.sendSignedTransaction.resolves("TX_RECEIPT");
        const receipt = await funder.fund("receiving-account", "100");

        expect(wrappedFn).toBeTruthy();
        expect(funder.account.signTransaction.called).toBe(true);
        expect(funder.account.signTransaction.args[0][0]).toEqual({
          gas: 21000,
          to: "receiving-account",
          from: "0x3c7539cd57b7E03f722C3AEb636247188b25dcC4",
          value: "0x64",
          nonce: 5
        });
        expect(funder.web3.eth.sendSignedTransaction.called).toBe(true);
        expect(funder.web3.eth.sendSignedTransaction.args[0][0]).toBe(
          "RAW_TRANSACTION"
        );
        expect(receipt).toBe("TX_RECEIPT");
      });
    });
  });
});
