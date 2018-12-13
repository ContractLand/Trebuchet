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




var TransactionBreakdown = function TransactionBreakdown(_ref) {
  var txReport = _ref.txReport;
  var res = Object(lodash__WEBPACK_IMPORTED_MODULE_2__["groupBy"])(txReport, 'name');
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "row",
    id: "vu-section",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, JSON.stringify(res));
};

TransactionBreakdown.propTypes = {
  txReport: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array
};
/* harmony default export */ __webpack_exports__["default"] = (TransactionBreakdown);

/***/ })

})
//# sourceMappingURL=index.js.fdfbde538e075145e018.hot-update.js.map