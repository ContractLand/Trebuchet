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

  describe("requestFundRaw", () => {
    test("should call faucetClient.Fund() and return balance", async () => {
      const Fund = async (args, cb) => {
        expect(args.address).toBe("0x3c7539cd57b7E03f722C3AEb636247188b25dcC4");
        expect(args.amount.toString()).toBe("9999");
        cb();
      };
      vu.web3 = {
        eth: {
          getBalance: _address => {
            expect(_address).toBe(address);
            return 11;
          }
        }
      };
      vu.faucetClient.Fund = Fund;
      const balance = await vu.requestFundRaw("9999");
      expect(balance).toBe(11);
    });

    test("should throw on error", async () => {
      const Fund = async (args, cb) => {
        cb("Some error has occurred");
      };
      vu.faucetClient.Fund = Fund;
      await expect(vu.requestFundRaw("9999")).rejects.toThrow(
        "Some error has occurred"
      );
    });
  });

  describe("requestFund", () => {
    test("wraps the funding function with the reporter", async () => {
      vu.txWrapper = function testWrapper(name, fn, ...args) {
        expect(name).toBe("FUNDING");
        expect(args[0]).toBe("100");
        expect(this.account.address).toBe(address); // Test that function has been bounded
        return "Wrapped";
      };
      const res = await vu.requestFund("100");
      expect(res).toBe("Wrapped");
    });
  });

  describe("requestMinFund", () => {
    test("should fund empty accounts", async () => {
      vu.getBalance = () => "0";
      vu.requestFund = fund => {
        expect(fund.toString()).toBe("999");
        return "999";
      };
      const res = await vu.requestMinFund("999");
      expect(res).toBe("999");
    });

    test("should fund partially funded accounts", async () => {
      vu.getBalance = () => "900";
      vu.requestFund = fund => {
        expect(fund.toString()).toBe("99");
        return "999";
      };
      const res = await vu.requestMinFund("999");
      expect(res).toBe("999");
    });

    test("should not fund accounts with more funds", async () => {
      vu.getBalance = () => "1000";
      vu.requestFund = fund => {
        expect(fund.toString()).toBe("999");
        return "999";
      };
      const res = await vu.requestMinFund("999");
      expect(res).toBe("1000");
    });
  });

  describe("signTransaction", () => {
    test("should use web3 account to sign the transaction", async () => {
      const testTx = { foo: "bar" };
      vu.account.signTransaction = tx => {
        expect(tx).toEqual(testTx);
        return "Signed";
      };
      const signedTx = await vu.signTransaction(testTx);
      expect(signedTx).toBe("Signed");
    });
  });

  describe("incrementNonce", () => {
    test("should increase the nonce by 1", async () => {
      vu.nonce = 999;
      await vu.incrementNonce();
      expect(vu.nonce).toBe(1000);
    });

    test("should initialise nonce if it is not found", async () => {
      vu.initNonce = () => {
        vu.nonce = 999;
      };
      await vu.incrementNonce();
      expect(vu.nonce).toBe(1000);
    });
  });

  describe("signAndSendTransaction", () => {
    test("should sign, send and record transaction", async () => {
      vu.signTransaction = tx => {
        expect(tx).toEqual({
          foo: "bar",
          nonce: 9
        });
        return { rawTransaction: "Signed Raw Tx" };
      };
      vu.web3.eth.sendSignedTransaction = tx => {
        expect(tx).toEqual("Signed Raw Tx");
        return "Tx Receipt";
      };
      vu.nonce = 9;
      const receipt = await vu.signAndSendTransaction({ foo: "bar" });
      expect(receipt).toEqual("Tx Receipt");
    });
  });
});
