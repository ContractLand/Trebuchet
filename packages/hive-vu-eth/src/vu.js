const { FaucetClient } = require("hive-grpc");
const Web3 = require("web3");

const { toBN } = Web3.utils;
class VirtualUserEth {
  constructor({ index, id, privateKey, rpc, grpc }) {
    if (!rpc) throw new Error("RPC endpoint is not defined");
    if (!grpc) throw new Error("GRPC (faucet) endpoint is not defined");
    if (!privateKey) throw new Error("Private key is not assigned");

    // For VU
    this.id = id;
    this.index = index;

    // For ETH VU
    this.rpc = rpc;
    this.grpc = grpc;
    this.faucetClient = FaucetClient(this.grpc);
    this.web3 = new Web3(this.rpc);
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
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

  /**
   * Wraps a given function to automatically send a transaction report to the reporting module
   * @param  {string} name - Name to appear on the transaction report
   * @param  {function} fn - Function to be called
   * @param  {any} ...args - Arguments to be passed into the function
   */
  async txWrapper(name, fn, ...args) {
    const start = Date.now();
    const data = await fn(...args);
    const end = Date.now();
    this.reportTx({
      name,
      start,
      end,
      duration: end - start,
      error: false,
      data
    });
    return data;
  }

  /**
   * Sends a report to parent process through IPC when available
   * @param  {Object} data - Data to be sent to manager
   */
  reportTx(data) {
    if (process.send) {
      const txReport = {
        ...data,
        vu: this.id,
        type: "TX"
      };
      process.send(txReport);
    }
  }

  async signTransaction(tx) {
    return this.account.signTransaction(tx);
  }

  async incrementNonce() {
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
}

module.exports = VirtualUserEth;
