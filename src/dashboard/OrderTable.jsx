/* eslint-disable no-script-url */

import React from "react";
import PropTypes from "prop-types";
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
import Hidden from "@material-ui/core/Hidden";
import OrderPopup from "./OrderPopup";

import { filterEventByOrderType, filterSecByOrderType } from "../redux/actions";
import * as CONSTANTS from "../constants";
import { getOrdersWithFilters, mapOrderTypesToKey } from "../redux/selectors";

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
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  tableWrapper: {
    maxHeight: "80%",
    overflowY: "auto"
  },
  orderId: {
    color: "grey",
    display: "block"
  },
  orderCol: {
    width: "33%",
    minWidth: "200px"
  },
  eventCol: {
    minWidth: "120px"
  },
  eventLabel: { fontWeight: "bold", padding: "4px" },
  destinationCol: {
    [theme.breakpoints.down("md")]: {
      whiteSpace: "nowrap"
    }
  },
  editBtn: {
    fontWeight: "bold",
    border: "1px black dotted"
  }
}));

const OrderTable = ({
  title,
  orderType,
  tableData,
  filteredType,
  filteredSec,
  handleFilterByType,
  handleFilterBySec
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [editOrder, setEditOrder] = React.useState(null);

  const setModalState = state => {
    setOpen(state);
    if (state === false) setEditOrder(null);
  };

  const onFilterEvent = e => handleFilterByType(orderType)(e.target.value);
  const onFilterSec = e =>
    handleFilterBySec(orderType)(parseInt(e.target.value));

  const results = tableData.map(order => (
    <TableRow hover key={order.uid}>
      {/* <TableCell>{order.id}</TableCell> */}
      <TableCell>
        <small className={classes.orderId}>{order.id}</small>
        <b>{order.name}</b>
      </TableCell>
      <TableCell>
        <small
          className={classes.eventLabel}
          style={colorEventType(order.event_name)}
        >
          {order.event_name}
        </small>
      </TableCell>
      <TableCell>{order.sent_at_second}</TableCell>
      {orderType === CONSTANTS.ALL_ORDERS && (
        <Hidden mdDown>
          <TableCell>
            {order.latitude}-{order.longitude}
          </TableCell>
        </Hidden>
      )}

      <TableCell className={classes.destinationCol} align="right">
        {order.destination}
      </TableCell>
      <TableCell align="right">
        <button
          id="edit-button"
          className={classes.editBtn}
          onClick={() => {
            setEditOrder(order);
            setModalState(true);
          }}
        >
          EDIT
        </button>
      </TableCell>
    </TableRow>
  ));
  return (
    <React.Fragment>
      <OrderPopup
        open={open}
        setModalState={setModalState}
        editOrder={editOrder}
        setEditOrder={setEditOrder}
      />

      <Toolbar className={classes.root}>
        <div className={classes.title}>
          <Title>{title}</Title>
        </div>
        <Hidden mdDown>
          <div className={classes.spacer} />
        </Hidden>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="filter">Filter By</InputLabel>
            <Select
              value={filteredType || ""}
              onChange={onFilterEvent}
              inputProps={{ name: "filterBy", id: "filter" }}
            >
              <MenuItem value={""}> ALL</MenuItem>
              {CONSTANTS[`${orderType}_EVENTS`].map(event => {
                return (
                  <MenuItem key={event} value={event}>
                    {event}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        {filteredType === CONSTANTS.COOKED && (
          <TextField
            id="standard-number"
            label="Seconds"
            value={filteredSec || ""}
            onChange={onFilterSec}
            type="number"
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
          />
        )}
      </Toolbar>
      <div className={classes.tableWrapper}>
        <Table stickyHeader={true} size="small">
          <TableHead>
            <TableRow>
              {/* <TableCell>ID</TableCell> */}
              <TableCell className={classes.orderCol}>Order</TableCell>
              <TableCell className={classes.eventCol}>Event</TableCell>
              <TableCell>Secs</TableCell>
              {orderType === CONSTANTS.ALL_ORDERS && (
                <Hidden mdDown>
                  <TableCell>Lat-Long</TableCell>
                </Hidden>
              )}
              <TableCell align="right">Destination</TableCell>
              <TableCell colSpan={1} align="center">
                Edit
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{results}</TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state, ownProps) => ({
  tableData: getOrdersWithFilters(state, CONSTANTS[ownProps.orderType]),
  filteredType: state[mapOrderTypesToKey[ownProps.orderType]].event,
  filteredSec: state[mapOrderTypesToKey[ownProps.orderType]].sec
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleFilterByType: orderType => e =>
    dispatch(filterEventByOrderType(orderType)(e)),
  handleFilterBySec: orderType => e =>
    dispatch(filterSecByOrderType(orderType)(e))
});

OrderTable.propTypes = {
  title: PropTypes.string,
  orderType: PropTypes.string.isRequired,
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      event_name: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      sent_at_second: PropTypes.number.isRequired,
      directions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      longitude: PropTypes.number,
      latitude: PropTypes.number
    }).isRequired
  ).isRequired,
  filteredType: PropTypes.string,
  filteredSec: PropTypes.number,
  handleFilterByType: PropTypes.func.isRequired,
  handleFilterBySec: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderTable);
