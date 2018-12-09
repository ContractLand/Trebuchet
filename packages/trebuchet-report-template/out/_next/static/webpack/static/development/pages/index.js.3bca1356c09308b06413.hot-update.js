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
var _jsxFileName = "/Users/raymondyeh/Desktop/chain-hive/packages/hive-report-template/src/components/StatsRow.js";




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
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-2 text-center",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "h5 my-3",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, "Executed"), numBlock("Total", report.length)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-4 text-center",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "h5 my-3",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, "Concurrency"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }, numBlock("Avg Concurrency", Object(lodash__WEBPACK_IMPORTED_MODULE_2__["meanBy"])(concurrencyReport, "concurrency").toFixed(2)), numBlock("Max Concurrency", Object(lodash__WEBPACK_IMPORTED_MODULE_2__["maxBy"])(concurrencyReport, "concurrency").concurrency))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "col-6 text-center",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "h5 my-3",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, "Execution Time"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, numBlock("Avg (ms)", Object(lodash__WEBPACK_IMPORTED_MODULE_2__["meanBy"])(report, "duration").toFixed(2)), numBlock("Longest (ms)", Object(lodash__WEBPACK_IMPORTED_MODULE_2__["maxBy"])(report, "duration").duration), numBlock("Shortest (ms)", Object(lodash__WEBPACK_IMPORTED_MODULE_2__["minBy"])(report, "duration").duration))));
};

StatsRow.propTypes = {
  report: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array,
  concurrencyReport: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array
};
/* harmony default export */ __webpack_exports__["default"] = (StatsRow);

/***/ })

})
//# sourceMappingURL=index.js.3bca1356c09308b06413.hot-update.js.map