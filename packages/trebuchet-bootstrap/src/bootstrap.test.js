const sinon = require("sinon");
const bootstrap = require("./bootstrap");

class TestVU {
  constructor(state) {
    this.state = state;
    TestVU.initialised = state;
  }

  async run() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.ran = true;
        TestVU.ran = true;
        resolve();
      }, 50);
    });
  }
}

beforeAll(() => {
  sinon.stub(process, "on");
  sinon.stub(process, "exit");
});

afterAll(() => {
  process.on.restore();
  process.exit.restore();
});

test("should bootstrap VU to initilise on process message", () => {
  const clock = sinon.useFakeTimers();

  const testState = {
    foo: "bar"
  };

  // Gets async function from process.on("message", fn)
  bootstrap(TestVU);
  const processingFn = process.on.args[0][1];

  // Test functions inside process.on
  expect(TestVU.initialised).toBe(undefined);
  processingFn(testState);
  expect(TestVU.initialised).toEqual(testState);
  expect(TestVU.ran).toBe(undefined);
  clock.tick(50);
  expect(TestVU.ran).toBe(true);

  clock.restore();
});
