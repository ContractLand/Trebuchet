const { join } = require("path");
const Manager = require("./manager");

const SETUP_SCRIPT = join(__dirname, "../test/fixture/ethFaucet.js");
const VU_SCRIPT = join(__dirname, "../test/fixture/fundAndSendVu.js");

const rampPeriod = 5000;
const concurrency = 20;
const activePeriod = 55000;
const coolingTimeout = 10000;

const manager = new Manager({
  setupScript: SETUP_SCRIPT,
  vuScript: VU_SCRIPT,
  rampPeriod,
  concurrency,
  activePeriod,
  coolingTimeout
});

manager.runTest();
