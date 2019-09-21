import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import OrderTable from "./OrderTable";
import Map from "./Map";
import ServerStatus from "./ServerStatus";
import Hidden from "@material-ui/core/Hidden";
import * as CONSTANTS from "../constants";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "40vh",
    minHeight: "40vh",
    [theme.breakpoints.down("md")]: {
      height: "80vh"
    }
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
      <Grid container spacing={3}>
        <Grid container item xs={12} md={6} spacing={1}>
          {/* Server Status */}
          {/* <Grid item xs={12}>
            <Paper className={fixedHeightPaper}>
              <ServerStatus
              // channelOnline={channelOnline}
              // sec={sec}
              // serverOnline={serverOnline}
              />
            </Paper>
          </Grid> */}
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <OrderTable
                orderType={CONSTANTS.ACTIVE_ORDERS}
                title="Active Orders"
              />
            </Paper>
          </Grid>
          <Hidden mdDown>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <OrderTable
                  orderType={CONSTANTS.INACTIVE_ORDERS}
                  title="Inactive Orders"
                />
              </Paper>
            </Grid>
          </Hidden>
        </Grid>
        <Grid container item xs={12} md={6} spacing={1}>
          {/* Map */}
          <Grid item xs={12}>
            <Map height={"80vh"} />
          </Grid>
          {/* Server Status */}
        </Grid>
      </Grid>
    </Container>
  );
}
