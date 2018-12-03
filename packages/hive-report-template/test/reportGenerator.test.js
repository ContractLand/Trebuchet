const { existsSync } = require("fs");
const tmp = require("tmp");
const { join } = require("path");
const generateReport = require("../index");

test("generateReport creates a report in the directory", () => {
  const tmpDir = tmp.dirSync().name;
  generateReport(
    join(__dirname, "fixtures/vuReport.json"),
    join(__dirname, "fixtures/txReport.json"),
    tmpDir
  );

  // Check if the report is generated
  expect(existsSync(join(tmpDir, "index.js"))).toBe.true;
  expect(existsSync(join(tmpDir, "static/txReport.js"))).toBe.true;
  expect(existsSync(join(tmpDir, "static/vuReport.js"))).toBe.true;
  console.log(tmpDir);
});

test("generateReport should throw when arguments are missing", () => {
  const tmpDir = tmp.dirSync().name;
  expect(() => generateReport()).toThrow();
  expect(() =>
    generateReport(null, join(__dirname, "fixtures/txReport.json"), tmpDir)
  ).toThrow();
  expect(() =>
    generateReport(join(__dirname, "fixtures/vuReport.json"), null, tmpDir)
  ).toThrow();
  expect(() =>
    generateReport(
      join(__dirname, "fixtures/vuReport.json"),
      join(__dirname, "fixtures/txReport.json"),
      null
    )
  ).toThrow();
});