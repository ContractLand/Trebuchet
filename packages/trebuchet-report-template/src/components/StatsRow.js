import PropTypes from "prop-types";
import { meanBy, maxBy, minBy, countBy } from "lodash";

const numBlock = (header, num) => (
  <div className="col mt-4">
    <div className="h6" style={{ minHeight: "2em" }}>
      {header}
    </div>
    <div className="h2">{num}</div>
  </div>
);

const StatsRow = ({ report, concurrencyReport }) => (
  <div className="row" id="vu-section">
    {numBlock("Total Executed", report.length)}
    {numBlock("Errors", countBy(report, "error").true || 0)}
    {numBlock(
      "Avg Concurrency",
      meanBy(concurrencyReport, "concurrency").toFixed(2)
    )}
    {numBlock(
      "Max Concurrency",
      maxBy(concurrencyReport, "concurrency").concurrency
    )}
    {numBlock("Avg Time (ms)", meanBy(report, "duration").toFixed(2))}
    {numBlock("Longest Time (ms)", maxBy(report, "duration").duration)}
    {numBlock("Shortest Time (ms)", minBy(report, "duration").duration)}
  </div>
);

StatsRow.propTypes = {
  report: PropTypes.array,
  concurrencyReport: PropTypes.array
};

export default StatsRow;
