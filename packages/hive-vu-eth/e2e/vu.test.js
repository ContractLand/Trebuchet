const FaucetServer = require("hive-faucet-eth");
const Web3 = require("web3");
const VU = require("../src/vu");

const RPC_URL = "http://localhost:8545";
const GRPC_URL = "localhost:50051";
const FUNDING_ACCOUNT_PRIVATE =
  "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";

const { toWei } = Web3.utils;

describe("VU", () => {
  let web3;
  let vu;
  let server;

  const newAddress = () => web3.eth.accounts.create().address;
  const newPrivateKey = () => web3.eth.accounts.create().privateKey;

  beforeAll(() => {
    web3 = new Web3(RPC_URL);
    server = FaucetServer({
      grpcUrl: GRPC_URL,
      faucetPrivateKey: FUNDING_ACCOUNT_PRIVATE
    });
  });

  afterAll(async () => {
    // GRPC has a problem with shutting down, therefore requiring --forceExit on jest.
    const deferShutdown = new Promise(resolve => {
      server.tryShutdown(() => {
        resolve();
      });
    });
    await deferShutdown;
  });

  beforeEach(() => {
    vu = new VU({
      privateKey: newPrivateKey(),
      rpc: RPC_URL,
      grpc: GRPC_URL
    });
  });

  describe("requestFund", () => {
    test("should fund VU with funds", async () => {
      const fund = "100";
      const finalBalance = await vu.requestFund(fund);

      expect(finalBalance).toEqual(fund);
    });
  });

  describe("requestMinFund", () => {
    test("should fund VU with funds", async () => {
      const intermediateBal = await vu.requestMinFund(500);
      const finalBalance = await vu.requestMinFund(600);

      expect(intermediateBal).toEqual("500");
      expect(finalBalance).toEqual("600");
    });
    test("should not fund when fund is greater than or equal to VU's balance", async () => {
      await vu.requestFund(500);
      const intermediateBalance = await vu.requestMinFund(400);
      const finalBalance = await vu.requestMinFund(500);

      expect(intermediateBalance).toEqual("500");
      expect(finalBalance).toEqual("500");
    });
  });

  describe("signAndSendTransaction", () => {
    test("should send a transaction", async () => {
      await vu.requestFund(toWei("0.05", "ether"));
      const receiver = newAddress();
      const nonce = await vu.getNonce();
      const tx = {
        gas: 21000,
        to: receiver,
        from: vu.address,
        value: toWei("0.01", "ether"),
        nonce
      };
      await vu.signAndSendTransaction(tx);
      const receiverBalance = await web3.eth.getBalance(receiver);
      expect(receiverBalance).toEqual(toWei("0.01", "ether"));
    });
  });
});
