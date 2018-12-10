const { join } = require("path");
const Manager = require("../src/manager");

const SETUP_SCRIPT = join(__dirname, "./fixtures/setup.js");
const VU_SCRIPT = join(__dirname, "./fixtures/vu.js");

const rampPeriod = 100;
const concurrency = 2;
const activePeriod = 1000;
const coolingTimeout = 1000;

const manager = new Manager({
  reportPath: join(__dirname, "../load_test_report"),
  setupScript: SETUP_SCRIPT,
  vuScript: VU_SCRIPT,
  rampPeriod,
  concurrency,
  activePeriod,
  coolingTimeout
});

manager.runTest();
