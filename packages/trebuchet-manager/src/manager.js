const Bottleneck = require("bottleneck");
const debug = require("debug");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const { join } = require("path");
const tmp = require("tmp");
const logUpdate = require("log-update");
const reportGenerator = require("trebuchet-report-template");
const VuPicker = require("./vuPicker");
const {
  DEFAULT_RAMP_PERIOD,
  DEFAULT_CONCURRENCY,
  DEFAULT_ACTIVE_PERIOD,
  DEFAULT_COOLING_PERIOD,
  DEFAULT_ONLINE_REPORTING_PERIOD,
  DEFAULT_REPORT_PATH,
  DEFAULT_TX_REPORT_NAME,
  DEFAULT_VU_REPORT_NAME,
  STAGES
} = require("./config");

const logStage = debug("manager:test-stage");
const logTxReport = debug("manager:report:vu-tx");

class Manager {
  constructor({
    vuScript,
    setupScript,
    rampPeriod = DEFAULT_RAMP_PERIOD,
    concurrency = DEFAULT_CONCURRENCY,
    activePeriod = DEFAULT_ACTIVE_PERIOD,
    coolingTimeout = DEFAULT_COOLING_PERIOD,
    onlineReportingPeriod = DEFAULT_ONLINE_REPORTING_PERIOD,
    reportPath = DEFAULT_REPORT_PATH
  } = {}) {
    // Test scripts
    this.setupScript = setupScript;
    this.vuPicker = new VuPicker(vuScript);

    // Loadtest parameter
    this.rampPeriod = rampPeriod;
    this.concurrency = concurrency;
    this.activePeriod = activePeriod;
    this.coolingTimeout = coolingTimeout;
    this.onlineReportingPeriod = onlineReportingPeriod;

    // Loadtest states
    this.stage = STAGES.INIT;
    this.currentConcurrency = 1;
    this.vuIndex = 0;
    this.rampUpInterval = null;
    this.hardstopTimeout = null;
    this.startTime = null;

    // Concurrency management
    this.vuLimiter = new Bottleneck({ maxConcurrent: this.currentConcurrency });

    // Reporting states
    this.reporter = reportGenerator;
    this.runningInterval = null;
    this.txReports = [];
    this.vuReports = [];
    this.reportPath = reportPath;
  }

  // Internal function to start setup
  async setup() {
    if (this.setupScript) {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      await require(this.setupScript).bind(this)();
    }
  }

  async runTest() {
    this.startTime = Date.now();
    await this.setup();
    this.schedulerSetup();
    this.startRampUp();
  }

  transitStage(stage) {
    this.stage = stage;
    logStage(`Current stage: ${stage}`);
  }

  schedulerSetup() {
    this.vuLimiter.on("empty", () => {
      if (this.stage === STAGES.RAMP_UP || this.stage === STAGES.ACTIVE) {
        this.scheduleVirtualUser();
      } else if (
        this.stage === STAGES.COOL_OFF ||
        this.stage === STAGES.TERMINATED
      ) {
        this.softStop();
      }
    });
  }

  onlineReporting() {
    const report = `
    STAGE: ${this.stage}
    Elapsed Time: ${Date.now() - this.startTime} ms
    ==========================================
    VU Concurrency: ${this.vuLimiter.counts().EXECUTING}
    ==========================================
    VU Executed: ${this.vuReports.length}
    TX Executed: ${this.txReports.length}
    `;
    logUpdate(report);
  }

  startRampUp() {
    this.transitStage(STAGES.RAMP_UP);
    const rampUp = () => {
      if (this.currentConcurrency < this.concurrency) {
        this.currentConcurrency += 1;
        this.vuLimiter.updateSettings({
          maxConcurrent: this.currentConcurrency
        });
      } else {
        this.startActive();
      }
    };

    this.rampUpInterval = setInterval(
      rampUp,
      this.rampPeriod / this.concurrency
    );
    this.runningInterval = setInterval(() => {
      this.onlineReporting();
    }, this.onlineReportingPeriod);
    this.scheduleVirtualUser();
  }

  startActive() {
    this.transitStage(STAGES.ACTIVE);
    clearInterval(this.rampUpInterval);
    setTimeout(() => {
      this.startCoolOff();
    }, this.activePeriod);
  }

  startCoolOff() {
    this.transitStage(STAGES.COOL_OFF);
    this.vuLimiter.stop({ dropWaitingJobs: false });
    this.hardstopTimeout = setTimeout(() => {
      this.hardStop();
    }, this.coolingTimeout);
  }

  softStop() {
    clearTimeout(this.hardstopTimeout);
    this.hardStop();
  }

  hardStop() {
    clearInterval(this.runningInterval);
    this.transitStage(STAGES.TERMINATED);
    this.onlineReporting();
    this.generateReport();
  }

  generateReport() {
    const tmpDir = tmp.dirSync().name;
    const txReportPath = join(tmpDir, DEFAULT_TX_REPORT_NAME);
    const vuReportPath = join(tmpDir, DEFAULT_VU_REPORT_NAME);

    fs.writeFileSync(txReportPath, JSON.stringify(this.txReports, null, 2));
    fs.writeFileSync(vuReportPath, JSON.stringify(this.vuReports, null, 2));

    this.reporter(vuReportPath, txReportPath, this.reportPath);
    process.exit();
  }

  processTxReport(report) {
    logTxReport(report);
    this.txReports.push(report);
  }

  // Run a virtual user in the queue
  scheduleVirtualUser() {
    this.vuLimiter.schedule(this.runVirtualUser.bind(this));
  }

  async runVirtualUser() {
    const index = this.vuIndex;
    this.vuIndex += 1;
    const id = uuid();
    const logVu = debug(`vu:${id}`);
    const vu = this.vuPicker.getVu();

    // eslint-disable-next-line import/no-dynamic-require, global-require
    const VirtualUser = require(vu.script);

    const start = Date.now();
    const proc = new Promise(async resolve => {
      const initialState = {
        id,
        index,
        reporter: { reportTransaction: this.processTxReport.bind(this) }
      };
      const instance = new VirtualUser(initialState);
      logVu(`started`);
      await instance.run();
      logVu(`ended`);
      resolve();
    });
    await proc;
    const end = Date.now();
    const vuReport = {
      type: "VU",
      name: vu.name,
      vu: id,
      start,
      end,
      duration: end - start
    };
    this.vuReports.push(vuReport);
  }
}

module.exports = Manager;
