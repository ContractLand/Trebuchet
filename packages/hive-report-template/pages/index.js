import txReport from "../static/txReport.json";
import vuReport from "../static/vuReport.json";
import { concurrencyReport } from "../src/utils/charts";
import ConcurrencyGraph from "../src/components/ConcurrencyGraph";
import StatsRow from "../src/components/StatsRow";
import DistributionGraph from "../src/components/DistributionChart";

const txConcurrencyReport = concurrencyReport(txReport);
const vuConcurrencyReport = concurrencyReport(vuReport);

const Index = () => (
  <div id="app-container">
    <div className="container my-3 mb-5">
      <div className="row mt-3">
        <div className="h1">Load Test Report</div>
      </div>
      <div className="row mt-3">
        <div className="h2">Concurrency Summary</div>
      </div>
      <ConcurrencyGraph
        txConcurrencyReport={txConcurrencyReport}
        vuConcurrencyReport={vuConcurrencyReport}
      />
      <div className="row mt-3">
        <div className="h2">Virtual Users</div>
      </div>
      <DistributionGraph
        report={vuReport}
        concurrencyReport={vuConcurrencyReport}
      />
      <StatsRow report={vuReport} concurrencyReport={vuConcurrencyReport} />
      <div className="row mt-3">
        <div className="h2">Transactions</div>
      </div>
      <DistributionGraph
        report={txReport}
        concurrencyReport={txConcurrencyReport}
      />
      <StatsRow report={txReport} concurrencyReport={txConcurrencyReport} />
    </div>
  </div>
);

export default Index;
