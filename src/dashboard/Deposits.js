/* eslint-disable no-script-url */

import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

const useStyles = makeStyles({
  depositContext: {
    flex: 1
  }
});

export default function Deposits({ ...props }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Server Status</Title>
      <Typography component="p" variant="h4">
        {props.sec} secs
      </Typography>
      {/* <Typography color="textSecondary" className={classes.depositContext}>
        on 15 March, 2019
      </Typography>
      <h4></h4> */}
      {props.channelOnline ? (
        <p style={{ color: "green" }}>Socket Channel Connected</p>
      ) : (
        <p style={{ color: "red" }}>Channel Disconnected</p>
      )}
      {props.serverOnline ? (
        <p style={{ color: "green" }}>Server Online</p>
      ) : (
        <p style={{ color: "red" }}>Server Offline</p>
      )}
      <div>
        <Link color="primary" href="#">
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}
