const VU = require("./vu");

// Test parameters
const index = 10;
const id = 1337;
const rpc = "http://localhost:8545";
const grpc = "localhost:50051";
const privateKey =
  "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";
const address = "0x3c7539cd57b7E03f722C3AEb636247188b25dcC4";

describe("constructor", () => {
  test("should set properties correctly", () => {
    const vu = new VU({
      index,
      id,
      privateKey,
      rpc,
      grpc
    });
    expect(vu.id).toBe(id);
    expect(vu.index).toBe(index);
    expect(vu.rpc).toBe(rpc);
    expect(vu.grpc).toBe(grpc);
    expect(vu.faucetClient).toBeTruthy();
    expect(vu.web3).toBeTruthy();
    expect(vu.account.address).toBe(address);
    expect(vu.account.privateKey).toBe(privateKey);
    expect(vu.account.signTransaction).toBeTruthy();
    expect(vu.account.sign).toBeTruthy();
    expect(vu.account.encrypt).toBeTruthy();
  });

  test("should throw when rpc is not set", () => {
    expect(
      () =>
        new VU({
          index,
          id,
          privateKey,
          grpc
        })
    ).toThrow();
  });

  test("should throw when grpc is not set", () => {
    expect(
      () =>
        new VU({
          index,
          id,
          privateKey,
          rpc
        })
    ).toThrow();
  });

  test("should throw when private key is not set", () => {
    expect(
      () =>
        new VU({
          index,
          id,
          rpc,
          grpc
        })
    ).toThrow();
  });
});

describe("class methods", () => {
  let vu;

  beforeEach(() => {
    vu = new VU({
      index,
      id,
      privateKey,
      rpc,
      grpc
    });
  });

  describe("initNonce", () => {
    test("should set nonce from getNonce()", async () => {
      const nonce = 437;
      vu.getNonce = () => nonce;

      expect(vu.nonce).toBe.undefined;
      await vu.initNonce();
      expect(vu.nonce).toBe(nonce);
    });

    test("should not all getNonce() if the nonce is set", async () => {
      const nonce = 111;
      vu.getNonce = () => 113;

      vu.nonce = nonce;
      expect(vu.nonce).toBe(nonce);
      await vu.initNonce();
      expect(vu.nonce).toBe(nonce);
    });
  });

  describe("getNonce", () => {
    test("should return nonce from web3", async () => {
      vu.web3 = {
        eth: {
          getTransactionCount: (_address, _status) => {
            expect(_address).toBe(address);
            expect(_status).toBe("pending");
            return 11;
          }
        }
      };
      const nonce = await vu.getNonce();
      expect(nonce).toBe(11);
    });
  });

  describe("getBalance", () => {
    test("should return nonce from web3", async () => {
      vu.web3 = {
        eth: {
          getBalance: _address => {
            expect(_address).toBe(address);
            return 11;
          }
        }
      };
      const nonce = await vu.getBalance();
      expect(nonce).toBe(11);
    });
  });
});
