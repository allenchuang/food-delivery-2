import { Paper } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import * as CONSTANTS from "../constants";
import Map from "./Map";
import OrderTable from "./OrderTable";

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
  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid container spacing={3}>
        <Grid container item xs={12} md={6} spacing={1}>
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
          <Grid item xs={12}>
            <Map height={"80vh"} />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
