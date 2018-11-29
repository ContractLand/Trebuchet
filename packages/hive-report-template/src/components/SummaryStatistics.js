import { meanBy, maxBy } from "lodash";

const SummaryStatistics = ({
  txReport,
  vuReport,
  txConcurrencyReport,
  vuConcurrencyReport
}) => (
  <div>
    <div className="my-3">
      <div className="h6">Virtual Users (VUs)</div>
      <div>Total VUs: {vuReport.length}</div>
      <div>
        Max Concurrent VUs:{" "}
        {maxBy(vuConcurrencyReport, "concurrency").concurrency}
      </div>
      <div>
        Avg Concurrent VUs:{" "}
        {meanBy(vuConcurrencyReport, "concurrency").toFixed(2)}
      </div>
      <div>Avg VU Duration: {meanBy(vuReport, "duration").toFixed(2)} ms</div>
    </div>
    <div className="my-3">
      <div className="h6">Transactions (TXs)</div>
      <div>Total TXs: {txReport.length}</div>
      <div>
        Max Concurrent TXs:{" "}
        {maxBy(txConcurrencyReport, "concurrency").concurrency}
      </div>
      <div>
        Avg Concurrent TXs:{" "}
        {meanBy(txConcurrencyReport, "concurrency").toFixed(2)}
      </div>
      <div>Avg TX Duration: {meanBy(txReport, "duration").toFixed(2)} ms</div>
    </div>
  </div>
);

export default SummaryStatistics;
