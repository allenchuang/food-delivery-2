import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import Title from "./Title";

import { connect } from "react-redux";

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
  const results = createData(data, sec);
  return (
    <React.Fragment>
      <Title>Today</Title>
      {/* <p>{sec}</p> */}
      <ResponsiveContainer>
        <LineChart
          data={results}
          margin={{ top: 16, right: 16, bottom: 0, left: 24 }}
        >
          <XAxis dataKey="sec" />
          <Label angle={270} position="left" style={{ textAnchor: "middle" }}>
            Seconds
          </Label>
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

const mapDispatchToProps = dispatch => {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chart);
