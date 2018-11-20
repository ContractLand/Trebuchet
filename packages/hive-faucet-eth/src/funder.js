const Web3 = require("web3");
const { Mutex } = require("await-semaphore");

class Funder {
  constructor({ rpc, fundingAccount }) {
    this.rpc = rpc;
    this.web3 = new Web3(rpc);
    this.account = this.web3.eth.accounts.privateKeyToAccount(fundingAccount);
    this.mutex = new Mutex();
    this.nonceArray = [];
  }

  async initNonce() {
    if (this.nonce) return this.nonce;
    this.nonce = await this.web3.eth.getTransactionCount(
      this.account.address,
      "pending"
    );
    return this.nonce;
  }

  async fund(account, amount) {
    let txPromise;
    await this.mutex.use(async () => {
      await this.initNonce();
      const nonceToUse = this.nonce;
      this.nonce += 1;
      this.nonceArray.push(nonceToUse);
      const tx = {
        gas: 21000,
        to: account,
        from: this.account.address,
        value: amount,
        nonce: nonceToUse
      };
      const signedTx = await this.account.signTransaction(tx);
      txPromise = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      // Alternatively, wait for receipt
    });
    const txReceipt = await txPromise;
    return txReceipt;
  }
}

module.exports = Funder;
