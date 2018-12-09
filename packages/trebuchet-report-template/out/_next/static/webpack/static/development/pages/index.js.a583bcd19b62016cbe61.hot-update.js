webpackHotUpdate("static/development/pages/index.js",{

/***/ "./src/components/ConcurrencyGraph.js":
/*!********************************************!*\
  !*** ./src/components/ConcurrencyGraph.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var echarts_for_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! echarts-for-react */ "./node_modules/echarts-for-react/lib/index.js");
/* harmony import */ var echarts_for_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(echarts_for_react__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "/Users/raymondyeh/Desktop/chain-hive/packages/trebuchet-report-template/src/components/ConcurrencyGraph.js";




var ConcurrencyGraph = function ConcurrencyGraph(_ref) {
  var txConcurrencyReport = _ref.txConcurrencyReport,
      vuConcurrencyReport = _ref.vuConcurrencyReport;
  var option = {
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none"
        },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: [{
      handleIcon: "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
      handleSize: "80%",
      handleStyle: {
        color: "#777"
      }
    }],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: "time",
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      name: "Concurrency",
      boundaryGap: [0, "100%"],
      splitLine: {
        show: false
      }
    },
    series: [{
      name: "TX Concurrency",
      type: "line",
      data: txConcurrencyReport.map(function (t) {
        return [t.time, t.concurrency];
      }),
      symbol: "none",
      sampling: "average"
    }, {
      name: "VU Concurrency",
      type: "line",
      showSymbol: false,
      hoverAnimation: false,
      data: vuConcurrencyReport.map(function (t) {
        return [t.time, t.concurrency];
      }),
      symbol: "none",
      sampling: "average"
    }]
  };
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(echarts_for_react__WEBPACK_IMPORTED_MODULE_2___default.a, {
    option: option,
    notMerge: true,
    lazyUpdate: true,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65
    },
    __self: this
  });
};

ConcurrencyGraph.propTypes = {
  txConcurrencyReport: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array,
  vuConcurrencyReport: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array
};
/* harmony default export */ __webpack_exports__["default"] = (ConcurrencyGraph);

/***/ })

})
//# sourceMappingURL=index.js.a583bcd19b62016cbe61.hot-update.js.map