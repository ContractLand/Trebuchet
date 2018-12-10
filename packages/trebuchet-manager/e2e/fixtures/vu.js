const VU = require("trebuchet-vu");
const { Sleep } = require("./utils");

class TestVU extends VU {
  constructor({ index, id }) {
    super({ index, id });
  }

  async testFn(timeout) {
    return this.txWrapper("FUNDING", Sleep.bind(this), timeout);
  }

  async start() {
    await this.testFn(20);
    await this.testFn(50);
    await this.testFn(100);
  }
}

process.on("message", async state => {
  const vu = new TestVU(state);
  await vu.start();
  process.exit();
});
