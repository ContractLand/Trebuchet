const { FaucetClient } = require("hive-grpc");
const Web3 = require("web3");

const RPC_URL = "http://localhost:8545";
const GRPC_URL = "localhost:50051";

const { toBN } = Web3.utils;
class VirtualUserEth {
  constructor({ privateKey, peers, rpc, grpc }) {
    this.rpc = rpc || RPC_URL;
    this.grpc = grpc || GRPC_URL;
    this.peers = peers;
    this.privateKey = privateKey;
    this.faucetclient = FaucetClient(GRPC_URL);
    this.web3 = new Web3(this.rpc);
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
