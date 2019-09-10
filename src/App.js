import React from "react";
import { connect } from "react-redux";
import logo from "./logo.svg";
import "./App.css";
import { START_CHANNEL, STOP_CHANNEL } from "./redux/actions";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  start: () =>
    dispatch({
      type: START_CHANNEL
    }),
  stop: () =>
    dispatch({
      type: STOP_CHANNEL
    })
});
class App extends React.Component {
  componentDidMount() {
    // io('http://localhost:4001')
    this.props.start();
  }

  componentWillUnmount() {
    this.props.stop();
  }

  render() {
    const orderList = this.props.data.map(order => (
      <li key={Math.random()}>
        {order.sent_at_second} -{order.id}
        {order.name}
        {order.event_name}
        {order.destination}
      </li>
    ));
    console.log("props", this.props);
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {this.props.sec}
          {this.props.channelOnline ? (
            <p style={{ color: "green" }}>Socket Channel Connected</p>
          ) : (
            <p style={{ color: "red" }}>Channel Disconnected</p>
          )}
          {this.props.serverOnline ? (
            <p style={{ color: "green" }}>Server Online</p>
          ) : (
            <p style={{ color: "red" }}>Server Offline</p>
          )}
          <p>
            Edit <code>src/App.js</code> and save to reload.
            {/* {this.props.data} */}
            {this.props.channelOnline}
          </p>
          <ul>{orderList}</ul>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
