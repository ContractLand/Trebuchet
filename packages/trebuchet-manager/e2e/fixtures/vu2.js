const bootstrap = require("trebuchet-bootstrap");
const VU = require("trebuchet-vu");
const { Sleep } = require("./utils");

class TestVU extends VU {
  constructor({ index, id }) {
    super({ index, id });
  }

  async testFn(timeout) {
    return this.txWrapper("SLEEPING", Sleep.bind(this), timeout);
  }

  async run() {
    await this.testFn(20);
    await this.testFn(50);
    await this.testFn(100);
  }
}

bootstrap(TestVU);
