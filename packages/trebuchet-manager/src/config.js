const { join } = require("path");

module.exports = {
  DEFAULT_RAMP_PERIOD: 5000,
  DEFAULT_CONCURRENCY: 10,
  DEFAULT_ACTIVE_PERIOD: 55000,
  DEFAULT_COOLING_PERIOD: 10000,
  DEFAULT_ONLINE_REPORTING_PERIOD: 1000,
  DEFAULT_REPORT_PATH: join(__dirname, "../load_test_report"),
  DEFAULT_TX_REPORT_NAME: "txReport.json",
  DEFAULT_VU_REPORT_NAME: "vuReport.json",
  STAGES: {
    INIT: "INIT",
    RAMP_UP: "RAMP_UP",
    ACTIVE: "ACTIVE",
    COOL_OFF: "COOL_OFF",
    TERMINATED: "TERMINATED"
  }
};
