const VU = require("./vu");

// Test parameters
const rpc = "http://localhost:8545";
const grpc = "localhost:50051";
const privateKey =
  "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";

describe("constructor", () => {
  test("should set properties correctly", () => {
    const index = 10;
    const id = 1337;
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
    expect(vu.account.address).toBe(
      "0x3c7539cd57b7E03f722C3AEb636247188b25dcC4"
    );
    expect(vu.account.privateKey).toBe(privateKey);
    expect(vu.account.signTransaction).toBeTruthy();
    expect(vu.account.sign).toBeTruthy();
    expect(vu.account.encrypt).toBeTruthy();
  });

  test("should throw when rpc is not set", () => {
    const index = 10;
    const id = 1337;
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
    const index = 10;
    const id = 1337;
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
    const index = 10;
    const id = 1337;
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
