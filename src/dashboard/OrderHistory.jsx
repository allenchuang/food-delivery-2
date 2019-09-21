import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import OrderTable from "./OrderTable";
import Chart from "./Chart";
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
    flexDirection: "column"
  },
  fixedHeight: {
    height: 190
  }
}));

export default function OrderHistory() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <OrderTable orderType={CONSTANTS.ALL_ORDERS} title="Past Orders" />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
