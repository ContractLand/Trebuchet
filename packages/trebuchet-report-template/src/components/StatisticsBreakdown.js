import PropTypes from "prop-types";
import ReactTable from "react-table";
import { groupBy, maxBy, minBy, meanBy, countBy } from "lodash";

const ReportBody = report => {
  const groupedTx = groupBy(report, "name");

  const data = Object.keys(groupedTx).map(name => ({
    name,
    count: groupedTx[name].length,
    error: countBy(groupedTx[name], "error").true || 0,
    min: minBy(groupedTx[name], "duration").duration,
    max: maxBy(groupedTx[name], "duration").duration,
    mean: meanBy(groupedTx[name], "duration").toFixed(2)
  }));

  const columns = [
    {
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Count",
      accessor: "count",
      style: { textAlign: "center" }
    },
    {
      Header: "Error",
      accessor: "error",
      style: { textAlign: "center" }
    },
    {
      Header: "Min",
      accessor: "min",
      style: { textAlign: "center" }
    },
    {
      Header: "Max",
      accessor: "max",
      style: { textAlign: "center" }
    },
    {
      Header: "Mean",
      accessor: "mean",
      style: { textAlign: "center" }
    }
  ];

  return (
    <ReactTable
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
  );
};

const StatisticsBreakdown = ({ report }) => (
  <div className="row my-5">{ReportBody(report)}</div>
);

StatisticsBreakdown.propTypes = {
  report: PropTypes.array
};

export default StatisticsBreakdown;
