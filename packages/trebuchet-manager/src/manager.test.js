const sinon = require("sinon");
const fs = require("fs");
const tmp = require("tmp");
const JSONStream = require("JSONStream");
const { join } = require("path");

const Manager = require("./manager");
const {
  DEFAULT_RAMP_PERIOD,
  DEFAULT_CONCURRENCY,
  DEFAULT_ACTIVE_PERIOD,
  DEFAULT_COOLING_PERIOD,
  DEFAULT_ONLINE_REPORTING_PERIOD,
  DEFAULT_REPORT_PATH,
  STAGES
} = require("./config");

const TEST_SCRIPT_VU_PATH = join(__dirname, "../test/fixture/vu.js");
const TEST_SCRIPT_VU_FAILURE_PATH = join(
  __dirname,
  "../test/fixture/vuFailure.js"
);
const TEST_SCRIPT_SETUP_PATH = join(__dirname, "../test/fixture/setup.js");

describe("constructor", () => {
  test("should set default properties", () => {
    const mgr = new Manager({
      vuScript: TEST_SCRIPT_VU_PATH
    });
    expect(mgr.rampPeriod).toBe(DEFAULT_RAMP_PERIOD);
    expect(mgr.concurrency).toBe(DEFAULT_CONCURRENCY);
    expect(mgr.activePeriod).toBe(DEFAULT_ACTIVE_PERIOD);
    expect(mgr.coolingTimeout).toBe(DEFAULT_COOLING_PERIOD);
    expect(mgr.onlineReportingPeriod).toBe(DEFAULT_ONLINE_REPORTING_PERIOD);
    expect(mgr.reportPath).toBe(DEFAULT_REPORT_PATH);
  });

  test("should set properties", () => {
    const mgr = new Manager({
      vuScript: TEST_SCRIPT_VU_PATH,
      setupScript: TEST_SCRIPT_SETUP_PATH,
      rampPeriod: 10000,
      concurrency: 50,
      activePeriod: 50000,
      coolingTimeout: 10000,
      onlineReportingPeriod: 5000,
      reportPath: "/tmp"
    });
    expect(mgr.setupScript).toBe(TEST_SCRIPT_SETUP_PATH);
    expect(mgr.rampPeriod).toBe(10000);
    expect(mgr.concurrency).toBe(50);
    expect(mgr.activePeriod).toBe(50000);
    expect(mgr.coolingTimeout).toBe(10000);
    expect(mgr.onlineReportingPeriod).toBe(5000);
    expect(mgr.reportPath).toBe("/tmp");
    expect(mgr.vuPicker).toBeTruthy();
  });

  test("should initialise state", () => {
    const mgr = new Manager({
      vuScript: TEST_SCRIPT_VU_PATH,
      setupScript: TEST_SCRIPT_SETUP_PATH
    });
    expect(mgr.stage).toBe(STAGES.INIT);
    expect(mgr.currentConcurrency).toBe(1);
    expect(mgr.vuIndex).toBe(0);
    expect(mgr.rampUpInterval).toBe(null);
    expect(mgr.hardstopTimeout).toBe(null);
    expect(mgr.runningInterval).toBe(null);
    expect(mgr.txCount).toEqual(0);
    expect(mgr.vuCount).toEqual(0);
  });

  test("should throw if VU script is not present", () => {
    expect(() => new Manager()).toThrow();
  });

  test("reporterSetup should setup output streams and transforms for both reports", () => {
    sinon.stub(JSONStream, "stringify");
    sinon.stub(fs, "createWriteStream");
    sinon.stub(tmp, "dirSync");

    const fakeStream = { pipe: sinon.stub() };

    tmp.dirSync.returns({
      name: "some/random/path"
    });
    JSONStream.stringify.returns(fakeStream);
    fs.createWriteStream.returns("WRITE_STREAM");

    const mgr = new Manager({
      vuScript: TEST_SCRIPT_VU_PATH,
      setupScript: TEST_SCRIPT_SETUP_PATH
    });

    expect(mgr.tmpDir).toBeTruthy();
    expect(fs.createWriteStream.args).toEqual([
      ["some/random/path/txReport.json"],
      ["some/random/path/vuReport.json"]
    ]);
    expect(fakeStream.pipe.args).toEqual([["WRITE_STREAM"], ["WRITE_STREAM"]]);
    expect(mgr.txRecordStream).toEqual(fakeStream);
    expect(mgr.vuRecordStream).toEqual(fakeStream);
    expect(mgr.txOutputStream).toBe("WRITE_STREAM");
    expect(mgr.vuOutputStream).toBe("WRITE_STREAM");

    JSONStream.stringify.restore();
    fs.createWriteStream.restore();
    tmp.dirSync.restore();
  });
});

describe("methods", () => {
  let mgr;
  let clock;

  beforeEach(() => {
    mgr = new Manager({
      vuScript: TEST_SCRIPT_VU_PATH,
      setupScript: TEST_SCRIPT_SETUP_PATH
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  describe("setup", () => {
    test("should run the setup script if available", async () => {
      const deferred = mgr.setup();
      expect(mgr.SETUP_SCRIPT_RAN).toBe(undefined);
      clock.tick(20);
      await deferred;
      expect(mgr.SETUP_SCRIPT_RAN).toBe(true);
    });
  });

  describe("runTest", () => {
    test("should run setup, schedulerSetup and startRampUp", async () => {
      mgr.setup = sinon.stub();
      mgr.setup.resolves();
      mgr.schedulerSetup = sinon.stub();
      mgr.startRampUp = sinon.stub();

      await mgr.runTest();
      expect(mgr.setup.called).toBe(true);
      expect(mgr.schedulerSetup.called).toBe(true);
      expect(mgr.startRampUp.called).toBe(true);
    });

    test("should throw when setup script fail", async () => {
      mgr.setup = sinon.stub();
      mgr.setup.rejects();
      mgr.startRampUp = sinon.stub();
      await expect(mgr.runTest()).rejects.toBeTruthy();
    });
  });

  describe("schedulerSetup", () => {
    const mockLimiter = {
      on: (evtName, cb) => {
        expect(evtName).toBe("empty");
        cb();
      }
    };
    const runInStage = (_mgr, stage) => {
      mgr.stage = stage;
      mgr.scheduleVirtualUser = sinon.stub();
      mgr.softStop = sinon.stub();
      mgr.vuLimiter = mockLimiter;
      mgr.schedulerSetup();
    };

    test("should call scheduleVirtualUser() if it is in RAMP_UP stage", () => {
      runInStage(mgr, STAGES.RAMP_UP);
      expect(mgr.scheduleVirtualUser.called).toBe(true);
      expect(mgr.softStop.called).toBe(false);
    });

    test("should call scheduleVirtualUser() if it is in ACTIVE stage", () => {
      runInStage(mgr, STAGES.ACTIVE);
      expect(mgr.scheduleVirtualUser.called).toBe(true);
      expect(mgr.softStop.called).toBe(false);
    });

    test("should not call scheduleVirtualUser() if it is in COOL_OFF stage", () => {
      runInStage(mgr, STAGES.COOL_OFF);
      expect(mgr.scheduleVirtualUser.called).toBe(false);
      expect(mgr.softStop.called).toBe(true);
    });

    test("should not call scheduleVirtualUser() if it is in TERMINATED stage", () => {
      runInStage(mgr, STAGES.TERMINATED);
      expect(mgr.scheduleVirtualUser.called).toBe(false);
      expect(mgr.softStop.called).toBe(true);
    });
  });

  describe("startRampUp", () => {
    test("should ramp up concurrency, start report, and call startActive() upon reaching maxConcurrency", () => {
      mgr.concurrency = 3;
      mgr.rampPeriod = 60;
      mgr.onlineReportingPeriod = 10;

      mgr.startActive = sinon.stub();
      mgr.scheduleVirtualUser = sinon.stub();
      mgr.startActive = sinon.stub();
      mgr.vuLimiter = { updateSettings: sinon.stub() };
      mgr.onlineReporting = sinon.stub();

      mgr.startRampUp();

      expect(mgr.stage).toBe(STAGES.RAMP_UP);
      expect(mgr.rampUpInterval).toBeTruthy();
      expect(mgr.runningInterval).toBeTruthy();
      expect(mgr.scheduleVirtualUser.called).toBe(true);

      expect(mgr.currentConcurrency).toBe(1);
      expect(mgr.startActive.called).toBe(false);

      clock.tick(20);

      expect(mgr.currentConcurrency).toBe(2);
      expect(mgr.vuLimiter.updateSettings.args[0]).toEqual([
        {
          maxConcurrent: 2
        }
      ]);
      expect(mgr.startActive.called).toBe(false);
      expect(mgr.onlineReporting.callCount).toBe(2);

      clock.tick(20);

      expect(mgr.currentConcurrency).toBe(3);
      expect(mgr.vuLimiter.updateSettings.args[1]).toEqual([
        {
          maxConcurrent: 3
        }
      ]);
      expect(mgr.startActive.called).toBe(false);
      expect(mgr.onlineReporting.callCount).toBe(4);

      clock.tick(20);

      expect(mgr.currentConcurrency).toBe(3);
      expect(mgr.startActive.called).toBe(true);
      expect(mgr.onlineReporting.callCount).toBe(6);
    });
  });

  describe("startActive", () => {
    test("removes rampUp interval, allow VUs to run wait for cooldown", () => {
      sinon.stub(clearInterval.clock, "clearInterval");
      mgr.transitStage = sinon.stub();
      mgr.startCoolOff = sinon.stub();
      mgr.activePeriod = 20;

      mgr.startActive();

      expect(mgr.transitStage.args[0]).toEqual([STAGES.ACTIVE]);
      expect(mgr.startCoolOff.called).toBe(false);
      expect(clearInterval.clock.clearInterval.called).toBe(true);

      clock.tick(20);

      expect(mgr.startCoolOff.called).toBe(true);

      clearInterval.clock.clearInterval.restore();
    });
  });

  describe("startCoolOff", () => {
    test("stops all vuLimiter job and set a hardStop timeout", () => {
      mgr.transitStage = sinon.stub();
      mgr.hardStop = sinon.stub();
      mgr.vuLimiter = { stop: sinon.stub() };
      mgr.coolingTimeout = 20;

      mgr.startCoolOff();

      expect(mgr.transitStage.args[0]).toEqual([STAGES.COOL_OFF]);
      expect(mgr.vuLimiter.stop.args[0]).toEqual([{ dropWaitingJobs: false }]);
      expect(mgr.hardStop.called).toBe(false);

      clock.tick(20);

      expect(mgr.hardStop.called).toBe(true);
    });
  });

  describe("softStop", () => {
    test("should clear hardstop timeout and run hardStop", () => {
      sinon.stub(clearTimeout.clock, "clearTimeout");
      mgr.hardStop = sinon.stub();

      mgr.softStop();
      expect(clearTimeout.clock.clearTimeout.called).toBe(true);
      expect(mgr.hardStop.called).toBe(true);

      clearTimeout.clock.clearTimeout.restore();
    });
  });

  describe("hardStop", () => {
    test("should clear reporting interval and generate report", () => {
      sinon.stub(clearInterval.clock, "clearInterval");
      mgr.transitStage = sinon.stub();
      mgr.generateReport = sinon.stub();

      mgr.hardStop();

      expect(clearInterval.clock.clearInterval.called).toBe(true);
      expect(mgr.transitStage.args[0]).toEqual([STAGES.TERMINATED]);
      expect(mgr.generateReport.called).toBe(true);

      clearInterval.clock.clearInterval.restore();
    });
  });

  describe("generateReport", () => {
    test("should call reportGenerator the report paths and exit the process", async () => {
      sinon.stub(process, "exit");
      mgr.txOutputStream = { on: sinon.stub() };
      mgr.txRecordStream = { end: sinon.stub() };

      mgr.vuOutputStream = { on: sinon.stub() };
      mgr.vuRecordStream = { end: sinon.stub() };

      mgr.reporter = sinon.stub();

      const deferred = mgr.generateReport();
      expect(mgr.txRecordStream.end.called).toBe(true);
      expect(mgr.txOutputStream.on.args[0][0]).toBe("finish");
      mgr.txOutputStream.on.args[0][1]();

      expect(mgr.vuRecordStream.end.called).toBe(true);
      expect(mgr.vuOutputStream.on.args[0][0]).toBe("finish");
      mgr.vuOutputStream.on.args[0][1]();

      await deferred;

      expect(mgr.reporter.called).toBe(true);
      expect(process.exit.called).toBe(true);

      process.exit.restore();
    });
  });

  describe("processTxReport", () => {
    test("should add VU's transaction report to the TX stream", () => {
      mgr.txRecordStream.write = sinon.stub();
      mgr.processTxReport({ foo: "bar" });
      expect(mgr.txCount).toBe(1);
      expect(mgr.txRecordStream.write.args[0]).toEqual([{ foo: "bar" }]);
    });
  });

  describe("processFailureTxReport", () => {
    test("should call processTxReport and add a error count", () => {
      mgr.processTxReport = sinon.stub();
      mgr.processFailureTxReport({ foo: "bar" });
      expect(mgr.txErrorCount).toBe(1);
      expect(mgr.processTxReport.args[0]).toEqual([{ foo: "bar" }]);
    });
  });

  describe("scheduleVirtualUser", () => {
    test("schedule a runVirtualUser", () => {
      mgr.runVirtualUser = function boundedFn() {
        return this.name;
      };
      mgr.vuLimiter = { schedule: sinon.stub() };
      mgr.scheduleVirtualUser();
      mgr.name = "Manager Instance";

      expect(mgr.vuLimiter.schedule.called).toBe(true);

      // Checks if the runVirtualUser has been bound
      const passedFn = mgr.vuLimiter.schedule.args[0][0];
      expect(passedFn()).toBe("Manager Instance");
    });
  });

  describe("runVirtualUser", async () => {
    test("should run a virtual user script", async () => {
      mgr.vuIndex = 5;
      mgr.processTxReport = sinon.stub();

      const deferred = mgr.runVirtualUser();
      clock.tick(20);
      await deferred;

      const txReport = mgr.processTxReport.args[0][0];
      expect(txReport.vu).toBeTruthy();
      expect(txReport.type).toBe("TX");

      expect(mgr.vuCount).toBe(1);
    });

    test("should log a fail when VU throws an error", async () => {
      mgr = new Manager({
        vuScript: TEST_SCRIPT_VU_FAILURE_PATH,
        setupScript: TEST_SCRIPT_SETUP_PATH
      });
      mgr.processTxReport = sinon.stub();
      mgr.processFailureTxReport = sinon.stub();
      mgr.vuRecordStream = { write: sinon.stub() };

      const deferred = mgr.runVirtualUser();
      clock.tick(20);
      await deferred;

      expect(mgr.processTxReport.called).toBe(false);

      // Log transaction error
      const txErrReport = mgr.processFailureTxReport.args[0][0];
      expect(txErrReport.name).toBe("FUNDING");
      expect(txErrReport.start).toBe(0);
      expect(txErrReport.end).toBe(20);
      expect(txErrReport.duration).toBe(20);
      expect(txErrReport.vu).toBeTruthy();
      expect(txErrReport.type).toBe("TX");
      expect(txErrReport.error).toBe(true);
      expect(txErrReport.trace.message).toEqual("DIED");

      // Log vu error
      expect(mgr.vuErrorCount).toBe(1);
      const vuErrorReport = mgr.vuRecordStream.write.args[0][0];
      expect(vuErrorReport.type).toBe("VU");
      expect(vuErrorReport.vu).toBeTruthy();
      expect(vuErrorReport.name).toBe("DEFAULT_VU");
      expect(vuErrorReport.start).toBe(0);
      expect(vuErrorReport.end).toBe(20);
      expect(vuErrorReport.duration).toBe(20);
      expect(vuErrorReport.error).toBe(true);
      expect(vuErrorReport.trace.message).toEqual("DIED");
    });

    test("should use vu's logger to log transaction", async () => {
      mgr.vuIndex = 5;
      mgr.processTxReport = sinon.stub();
      mgr.vuRecordStream = { write: sinon.stub() };
      mgr.processFailureTxReport = sinon.stub();

      const deferred = mgr.runVirtualUser();
      clock.tick(20);
      await deferred;

      expect(mgr.vuCount).toBe(1);
      expect(mgr.vuErrorCount).toBe(0);
      expect(mgr.processFailureTxReport.called).toBe(false);

      // Log tx report
      const txReport = mgr.processTxReport.args[0][0];
      expect(txReport.name).toBe("FUNDING");
      expect(txReport.start).toBe(0);
      expect(txReport.end).toBe(20);
      expect(txReport.duration).toBe(20);
      expect(txReport.vu).toBeTruthy();
      expect(txReport.type).toBe("TX");
      expect(txReport.error).toBe(false);

      // Log vu report
      const vuErrorReport = mgr.vuRecordStream.write.args[0][0];
      expect(vuErrorReport.type).toBe("VU");
      expect(vuErrorReport.vu).toBeTruthy();
      expect(vuErrorReport.name).toBe("DEFAULT_VU");
      expect(vuErrorReport.start).toBe(0);
      expect(vuErrorReport.end).toBe(20);
      expect(vuErrorReport.duration).toBe(20);
      expect(vuErrorReport.error).toBe(false);
    });
  });
});
