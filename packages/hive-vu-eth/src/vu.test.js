const FaucetServer = require("hive-faucet-eth");
const Web3 = require("web3");
const VU = require("./index");

const RPC_URL = "http://localhost:8545";
const GRPC_URL = "localhost:50051";
const FUNDING_ACCOUNT_PRIVATE =
  "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";

describe("VU", () => {
  let web3;
  let vu;
  let server;

  const newAddress = () => web3.eth.accounts.create().address;

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
      address: newAddress()
    });
  });

  test("getFund", async () => {
    const fund = 100;
    const initialBalance = await vu.getBalance();
    const faucetRes = await vu.getFund(fund);
    const finalBalance = await vu.getBalance();

    expect(faucetRes.success).toBe.true;
    expect(finalBalance - initialBalance).toEqual(fund);
  });

  test("getMinFund", async () => {
    const initialBalance = await vu.getBalance();
    const faucetRes = await vu.getMinFund(500);
    const intermediateBal = await vu.getBalance();
    const faucetRes2 = await vu.getMinFund(600);
    const finalBalance = await vu.getBalance();

    expect(intermediateBal - initialBalance).toEqual(500);
    expect(finalBalance - intermediateBal).toEqual(100);
    expect(finalBalance).toEqual("600");
  });
});
