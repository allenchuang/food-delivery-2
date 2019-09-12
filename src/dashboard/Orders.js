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

// Filtering Selection
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Toolbar from "@material-ui/core/Toolbar";

import { filterByType, filterBySec } from "../redux/actions";
import * as CONSTANTS from "../constants";
import { activeOrdersSelector } from "../redux/selectors";

import { colorEventType } from "../utils";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding: 0
  },
  title: {
    flex: "1 1 100%"
  },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {},
  seeMore: {
    marginTop: theme.spacing(3)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  textField: {
    margin: theme.spacing(1)
  }
}));

const Orders = ({
  data,
  activeOrders,
  title,
  filteredType,
  filteredSec,
  handleFilterByType,
  handleFilterBySec
}) => {
  const classes = useStyles();
  const results = data.map(row => (
    <TableRow key={`${row.id}-${row.sent_at_second}-${row.name}`}>
      <TableCell>{row.id}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>
        <span style={colorEventType(row.event_name)}>{row.event_name}</span>
      </TableCell>
      <TableCell>{row.sent_at_second}</TableCell>
      <TableCell align="right">{row.destination}</TableCell>
    </TableRow>
  ));
  return (
    <React.Fragment>
      <Toolbar className={classes.root}>
        <div className={classes.title}>
          <Title>{title}</Title>
        </div>
        <div className={classes.spacer} />

        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="filter">Filter By</InputLabel>
            <Select
              value={filteredType}
              onChange={handleFilterByType}
              inputProps={{
                name: "filterBy",
                id: "filter"
              }}
            >
              <MenuItem value={"showAll"}>ALL</MenuItem>
              {CONSTANTS.ALL_EVENTS.map(event => {
                return (
                  <MenuItem key={event} value={event}>
                    {event}
                  </MenuItem>
                );
              })}
              {/* <MenuItem value={CONSTANTS.CREATED}>CREATED</MenuItem>
              <MenuItem value={CONSTANTS.COOKED}>COOKED</MenuItem> */}
            </Select>
          </FormControl>
        </div>
        {filteredType === CONSTANTS.COOKED && (
          <TextField
            id="standard-number"
            label="Seconds"
            value={filteredSec}
            defaultValue={0}
            onChange={handleFilterBySec}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
        )}
      </Toolbar>
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
        <TableBody>{results}</TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#">
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  activeOrders: activeOrdersSelector(state),
  data: activeOrdersSelector(state),
  filteredType: state.filteredType,
  filteredSec: state.filteredSec
});

const mapDispatchToProps = dispatch => ({
  handleFilterByType: e => dispatch(filterByType(e.target.value)),
  handleFilterBySec: e => dispatch(filterBySec(parseInt(e.target.value)))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);
