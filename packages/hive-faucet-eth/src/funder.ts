import Web3 from "web3";
import {Mutex} from "await-semaphore";

export class Funder {
  web3: Web3;
  rpc: string;
  account: any;
  nonce: number;
  mutex: any;
  nonceArray: number[];

  constructor({rpc, fundingAccount}: {rpc: string, fundingAccount: string}) {
    this.rpc = rpc;
    this.web3 = new Web3(rpc);
    this.account = this.web3.eth.accounts.privateKeyToAccount(fundingAccount);
    this.mutex = new Mutex();
    this.nonceArray = [];
  }

  async _initNonce() {
    if(this.nonce) return this.nonce;
    this.nonce = await this.web3.eth.getTransactionCount(this.account.address , "pending");
    return this.nonce;
  }

  async fund(account: string, amount: string|number) {
    let txPromise;
    await this.mutex.use(async () => {
      await this._initNonce();
      const nonceToUse = this.nonce;
      this.nonce += 1;
      this.nonceArray.push(nonceToUse);
      const tx = {
        gas: 21000,
        to: account,
        from: this.account.address,
        value: amount,
        nonce: nonceToUse,
      }
      const signedTx = await this.account.signTransaction(tx);
      txPromise = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    });
    const txReceipt = await txPromise;
    return txReceipt;
  }
}
