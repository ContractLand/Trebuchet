import ConcurrencyGraph from "./ConcurrencyGraph";
import SummaryStatistics from "./SummaryStatistics";

const SummarySection = ({
  txReport,
  vuReport,
  txConcurrencyReport,
  vuConcurrencyReport
}) => (
  <div className="row" id="summary-section">
    <div className="col-8">
      <ConcurrencyGraph
        txReport={txReport}
        txConcurrencyReport={txConcurrencyReport}
        vuConcurrencyReport={vuConcurrencyReport}
      />
    </div>
    <div className="col-4">
      <SummaryStatistics
        txReport={txReport}
        vuReport={vuReport}
        txConcurrencyReport={txConcurrencyReport}
        vuConcurrencyReport={vuConcurrencyReport}
      />
    </div>
  </div>
);

export default SummarySection;
