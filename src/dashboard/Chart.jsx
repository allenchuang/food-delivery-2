import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import Title from "./Title";

// Generate Graph Data
function createData(data, sec) {
  const graphData = data.reduce((map, cur, i) => {
    let key = cur["sent_at_second"];
    if (!map[key]) {
      map[key] = 1;
      return map;
    }
    map[key] += 1;
    return map;
  }, {});
  return Object.keys(graphData).map(sec => {
    return {
      sec: sec,
      total: graphData[sec]
    };
  });
}

const Chart = ({ data, sec }) => {
  const results = createData(data, sec) || {};
  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={results}
          margin={{ top: 16, right: 16, bottom: 0, left: 24 }}
        >
          <XAxis dataKey="sec">
            {/* <Label position="insideBottom">Seconds</Label> */}
          </XAxis>

          <YAxis allowDecimals={false}>
            <Label angle={270} position="left" style={{ textAnchor: "middle" }}>
              Total Orders
            </Label>
          </YAxis>
          <Tooltip />
          <Line
            type="linear"
            dataKey="total"
            stroke="#556CD6"
            dot={true}
            isAnimationActive={false}
            activeDot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  data: state.data,
  sec: state.sec
});

Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      event_name: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      sent_at_second: PropTypes.number.isRequired,
      directions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      longitude: PropTypes.number,
      latitude: PropTypes.number
    }).isRequired
  ).isRequired,
  sec: PropTypes.number
};

export default connect(mapStateToProps)(Chart);
