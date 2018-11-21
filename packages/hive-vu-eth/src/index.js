const { FaucetClient } = require("hive-grpc");
const Web3 = require("web3");
const RPC_URL = "http://localhost:8545"
const GRPC_URL = "localhost:50051";

class VirtualUserEth {
  constructor({address}){
    this.index = '';
    this.address = address;
    this.privateKey = '';
    this.peers = '';
    this.faucetclient = FaucetClient(GRPC_URL);
    this.web3 = new Web3(RPC_URL);
  }

  async getBalance(){
    return this.web3.eth.getBalance(this.address);
  }

  async getFund(fund){
    const fundTx = await new Promise((resolve, reject) =>{
      this.faucetclient.Fund({ address: this.address, amount: fund }, (err, response) => {
        if (err) return reject(err);
        return resolve(response);
      });
    });
    return fundTx;
  }
  
  async getMinFund(fund){
    const balance = await this.getBalance();
    const amountToFund = fund - balance;
    if(amountToFund <= 0){
      return balance;
    }
    await this.getFund(amountToFund);
    return fund;
  }

  exit(){
    process.exit();
  }
}

class VirtualUserDefault extends VirtualUserEth {
  async start() {
    await this.getFund(1000);
  }
}

module.exports = VirtualUserDefault;

