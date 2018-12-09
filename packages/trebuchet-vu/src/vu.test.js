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
      id
    });
  });

  describe("txWrapper", () => {
    test("should wrap a function, and time it's execution", async () => {
      const reportedName = "TestAsyncFn";
      const timeout = 100;
      const returnedResults = "Done!";

      const testAsyncFn = (a, b, c) => {
        expect(a).toBe(1);
        expect(b).toBe(2);
        expect(c).toBe(3);
        return new Promise(resolve =>
          setTimeout(() => {
            resolve(returnedResults);
          }, timeout)
        );
      };

      vu.reportTx = ({ name, start, end, duration, error, data }) => {
        expect(name).toBe(reportedName);
        expect(duration).toBeGreaterThan(timeout);
        expect(start).toBeLessThan(end);
        expect(end).toBeLessThan(Date.now());
        expect(error).toBe.false;
        expect(data).toBe(returnedResults);
        return data;
      };

      const res = await vu.txWrapper(reportedName, testAsyncFn, 1, 2, 3);
      expect(res).toBe(returnedResults);
    });
  });

  describe("reportTx", () => {
    test("should not do anything if not ran as a child process", () => {
      sinon.stub(process, "send");
      vu.reportTx({ foo: "bar" });
      expect(process.send.firstCall.args[0]).toEqual({
        foo: "bar",
        vu: 1337,
        type: "TX"
      });
      process.send.restore();
    });
  });
});
