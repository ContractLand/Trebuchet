import PropTypes from "prop-types";
import ReactEcharts from "echarts-for-react";

const ConcurrencyGraph = ({ txConcurrencyReport, vuConcurrencyReport }) => {
  const option = {
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none"
        },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: [
      {
        handleIcon:
          "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        handleSize: "80%",
        handleStyle: {
          color: "#777"
        }
      }
    ],
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
    series: [
      {
        name: "TX Concurrency",
        type: "line",
        data: txConcurrencyReport.map(t => [t.time, t.concurrency]),
        symbol: "none",
        sampling: "average"
      },
      {
        name: "VU Concurrency",
        type: "line",
        showSymbol: false,
        hoverAnimation: false,
        data: vuConcurrencyReport.map(t => [t.time, t.concurrency]),
        symbol: "none",
        sampling: "average"
      }
    ]
  };

  return <ReactEcharts option={option} notMerge={true} lazyUpdate={true} />;
};

ConcurrencyGraph.propTypes = {
  txConcurrencyReport: PropTypes.array,
  vuConcurrencyReport: PropTypes.array
};

export default ConcurrencyGraph;