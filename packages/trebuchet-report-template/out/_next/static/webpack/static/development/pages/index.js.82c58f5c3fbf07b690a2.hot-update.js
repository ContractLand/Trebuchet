webpackHotUpdate("static/development/pages/index.js",{

/***/ "./src/components/TransactionBreakdown.js":
/*!************************************************!*\
  !*** ./src/components/TransactionBreakdown.js ***!
  \************************************************/
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
var _jsxFileName = "/Users/raymondyeh/Desktop/trebuchet/packages/trebuchet-report-template/src/components/TransactionBreakdown.js";




var ReportBody = function ReportBody(txReport) {
  var groupedTx = Object(lodash__WEBPACK_IMPORTED_MODULE_2__["groupBy"])(txReport, "name");
  var row = Object.keys(groupedTx).map(function (name, i) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      key: i,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 8
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 9
      },
      __self: this
    }, name), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 10
      },
      __self: this
    }, groupedTx[name].length), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 11
      },
      __self: this
    }, Object(lodash__WEBPACK_IMPORTED_MODULE_2__["minBy"])(groupedTx[name], "duration").duration), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 12
      },
      __self: this
    }, Object(lodash__WEBPACK_IMPORTED_MODULE_2__["maxBy"])(groupedTx[name], "duration").duration), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 13
      },
      __self: this
    }, Object(lodash__WEBPACK_IMPORTED_MODULE_2__["meanBy"])(groupedTx[name], "duration").toFixed(2)));
  });
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, row);
};

var StatisticsBreakdown = function StatisticsBreakdown(_ref) {
  var txReport = _ref.txReport;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    className: "table",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, "Transaction Type"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    },
    __self: this
  }, "No. Execution"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }, "Shortest Execution (ms)"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, "Longest Execution (ms)"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
    scope: "col",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }, "Average Execution (ms)"))), ReportBody(txReport)));
};

StatisticsBreakdown.propTypes = {
  txReport: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array
};
/* harmony default export */ __webpack_exports__["default"] = (StatisticsBreakdown);

/***/ })

})
//# sourceMappingURL=index.js.82c58f5c3fbf07b690a2.hot-update.js.map