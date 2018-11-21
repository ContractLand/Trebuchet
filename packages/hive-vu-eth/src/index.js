const { FaucetClient } = require("hive-grpc");
const Web3 = require("web3");

const RPC_URL = "http://localhost:8545";
const GRPC_URL = "localhost:50051";

const { toBN } = Web3.utils;
class VirtualUserEth {
  constructor({ privateKey, index, peers }) {
    this.index = index;
    this.peers = peers;
    this.privateKey = privateKey;
    this.faucetclient = FaucetClient(GRPC_URL);
    this.web3 = new Web3(RPC_URL);
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.address = this.account.address;
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
}

class VirtualUserDefault extends VirtualUserEth {
  async start() {
    await this.requestFund(1000);
  }
}

module.exports = VirtualUserDefault;
