const { join } = require("path");
const { copyFileSync } = require("fs");
const copydir = require("copy-dir");

const generateReport = (vuReportPath, txReportPath, pathToCreateReport) => {
  if (!vuReportPath || !txReportPath || !pathToCreateReport) {
    throw Error(
      "Arguments missing (vuReportPath, txReportPath, pathToCreateReport) should be set"
    );
  }

  // Copy content from out to path
  copydir.sync(join(__dirname, "./out"), pathToCreateReport);

  // Copy both vuReport and txReport to folder in path
  copyFileSync(vuReportPath, join(pathToCreateReport, "static/vuReport.json"));
  copyFileSync(txReportPath, join(pathToCreateReport, "static/txReport.json"));
};

module.exports = generateReport;
