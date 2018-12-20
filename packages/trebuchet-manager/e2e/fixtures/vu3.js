const VU = require("trebuchet-vu");
const { Sleep } = require("./utils");

class TestVU extends VU {
  async testFn(timeout) {
    return this.txWrapper("SLEEPING", Sleep.bind(this), timeout);
  }

  async testFn2(timeout) {
    return this.txWrapper(
      "SLEEPING",
      async t => {
        await Sleep(t);
        throw new Error("Slept too much");
      },
      timeout
    );
  }

  async run() {
    await this.testFn(20);
    await this.testFn2(100);
  }
}

module.exports = TestVU;
