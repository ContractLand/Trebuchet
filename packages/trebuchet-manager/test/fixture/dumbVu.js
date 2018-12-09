const VU = require("hive-vu-eth");

const sleep = t => new Promise(resolve => setTimeout(resolve, t));

class Actor extends VU {
  // eslint-disable-next-line class-methods-use-this
  async start() {
    console.log("Hello");
    await sleep(200);
    console.log("Sending tx");
    await sleep(200);
    process.send({ report: "200" });
    console.log("Done!");
  }
}

// Assumption: Message will only be sent to actor for initialisation
process.on("message", async state => {
  const actor = new Actor(state);
  await actor.start();
  process.exit();
});
