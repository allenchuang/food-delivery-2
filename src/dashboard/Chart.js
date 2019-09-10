import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer
} from "recharts";
import Title from "./Title";

import { connect } from "react-redux";

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

// { destination: '801 Toyopa Dr, Pacific Palisades, CA 90272',
//   event_name: 'CREATED',
//   id: 'f7711c3b',
//   name: 'Mushroom pizza',
//   sent_at_second: 3 }
// 4
// { destination: '801 Toyopa Dr, Pacific Palisades, CA 90272',
//   event_name: 'CREATED',
//   id: '4b76edbf',
//   name: 'Cheese pizza',
//   sent_at_second: 4 }

const Chart = ({ data, sec }) => {
  const graphData = data.reduce((map, cur, i) => {
    let key = cur["sent_at_second"];
    if (!map[key]) {
      map[key] = 1;
      return map;
    }
    map[key] += 1;
    return map;
  }, {});
  const results = Object.keys(graphData).map(sec => {
    return {
      sec: sec,
      total: graphData[sec]
    };
  });
  return (
    <React.Fragment>
      <Title>Today</Title>
      {/* <p>{sec}</p> */}
      <ResponsiveContainer>
        <LineChart
          data={results}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24
          }}
        >
          <XAxis dataKey="sec" />
          <Label angle={270} position="left" style={{ textAnchor: "middle" }}>
            Seconds
          </Label>
          <YAxis>
            <Label angle={270} position="left" style={{ textAnchor: "middle" }}>
              Total Orders
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="total" stroke="#556CD6" dot={false} />
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
