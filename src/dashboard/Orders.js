/* eslint-disable no-script-url */

import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3)
  }
}));

const Orders = ({ data }) => {
  const classes = useStyles();
  const result = data.map(row => (
    <TableRow key={`${row.id}-${row.sent_at_second}`}>
      <TableCell>{row.id}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.event_name}</TableCell>
      <TableCell>{row.sent_at_second}</TableCell>
      <TableCell align="right">{row.destination}</TableCell>
    </TableRow>
  ));
  console.log(data);
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Food Name</TableCell>
            <TableCell>Event</TableCell>
            <TableCell>Secs</TableCell>
            <TableCell align="right">Destination</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{result}</TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="javascript:;">
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  activeOrders: state.activeOrders,
  data: state.data
});

const mapDispatchToProps = dispatch => {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);
