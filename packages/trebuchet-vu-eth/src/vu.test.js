const sinon = require("sinon");
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

  describe("deployContractRaw", () => {
    test("should deploy contract with web3", async () => {
      const deployStub = sinon.stub();
      const sendStub = sinon.stub();
      vu.web3 = {
        eth: {
          Contract: sinon.stub()
        }
      };
      vu.wrapContract = contract => contract;
      vu.web3.eth.Contract.returns({ deploy: deployStub });
      deployStub.returns({ send: sendStub });
      sendStub.resolves("CONTRACT_INSTANCE");

      const opts = { foo: "bar" };
      const args = [1, 2, 3];

      await vu.deployContractRaw("JSON_ABI", "BYTECODE", opts, args);

      expect(vu.web3.eth.Contract.called).toBe(true);
      expect(vu.web3.eth.Contract.args[0]).toEqual(["JSON_ABI"]);

      expect(deployStub.called).toBe(true);
      expect(deployStub.args[0][0]).toEqual({
        from: vu.account.address,
        data: "BYTECODE",
        arguments: args
      });

      expect(sendStub.called).toBe(true);
      expect(sendStub.args[0][0]).toEqual({
        foo: "bar",
        from: vu.account.address
      });
    });

    test("should deploy contract with empty args", async () => {
      const deployStub = sinon.stub();
      const sendStub = sinon.stub();
      vu.web3 = {
        eth: {
          Contract: sinon.stub()
        }
      };
      vu.wrapContract = contract => contract;
      vu.web3.eth.Contract.returns({ deploy: deployStub });
      deployStub.returns({ send: sendStub });
      sendStub.resolves("CONTRACT_INSTANCE");

      const opts = { foo: "bar" };

      await vu.deployContractRaw("JSON_ABI", "BYTECODE", opts);

      expect(vu.web3.eth.Contract.called).toBe(true);
      expect(vu.web3.eth.Contract.args[0]).toEqual(["JSON_ABI"]);

      expect(deployStub.called).toBe(true);
      expect(deployStub.args[0][0]).toEqual({
        from: vu.account.address,
        data: "BYTECODE",
        arguments: []
      });

      expect(sendStub.called).toBe(true);
      expect(sendStub.args[0][0]).toEqual({
        foo: "bar",
        from: vu.account.address
      });
    });
  });

  describe("wrapContract", () => {
    test("should wrap send(), call() and estimateGas() from contract.methods with txWrapper", async () => {
      const contract = {
        methods: {
          contractMethod: sinon.stub()
        }
      };
      const stubbedMethod = {
        send: sinon.stub(),
        call: sinon.stub(),
        estimateGas: sinon.stub()
      };
      contract.methods.contractMethod.returns(stubbedMethod);

      stubbedMethod.send.resolves("RESULT_FROM_CONTRACT_METHOD_SEND");
      stubbedMethod.call.resolves("RESULT_FROM_CONTRACT_METHOD_CALL");
      stubbedMethod.estimateGas.resolves(
        "RESULT_FROM_CONTRACT_METHOD_ESTIMATE_GAS"
      );

      vu.txWrapper = (_name, fn, ...args) => fn(...args);
      const wrappedContract = vu.wrapContract(contract);

      const sendResult = await wrappedContract.tx
        .contractMethod("Contract", "Arguments")
        .send({ gas: 10000 });

      expect(sendResult).toBe("RESULT_FROM_CONTRACT_METHOD_SEND");
      expect(contract.methods.contractMethod.args[0]).toEqual([
        "Contract",
        "Arguments"
      ]);
      expect(stubbedMethod.send.args[0][0]).toEqual({ gas: 10000 });

      const callResult = await wrappedContract.tx
        .contractMethod("Contract", "Arguments2")
        .call({ gas: 10001 });

      expect(callResult).toBe("RESULT_FROM_CONTRACT_METHOD_CALL");
      expect(contract.methods.contractMethod.args[1]).toEqual([
        "Contract",
        "Arguments2"
      ]);
      expect(stubbedMethod.call.args[0][0]).toEqual({ gas: 10001 });

      const estimateResult = await wrappedContract.tx
        .contractMethod("Contract", "Arguments3")
        .estimateGas({ gas: 10002 });

      expect(estimateResult).toBe("RESULT_FROM_CONTRACT_METHOD_ESTIMATE_GAS");
      expect(contract.methods.contractMethod.args[2]).toEqual([
        "Contract",
        "Arguments3"
      ]);
      expect(stubbedMethod.estimateGas.args[0][0]).toEqual({ gas: 10002 });
    });
  });

  describe("deployContract", () => {
    test("wraps the deploy contract function with the reporter", async () => {
      vu.txWrapper = sinon.stub();
      vu.txWrapper.resolves("Wrapped");
      const res = await vu.deployContract(
        "JSON_ABI",
        "BYTECODE",
        { foo: "bar" },
        [1, 2]
      );
      expect(res).toBe("Wrapped");
      expect(vu.txWrapper.args[0][0]).toBe("CONTRACT_DEPLOY");
      expect(vu.txWrapper.args[0][2]).toBe("JSON_ABI");
      expect(vu.txWrapper.args[0][3]).toBe("BYTECODE");
      expect(vu.txWrapper.args[0][4]).toEqual({ foo: "bar" });
      expect(vu.txWrapper.args[0][5]).toEqual([1, 2]);
    });
  });

  describe("loadContract", () => {
    test("should load contract with web3", () => {
      vu.web3 = {
        eth: {
          Contract: sinon.stub()
        }
      };
      vu.web3.eth.Contract.returns("CONTRACT_INSTANCE");
      vu.wrapContract = contract => contract;
      vu.loadContract("CONTRACT_ADDRESS", "JSON_ABI");
      expect(vu.web3.eth.Contract.called).toBe(true);
      expect(vu.web3.eth.Contract.args[0]).toEqual([
        "JSON_ABI",
        "CONTRACT_ADDRESS",
        { from: vu.account.address }
      ]);
    });
  });
});
