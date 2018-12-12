const { FaucetClient } = require("trebuchet-faucet-eth");
const VU = require("trebuchet-vu");
const Web3 = require("web3");

const { toBN } = Web3.utils;
class VirtualUserEth extends VU {
  constructor({ index, id, privateKey, rpc, grpc }) {
    super({ index, id });

    if (!rpc) throw new Error("RPC endpoint is not defined");
    if (!grpc) throw new Error("GRPC (faucet) endpoint is not defined");
    if (!privateKey) throw new Error("Private key is not assigned");

    // For ETH VU
    this.rpc = rpc;
    this.grpc = grpc;
    this.faucetClient = FaucetClient(this.grpc);
    this.web3 = new Web3(this.rpc);
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(privateKey);
  }

  async initNonce() {
    if (!this.nonce) {
      this.nonce = await this.getNonce();
    }
  }

  async getNonce() {
    return this.web3.eth.getTransactionCount(this.account.address, "pending");
  }

  async getBalance() {
    return this.web3.eth.getBalance(this.account.address);
  }

  /**
   * Raw function to funds the VU's account balance
   * @param  {string|number|BN} fund - Amount to fund the VU's account with
   * @returns {string} Current balance in account
   */
  async requestFundRaw(fund) {
    await new Promise((resolve, reject) => {
      this.faucetClient.Fund(
        { address: this.account.address, amount: toBN(fund) },
        (err, response) => {
          if (err) return reject(new Error(err));
          return resolve(response);
        }
      );
    });
    return this.getBalance();
  }

  /**
   * Funds the VU's account balance and report the transaction
   * @param  {string|number|BN} fund - Amount to fund the VU's account with
   * @returns {string} Current balance in account
   */
  async requestFund(fund) {
    return this.txWrapper("FUNDING", this.requestFundRaw.bind(this), fund);
  }

  /**
   * Funds the VU's account balance to a minimum of the amount
   * @param  {string|number|BN} fund - Amount to fund the VU's account with
   * @returns {string} Current balance in account
   */
  async requestMinFund(fund) {
    const balance = await this.getBalance();
    const amountToFund = toBN(fund).sub(toBN(balance));
    if (amountToFund.isNeg()) {
      return balance;
    }
    return this.requestFund(amountToFund);
  }

  async signTransaction(tx) {
    return this.account.signTransaction(tx);
  }

  async incrementNonce() {
    await this.initNonce();
    this.nonce += 1;
  }

  /**
   * @param  {} tx - Eth transaction to be signed
   * @param  {string} name - (Optional) Name for transaction reporting
   */
  async signAndSendTransaction(tx, name) {
    await this.initNonce();
    const signedTx = await this.signTransaction({
      ...tx,
      nonce: this.nonce
    });
    this.incrementNonce();
    return this.txWrapper(
      name || "TRANSACTION",
      this.web3.eth.sendSignedTransaction.bind(this),
      signedTx.rawTransaction
    );
  }

  /**
   * @param  {Object} contract - Contract object to be wrapped with tx reporting
   * @returns  {Object} Contract with .tx which are contract methods but wrapped with tx reporter
   */
  wrapContract(contract) {
    const wrappedMethods = {};
    const contractMethods = Object.keys(contract.methods);
    contractMethods.forEach(method => {
      const wrappedMethod = (...args) => ({
        send: opts =>
          this.txWrapper(
            "CONTRACT_SEND",
            contract.methods[method](...args).send,
            opts
          ),
        call: opts =>
          this.txWrapper(
            "CONTRACT_CALL",
            contract.methods[method](...args).call,
            opts
          ),
        estimateGas: opts =>
          this.txWrapper(
            "CONTRACT_ESTIMATE_GAS",
            contract.methods[method](...args).estimateGas,
            opts
          )
      });
      wrappedMethods[method] = wrappedMethod;
    });
    return Object.assign({}, contract, { tx: wrappedMethods });
  }

  /**
   * Deploys a contract on the network with the abi and bytecode
   * @param  {Object} abi - JSON ABI for the contract
   * @param  {string} bytecode - Byecode for contract, should start with 0x
   * @param  {Object} opts - Options for deployment, should contain gas and gasPrice
   * @param  {Array} args - Array of arguments for contract constructor
   * @returns {Object} Instance of web3.contract
   */
  async deployContractRaw(abi, bytecode, opts, args = []) {
    const contractProxy = new this.web3.eth.Contract(abi);
    const deployment = contractProxy.deploy({
      from: this.account.address,
      data: bytecode,
      arguments: args
    });
    const deployedContract = await deployment.send({
      ...opts,
      from: this.account.address
    });
    return this.wrapContract(deployedContract);
  }

  async deployContract(abi, bytecode, opts, args) {
    return this.txWrapper(
      "CONTRACT_DEPLOY",
      this.deployContractRaw.bind(this),
      abi,
      bytecode,
      opts,
      args
    );
  }

  /**
   * Loads a contract instance from the abi and address of the contract
   * @param  {string} address - Address for contract, should start with 0x
   * @param  {Object} abi - JSON ABI for the contract
   * @returns {Contract} Instance of web3.contract
   */
  loadContract(address, abi) {
    const contract = new this.web3.eth.Contract(abi, address, {
      from: this.account.address
    });
    return this.wrapContract(contract);
  }
}

module.exports = VirtualUserEth;
