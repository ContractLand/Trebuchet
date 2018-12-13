webpackHotUpdate("static/development/pages/index.js",{

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_utils_charts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/utils/charts */ "./src/utils/charts.js");
/* harmony import */ var _src_components_ConcurrencyGraph__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/components/ConcurrencyGraph */ "./src/components/ConcurrencyGraph.js");
/* harmony import */ var _src_components_StatsRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/components/StatsRow */ "./src/components/StatsRow.js");
/* harmony import */ var _src_components_DistributionChart__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/components/DistributionChart */ "./src/components/DistributionChart.js");
/* harmony import */ var _src_components_TransactionBreakdown__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/components/TransactionBreakdown */ "./src/components/TransactionBreakdown.js");
/* harmony import */ var _src_components_TransactionBreakdown__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_src_components_TransactionBreakdown__WEBPACK_IMPORTED_MODULE_5__);
var _jsxFileName = "/Users/raymondyeh/Desktop/trebuchet/packages/trebuchet-report-template/pages/index.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








var Index =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Index, _React$Component);

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Index).call(this, props));
    _this.state = {
      txReport: [],
      vuReport: []
    };
    return _this;
  }

  _createClass(Index, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (window) {
        this.setState({
          txReport: window.txReport,
          vuReport: window.vuReport
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.txReport.length === 0 || this.state.vuReport.length === 0) {
        return null;
      }

      var _this$state = this.state,
          txReport = _this$state.txReport,
          vuReport = _this$state.vuReport;
      var txConcurrencyReport = Object(_src_utils_charts__WEBPACK_IMPORTED_MODULE_1__["concurrencyReport"])(txReport);
      var vuConcurrencyReport = Object(_src_utils_charts__WEBPACK_IMPORTED_MODULE_1__["concurrencyReport"])(vuReport);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "app-container",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 36
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "container my-3 mb-5",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 37
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row mt-3",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "h1",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        },
        __self: this
      }, "Load Test Report")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row mt-3",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 41
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "h2",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 42
        },
        __self: this
      }, "Concurrency Summary")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_ConcurrencyGraph__WEBPACK_IMPORTED_MODULE_2__["default"], {
        txConcurrencyReport: txConcurrencyReport,
        vuConcurrencyReport: vuConcurrencyReport,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 44
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row mt-3",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 48
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "h2",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 49
        },
        __self: this
      }, "Virtual Users")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_DistributionChart__WEBPACK_IMPORTED_MODULE_4__["default"], {
        report: vuReport,
        concurrencyReport: vuConcurrencyReport,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 51
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_StatsRow__WEBPACK_IMPORTED_MODULE_3__["default"], {
        report: vuReport,
        concurrencyReport: vuConcurrencyReport,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 55
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row mt-3",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 56
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "h2",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 57
        },
        __self: this
      }, "Transactions")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_DistributionChart__WEBPACK_IMPORTED_MODULE_4__["default"], {
        report: txReport,
        concurrencyReport: txConcurrencyReport,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 59
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_StatsRow__WEBPACK_IMPORTED_MODULE_3__["default"], {
        report: txReport,
        concurrencyReport: txConcurrencyReport,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 63
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_TransactionBreakdown__WEBPACK_IMPORTED_MODULE_5___default.a, {
        txReport: txReport,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 64
        },
        __self: this
      })));
    }
  }]);

  return Index;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Index);
    (function (Component, route) {
      if(!Component) return
      if (false) {}
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/")
  
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/components/TransactionBreakdown.js":
/*!************************************************!*\
  !*** ./src/components/TransactionBreakdown.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ })

})
//# sourceMappingURL=index.js.f099d0b98844e590035b.hot-update.js.map