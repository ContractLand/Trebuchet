const VU = require("hive-vu-eth");

class Actor extends VU {
  // eslint-disable-next-line class-methods-use-this

  async start() {
    console.log("LOADED");
    // Request for some ether from the faucet
    await this.requestMinFund(this.toWei("0.01", "ether"));
    console.log("LOADED2");

    let nonce = await this.getNonce();
    const tx = {
      to: "0x3c7539cd57b7e03f722c3aeb636247188b25dcc4",
      value: this.toWei("0.002", "ether"),
      gas: 21000,
      nonce
    };
    await this.signAndSendTransaction(tx);

    nonce += 1;

    await this.signAndSendTransaction({
      ...tx,
      nonce
    });

    nonce += 1;
    await this.signAndSendTransaction({
      ...tx,
      nonce
    });
  }
}

// Assumption: Message will only be sent to actor for initialisation
process.on("message", async state => {
  const actor = new Actor(state);
  await actor.start();
  process.exit();
});
