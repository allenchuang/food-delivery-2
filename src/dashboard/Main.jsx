import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import Orders from "./Orders";
import Map from "./Map";
import ServerStatus from "./ServerStatus";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  }
}));

export default function Main() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Container maxWidth="xl" className={classes.container}>
      <h1>MAIN</h1>
      <Grid container spacing={3}>
        <Grid container item xs={12} md={6} spacing={1}>
          {/* Server Status */}
          <Grid item xs={12}>
            <Paper className={fixedHeightPaper}>
              <ServerStatus
              // channelOnline={channelOnline}
              // sec={sec}
              // serverOnline={serverOnline}
              />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Orders title="Active Orders" />
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={12} md={6} spacing={1}>
          {/* Map */}
          <Grid item xs={12}>
            <Map />
          </Grid>
          {/* Server Status */}
        </Grid>
      </Grid>
    </Container>
  );
}
