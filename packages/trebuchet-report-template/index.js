const { join } = require("path");
const { ensureDirSync } = require("fs-extra");
const { writeFileSync } = require("fs");
const copydir = require("copy-dir");

const generateReport = (vuReportPath, txReportPath, pathToCreateReport) => {
  if (!vuReportPath || !txReportPath || !pathToCreateReport) {
    throw Error(
      "Arguments missing (vuReportPath, txReportPath, pathToCreateReport) should be set"
    );
  }

  // Copy content from out to path
  copydir.sync(join(__dirname, "out"), pathToCreateReport);

  ensureDirSync(join(pathToCreateReport, "static"));
  // Copy both vuReport and txReport to folder in path
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const vuReport = require(vuReportPath);
  writeFileSync(
    join(pathToCreateReport, "static/vuReport.js"),
    `window.vuReport =${JSON.stringify(vuReport, null, 2)}`
  );

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const txReport = require(txReportPath);
  writeFileSync(
    join(pathToCreateReport, "static/txReport.js"),
    `window.txReport = ${JSON.stringify(txReport, null, 2)}`
  );
};

module.exports = generateReport;
