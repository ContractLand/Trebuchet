const { join } = require("path");
const Manager = require("./manager");

const SETUP_SCRIPT = join(__dirname, "../test/fixture/ethFaucet.js");
const VU_SCRIPT = join(__dirname, "../test/fixture/fundAndSendVu.js");

const rampPeriod = 1000;
const concurrency = 1;
const activePeriod = 3000;
const coolingTimeout = 5000;

const manager = new Manager({
  setupScript: SETUP_SCRIPT,
  vuScript: VU_SCRIPT,
  rampPeriod,
  concurrency,
  activePeriod,
  coolingTimeout
});

manager.runTest();
