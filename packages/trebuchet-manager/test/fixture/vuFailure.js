const VU = require("trebuchet-vu");

const Sleep = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
class TestVU extends VU {
  async testFn(timeout) {
    return this.txWrapper(
      "FUNDING",
      async t => {
        await Sleep(t);
        throw new Error("DIED");
      },
      timeout
    );
  }

  async run() {
    await this.testFn(20);
  }
}

module.exports = TestVU;
