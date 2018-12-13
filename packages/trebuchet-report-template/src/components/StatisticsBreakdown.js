import PropTypes from "prop-types";
import ReactTable from "react-table";
import { groupBy, maxBy, minBy, meanBy } from "lodash";

const ReportBody = txReport => {
  const groupedTx = groupBy(txReport, "name");

  const data = Object.keys(groupedTx).map((name, i) => ({
    name,
    count: groupedTx[name].length,
    min: minBy(groupedTx[name], "duration").duration,
    max: maxBy(groupedTx[name], "duration").duration,
    mean: meanBy(groupedTx[name], "duration").toFixed(2)
  }));

  const columns = [{
    Header: 'Name',
    accessor: 'name'
  }, {
    Header: 'Count',
    accessor: 'count'
  }, {
    Header: 'Min',
    accessor: 'min',
  }, {
    Header: 'Max',
    accessor: 'max',
  }, {
    Header: 'Mean',
    accessor: 'mean',
  }]

  return <ReactTable
    className="-striped -highlight col"
    minRows="0"
    data={data}
    columns={columns}
    showPageSizeOptions={false}
    defaultSorted={[
      {
        id: "name",
        desc: false
      }
    ]}
  />
};

const StatisticsBreakdown = ({ txReport }) => {
  return (
    <div className="row mt-5">
      {ReportBody(txReport)}
    </div>
  );
};

StatisticsBreakdown.propTypes = {
  txReport: PropTypes.array
};

export default StatisticsBreakdown;
