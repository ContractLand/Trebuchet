webpackHotUpdate("static/development/pages/index.js",{

/***/ "./src/components/StatsRow.js":
/*!************************************!*\
  !*** ./src/components/StatsRow.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "/Users/raymondyeh/Desktop/trebuchet/packages/trebuchet-report-template/src/components/StatsRow.js";




var numBlock = function numBlock(header, num) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 5
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "h6",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: this
  }, header), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "h2",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, num));
};

var StatsRow = function StatsRow(_ref) {
  var report = _ref.report,
      concurrencyReport = _ref.concurrencyReport;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row",
    id: "vu-section",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, numBlock("Total Executed", report.length), numBlock("Total Executed", JSON.stringify(Object(lodash__WEBPACK_IMPORTED_MODULE_2__["countBy"])(report, "error"))), numBlock("Avg Concurrency", Object(lodash__WEBPACK_IMPORTED_MODULE_2__["meanBy"])(concurrencyReport, "concurrency").toFixed(2)), numBlock("Max Concurrency", Object(lodash__WEBPACK_IMPORTED_MODULE_2__["maxBy"])(concurrencyReport, "concurrency").concurrency), numBlock("Avg Time (ms)", Object(lodash__WEBPACK_IMPORTED_MODULE_2__["meanBy"])(report, "duration").toFixed(2)), numBlock("Longest Time (ms)", Object(lodash__WEBPACK_IMPORTED_MODULE_2__["maxBy"])(report, "duration").duration), numBlock("Shortest Time (ms)", Object(lodash__WEBPACK_IMPORTED_MODULE_2__["minBy"])(report, "duration").duration));
};

StatsRow.propTypes = {
  report: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array,
  concurrencyReport: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array
};
/* harmony default export */ __webpack_exports__["default"] = (StatsRow);
/*

    <div className="col-2 text-center">
      <div className="h5 my-3">Executed</div>
      {numBlock("Total", report.length)}
    </div>
    <div className="col-4 text-center">
      <div className="h5 my-3">Concurrency</div>
      <div className="row">
        {numBlock(
          "Avg Concurrency",
          meanBy(concurrencyReport, "concurrency").toFixed(2)
        )}
        {numBlock(
          "Max Concurrency",
          maxBy(concurrencyReport, "concurrency").concurrency
        )}
      </div>
    </div>
    <div className="col-6 text-center">
      <div className="h5 my-3">Execution Time</div>
      <div className="row">
        {numBlock("Avg (ms)", meanBy(report, "duration").toFixed(2))}
        {numBlock("Longest (ms)", maxBy(report, "duration").duration)}
        {numBlock("Shortest (ms)", minBy(report, "duration").duration)}
      </div>
    </div>

    */

/***/ })

})
//# sourceMappingURL=index.js.76aa7736635f41b17cd6.hot-update.js.map