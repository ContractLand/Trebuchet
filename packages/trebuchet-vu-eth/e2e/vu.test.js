const { FaucetServer } = require("trebuchet-faucet-eth");
const Web3 = require("web3");
const sinon = require("sinon");
const VU = require("../src/vu");
const { abi, bytecode } = require("./mintableToken.json");

const RPC_URL = "http://localhost:8545";
const GRPC_URL = "localhost:50051";
const FUNDING_ACCOUNT_PRIVATE =
  "0x678ae9837e83a4b356c01b741e36a9d4ef3ac916a843e8ae7d37b9dd2045f963";

const { toWei } = Web3.utils;

const verifyContractMethods = contract => {
  expect(contract.methods.addMinter).toBeTruthy();
  expect(contract.methods.mint).toBeTruthy();
  expect(contract.methods.renounceMinter).toBeTruthy();
  expect(contract.methods.approve).toBeTruthy();
  expect(contract.methods.totalSupply).toBeTruthy();
  expect(contract.methods.transferFrom).toBeTruthy();
  expect(contract.methods.increaseAllowance).toBeTruthy();
  expect(contract.methods.balanceOf).toBeTruthy();
  expect(contract.methods.decreaseAllowance).toBeTruthy();
  expect(contract.methods.transfer).toBeTruthy();
  expect(contract.methods.allowance).toBeTruthy();
};

const verifyContractWrapped = contract => {
  expect(contract.tx.addMinter).toBeTruthy();
  expect(contract.tx.mint).toBeTruthy();
  expect(contract.tx.renounceMinter).toBeTruthy();
  expect(contract.tx.approve).toBeTruthy();
  expect(contract.tx.totalSupply).toBeTruthy();
  expect(contract.tx.transferFrom).toBeTruthy();
  expect(contract.tx.increaseAllowance).toBeTruthy();
  expect(contract.tx.balanceOf).toBeTruthy();
  expect(contract.tx.decreaseAllowance).toBeTruthy();
  expect(contract.tx.transfer).toBeTruthy();
  expect(contract.tx.allowance).toBeTruthy();
};

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
      grpc: GRPC_URL,
      reporter: { reportTransaction: sinon.stub() }
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
      const tx = {
        gas: 21000,
        to: receiver,
        from: vu.address,
        value: toWei("0.01", "ether")
      };
      await vu.signAndSendTransaction(tx);
      const receiverBalance = await web3.eth.getBalance(receiver);
      expect(receiverBalance).toEqual(toWei("0.01", "ether"));
    });

    test("should send multiple transactions", async () => {
      await vu.requestFund(toWei("0.05", "ether"));
      const receiver = newAddress();
      const tx = {
        gas: 21000,
        to: receiver,
        from: vu.address,
        value: toWei("0.01", "ether")
      };
      await vu.signAndSendTransaction(tx);
      await vu.signAndSendTransaction(tx);
      await vu.signAndSendTransaction(tx);
      const receiverBalance = await web3.eth.getBalance(receiver);
      expect(receiverBalance).toEqual(toWei("0.03", "ether"));
    });
  });

  describe("deployContract", () => {
    test("should return a deployed contract instance", async () => {
      await vu.requestFund(toWei("0.05", "ether"));
      const contract = await vu.deployContract(abi, bytecode.object, {
        gas: 3000000,
        gasPrice: 0
      });

      expect(contract.options.address).toBeTruthy();

      verifyContractMethods(contract);
      verifyContractWrapped(contract);
    });

    test("deployed contract should work", async () => {
      await vu.requestFund(toWei("0.05", "ether"));
      const contract = await vu.deployContract(abi, bytecode.object, {
        gas: 3000000,
        gasPrice: 0
      });

      await contract.tx.mint(vu.account.address, "100000").send({
        from: vu.account.address,
        gas: 3000000,
        gasPrice: 0
      });

      const bal = await contract.tx.balanceOf(vu.account.address).call();

      expect(bal).toBe("100000");
    });
  });

  describe("loadContract", () => {
    test("should return a loaded contract", async () => {
      await vu.requestFund(toWei("0.05", "ether"));
      const contract = await vu.deployContract(abi, bytecode.object, {
        gas: 3000000,
        gasPrice: 0
      });
      const contractAddress = contract.options.address;
      const loadedContract = vu.loadContract(contractAddress, abi);

      // eslint-disable-next-line no-underscore-dangle
      expect(loadedContract._address).toBeTruthy();

      verifyContractMethods(loadedContract);
      verifyContractWrapped(loadedContract);
    });

    test("loaded contract should work", async () => {
      await vu.requestFund(toWei("0.05", "ether"));
      const contract = await vu.deployContract(abi, bytecode.object, {
        gas: 3000000,
        gasPrice: 0
      });
      const contractAddress = contract.options.address;
      const loadedContract = vu.loadContract(contractAddress, abi);

      await loadedContract.tx.mint(vu.account.address, "100000").send({
        from: vu.account.address,
        gas: 3000000,
        gasPrice: 0
      });
      const bal = await loadedContract.tx.balanceOf(vu.account.address).call();

      expect(bal).toBe("100000");
    });
  });
});
