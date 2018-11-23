const { v4: uuid } = require("uuid");
const { FaucetClient } = require("hive-grpc");
const Web3 = require("web3");

const { toBN } = Web3.utils;
class VirtualUserEth {
  constructor({ index, privateKey, rpc, grpc }) {
    if (!rpc) throw new Error("RPC endpoint is not defined");
    if (!grpc) throw new Error("GRPC (faucet) endpoint is not defined");
    if (!privateKey) throw new Error("Private key is not assigned");

    // For VU
    this.uuid = uuid();
    this.index = index;

    // For ETH VU
    this.rpc = rpc;
    this.grpc = grpc;
    this.faucetclient = FaucetClient(this.grpc);
    this.web3 = new Web3(this.rpc);
    this.privateKey = privateKey;
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.address = this.account.address;
  }

  toWei(amount) {
    return this.web3.utils.toWei(amount);
  }

  async getNonce() {
    return this.web3.eth.getTransactionCount(this.address, "pending");
  }

  async getBalance() {
    return this.web3.eth.getBalance(this.address);
  }

  /**
   * Funds the VU's account balance
   * @param  {string|number|BN} fund - Amount to fund the VU's account with
   * @returns {string} Current balance in account
   */
  async requestFund(fund) {
    await new Promise((resolve, reject) => {
      this.faucetclient.Fund(
        { address: this.address, amount: toBN(fund) },
        (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        }
      );
    });
    this.reportTx({ type: "FUNDING" });
    return this.getBalance();
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

  reportTx(tx) {
    if (process.send) {
      const txReport = {
        type: "TX_REPORT",
        pid: process.pid,
        account: this.address,
        timestamp: Date.now(),
        tx
      };
      process.send(txReport);
    }
  }

  async signTransaction(tx) {
    return this.account.signTransaction(tx);
  }

  async signAndSendTransaction(tx) {
    const signedTx = await this.signTransaction(tx);
    const receipt = this.web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    this.reportTx(tx);
    return receipt;
  }
}

module.exports = VirtualUserEth;
