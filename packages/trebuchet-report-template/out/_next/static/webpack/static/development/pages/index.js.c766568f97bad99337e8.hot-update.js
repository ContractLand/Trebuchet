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





var ReportBody = function ReportBody(txReport) {
  var groupedTx = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["groupBy"])(txReport, "name");
  var data = Object.keys(groupedTx).map(function (name, i) {
    return {
      name: name,
      count: groupedTx[name].length,
      min: Object(lodash__WEBPACK_IMPORTED_MODULE_3__["minBy"])(groupedTx[name], "duration").duration,
      max: Object(lodash__WEBPACK_IMPORTED_MODULE_3__["maxBy"])(groupedTx[name], "duration").duration,
      mean: Object(lodash__WEBPACK_IMPORTED_MODULE_3__["meanBy"])(groupedTx[name], "duration").toFixed(2)
    };
  });
  var columns = [{
    Header: 'Name',
    accessor: 'name'
  }, {
    Header: 'Count',
    accessor: 'count'
  }, {
    Header: 'Min',
    accessor: 'min'
  }, {
    Header: 'Max',
    accessor: 'max'
  }, {
    Header: 'Mean',
    accessor: 'mean'
  }];
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_table__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: "-striped -highlight col-100",
    data: data,
    columns: columns,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  });
};

var StatisticsBreakdown = function StatisticsBreakdown(_ref) {
  var txReport = _ref.txReport;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row mt-5",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  }, ReportBody(txReport));
};

StatisticsBreakdown.propTypes = {
  txReport: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array
};
/* harmony default export */ __webpack_exports__["default"] = (StatisticsBreakdown);

/***/ })

})
//# sourceMappingURL=index.js.c766568f97bad99337e8.hot-update.js.map