webpackHotUpdate("static/development/pages/index.js",{

/***/ "./src/components/StatisticsBreakdown.js":
/*!***********************************************!*\
  !*** ./src/components/StatisticsBreakdown.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-table */ "./node_modules/react-table/es/index.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "/Users/raymondyeh/Desktop/trebuchet/packages/trebuchet-report-template/src/components/StatisticsBreakdown.js";





var ReportBody = function ReportBody(report) {
  var groupedTx = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["groupBy"])(report, "name");
  var data = Object.keys(groupedTx).map(function (name) {
    return {
      name: name,
      count: groupedTx[name].length,
      error: Object(lodash__WEBPACK_IMPORTED_MODULE_3__["countBy"])(groupedTx[name], "error").true || 0,
      min: Object(lodash__WEBPACK_IMPORTED_MODULE_3__["minBy"])(groupedTx[name], "duration").duration,
      max: Object(lodash__WEBPACK_IMPORTED_MODULE_3__["maxBy"])(groupedTx[name], "duration").duration,
      mean: Object(lodash__WEBPACK_IMPORTED_MODULE_3__["meanBy"])(groupedTx[name], "duration").toFixed(2)
    };
  });
  var columns = [{
    Header: "Name",
    accessor: "name"
  }, {
    Header: "Count",
    accessor: "count"
  }, {
    Header: "Error",
    accessor: "error"
  }, {
    Header: "Min",
    accessor: "min"
  }, {
    Header: "Max",
    accessor: "max"
  }, {
    Header: "Mean",
    accessor: "mean"
  }];
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_table__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: "-striped -highlight col",
    minRows: "0",
    data: data,
    columns: columns,
    showPageSizeOptions: false,
    defaultSorted: [{
      id: "name",
      desc: false
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  });
};

var StatisticsBreakdown = function StatisticsBreakdown(_ref) {
  var report = _ref.report;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row my-5",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }, ReportBody(report));
};

StatisticsBreakdown.propTypes = {
  report: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array
};
/* harmony default export */ __webpack_exports__["default"] = (StatisticsBreakdown);

/***/ })

})
//# sourceMappingURL=index.js.c19fa449c34dad0e0700.hot-update.js.map