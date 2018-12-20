const { join } = require("path");
const Manager = require("../src/manager");

const SETUP_SCRIPT = join(__dirname, "./fixtures/setup.js");
const VU_SCRIPT = join(__dirname, "./fixtures/vu.js");
const VU_SCRIPT_2 = join(__dirname, "./fixtures/vu2.js");
const VU_SCRIPT_3 = join(__dirname, "./fixtures/vu3.js");

const rampPeriod = 100;
const concurrency = 2;
const activePeriod = 1000;
const coolingTimeout = 1000;
const onlineReportingPeriod = 100;

const manager = new Manager({
  reportPath: join(__dirname, "../load_test_report"),
  onlineReportingPeriod,
  setupScript: SETUP_SCRIPT,
  vuScript: [
    {
      name: "Funder",
      script: VU_SCRIPT,
      weight: 2
    },
    {
      name: "Sleeper",
      script: VU_SCRIPT_2,
      weight: 3
    },
    {
      name: "Error",
      script: VU_SCRIPT_3,
      weight: 1
    }
  ],
  rampPeriod,
  concurrency,
  activePeriod,
  coolingTimeout
});

manager.runTest();
