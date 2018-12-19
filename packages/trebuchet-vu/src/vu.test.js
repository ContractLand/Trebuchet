const sinon = require("sinon");
const VU = require("./vu");

const index = 10;
const id = 1337;

describe("constructor", () => {
  test("should set properties correctly", () => {
    const vu = new VU({
      index,
      id
    });
    expect(vu.id).toBe(id);
    expect(vu.index).toBe(index);
  });
});

describe("methods", () => {
  let vu;

  beforeEach(() => {
    vu = new VU({
      index,
      id,
      reporter: {
        reportSuccess: sinon.stub(),
        reportFailure: sinon.stub()
      }
    });
  });

  describe("txWrapper", () => {
    test("should wrap a function, and time it's execution", async () => {
      const reportedName = "TestAsyncFn";
      const returnedResults = "Done!";

      const testAsyncFn = sinon.stub();
      testAsyncFn.resolves(returnedResults);
      vu.reportSuccess = sinon.stub();

      const res = await vu.txWrapper(reportedName, testAsyncFn, 1, 2, 3);
      expect(res).toBe(returnedResults);

      const report = vu.reportSuccess.args[0][0];
      expect(report.name).toEqual(reportedName);
      expect(report.start).toBeTruthy();
      expect(report.end).toBeTruthy();
      expect(report.duration).toEqual(report.end - report.start);
      expect(report.error).toBe(false);
      expect(report.data).toEqual(returnedResults);
      expect(testAsyncFn.args[0]).toEqual([1, 2, 3]);
    });

    test("should report failures", async () => {
      const reportedName = "TestAsyncFn";

      const testAsyncFn = sinon.stub();
      testAsyncFn.rejects(new Error("Boom!"));

      vu.reportFailure = sinon.stub();

      const failedFn = vu.txWrapper(reportedName, testAsyncFn, 1, 2, 3);

      await expect(failedFn).rejects.toEqual(new Error("Boom!"));

      const report = vu.reportFailure.args[0][0];
      expect(report.error).toEqual(true);
      expect(report.trace).toBeTruthy();
      expect(report.name).toEqual("TestAsyncFn");
      expect(testAsyncFn.args[0]).toEqual([1, 2, 3]);
    });
  });

  describe("reportSuccess", () => {
    test("should execute reportSuccess() with the additional data", () => {
      vu.reportSuccess({ foo: "bar" });
      expect(vu.reporter.reportSuccess.args[0][0]).toEqual({
        foo: "bar",
        vu: 1337,
        type: "TX"
      });
    });
  });

  describe("reportFailure", () => {
    test("should execute reportFailure() with the additional data", () => {
      vu.reportFailure({ foo: "bar" });
      expect(vu.reporter.reportFailure.args[0][0]).toEqual({
        foo: "bar",
        vu: 1337,
        type: "TX"
      });
    });
  });
});
