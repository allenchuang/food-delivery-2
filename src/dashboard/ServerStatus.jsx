/* eslint-disable no-script-url */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

const useStyles = makeStyles({
  depositContext: {
    flex: 1
  },
  connected: {
    color: "green"
  },
  disconnected: {
    color: "red"
  }
});

export default function ServerStatus({ ...props }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Server Status</Title>
      <Typography component="p" variant="h4">
        {props.sec} secs
      </Typography>
      {props.channelOnline ? (
        <p className={classes.connected}>Socket Channel Connected</p>
      ) : (
        <p className={classes.disconnected}>Channel Disconnected</p>
      )}
      {props.serverOnline ? (
        <p className={classes.connected}>Server Online</p>
      ) : (
        <p className={classes.disconnected}>Server Offline</p>
      )}
    </React.Fragment>
  );
}
