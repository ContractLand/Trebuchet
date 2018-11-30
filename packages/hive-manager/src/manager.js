const Bottleneck = require("bottleneck");
const { spawn } = require("child_process");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const { join } = require("path");
const tmp = require("tmp");
const reportGenerator = require("hive-report-template");

const DEFAULT_RAMP_PERIOD = 5000;
const DEFAULT_CONCURRENCY = 10;
const DEFAULT_ACTIVE_PERIOD = 55000;
const DEFAULT_COOLING_PERIOD = 10000;
const DEFAULT_ONLINE_REPORTING_PERIOD = 1000;
const DEFAULT_REPORT_PATH = join(__dirname, "../load_test_report");
const DEFAULT_TX_REPORT_NAME = "txReport.json";
const DEFAULT_VU_REPORT_NAME = "vuReport.json";

const STAGES = {
  INIT: "INIT",
  RAMP_UP: "RAMP_UP",
  ACTIVE: "ACTIVE",
  COOL_OFF: "COOL_OFF",
  TERMINATED: "TERMINATED"
};

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
  }) {
    // Test scripts
    this.setupScript = setupScript;
    this.vuScript = vuScript;

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

    // Concurrency management
    this.vuLimiter = new Bottleneck({ maxConcurrent: this.currentConcurrency });

    // Reporting states
    this.runningInterval = null;
    this.txReports = [];
    this.vuReports = [];
    this.reportPath = reportPath;
  }

  async setup() {
    if (this.setupScript) {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      await require(this.setupScript)();
    }
  }

  async runTest() {
    await this.setup();
    this.startRampUp();
  }

  onlineReporting() {
    console.log(this.vuLimiter.counts());
  }

  startRampUp() {
    this.stage = STAGES.RAMP_UP;
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
    this.vuLimiter.on("empty", () => {
      if (this.stage === STAGES.RAMP_UP || this.stage === STAGES.ACTIVE) {
        this.scheduleVirtualUser();
      } else if (
        this.stage === STAGES.COOL_OFF ||
        this.stage === STAGES.TERMINATED
      ) {
        this.hardStop();
      }
    });
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
    this.stage = STAGES.ACTIVE;
    console.log("STAGE TRANSITED:", this.stage);
    clearInterval(this.rampUpInterval);
    setTimeout(() => {
      this.startCoolOff();
    }, this.activePeriod);
  }

  startCoolOff() {
    this.stage = STAGES.COOL_OFF;
    console.log("STAGE TRANSITED:", this.stage);
    this.vuLimiter.stop({ dropWaitingJobs: false });
    console.log("COOOOOOLING");
    this.hardstopTimeout = setTimeout(() => {
      this.hardStop();
    }, this.coolingTimeout);
  }

  // Hardstop and stop both races to here
  // eslint-disable-next-line class-methods-use-this
  hardStop() {
    // If all the child process ends before the hardstop, clear timeout and stop anyway
    if (this.hardstopTimeout) {
      console.log("Stopping when child process terminates");
      clearTimeout(this.hardstopTimeout);
    } else {
      console.log("HARD STOPPED");
    }
    clearInterval(this.runningInterval);
    this.stage = STAGES.TERMINATED;

    this.generateReport();
  }

  generateReport() {
    const tmpDir = tmp.dirSync().name;
    const txReportPath = join(tmpDir, DEFAULT_TX_REPORT_NAME);
    const vuReportPath = join(tmpDir, DEFAULT_VU_REPORT_NAME);

    fs.writeFileSync(txReportPath, JSON.stringify(this.txReports, null, 2));
    fs.writeFileSync(vuReportPath, JSON.stringify(this.vuReports, null, 2));

    reportGenerator(vuReportPath, txReportPath, this.reportPath);
    process.exit();
  }

  // eslint-disable-next-line class-methods-use-this
  processMessage(report) {
    // console.log("Processing report");
    if (report.type === "TX") {
      this.txReports.push(report);
    } else if (report.type === "VU") {
      this.vuReports.push(report);
    }
  }

  // Run a virtual user in the queue
  scheduleVirtualUser() {
    this.vuLimiter.schedule(this.runVirtualUser.bind(this));
  }

  // Can consider using a fixed list of actors instead of using random keys
  async runVirtualUser() {
    const index = this.vuIndex;
    this.vuIndex += 1;
    const id = uuid();

    const start = Date.now();
    const proc = new Promise((resolve, reject) => {
      const initialState = {
        id,
        index
      };

      const virtualUser = spawn("node", [this.vuScript], {
        stdio: ["pipe", "pipe", "pipe", "ipc"]
      });

      // Print stdout
      virtualUser.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      });

      // Print stderr
      virtualUser.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
      });

      // Async process ends when child process dies
      virtualUser.on("close", code => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
        // console.log(`child process exited with code ${code}`);
      });

      // Handle messages from child processes
      virtualUser.on("message", this.processMessage.bind(this));

      // Start the child process by sending it initial state
      virtualUser.send(initialState);
    });
    await proc;
    const end = Date.now();
    const vuReport = {
      type: "VU",
      vu: id,
      start,
      end,
      duration: end - start
    };
    this.vuReports.push(vuReport);
  }
}

module.exports = Manager;
