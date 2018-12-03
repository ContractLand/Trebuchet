import PropTypes from "prop-types";
import { meanBy, maxBy, minBy } from "lodash";

const numBlock = (header, num) => (
  <div className="col">
    <div className="h6">{header}</div>
    <div className="h2">{num}</div>
  </div>
);

const StatsRow = ({ report, concurrencyReport }) => (
  <div className="row" id="vu-section">
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
  </div>
);

StatsRow.propTypes = {
  report: PropTypes.array,
  concurrencyReport: PropTypes.array
};

export default StatsRow;
