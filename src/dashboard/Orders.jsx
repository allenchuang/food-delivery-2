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
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

import { filterByType, filterBySec, updateOrder } from "../redux/actions";
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
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const Orders = ({
  data,
  sec,
  activeOrders,
  title,
  filteredType,
  filteredSec,
  handleFilterByType,
  handleFilterBySec,
  handleUpdateOrder
}) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [editOrder, setEditOrder] = React.useState(null);

  const setModalState = state => {
    setOpen(state);
    if (state === false) setEditOrder(null);
  };

  const updateEventType = e => {
    let newOrder = { ...editOrder, event_name: e.target.value };
    setEditOrder(newOrder);
  };

  const results = activeOrders.map(order => (
    <TableRow
      key={`${order.id}-${order.name}-${order.event_name}-${
        order.sent_at_second
      }-${new Date().getTime()}`}
    >
      <TableCell>{order.id}</TableCell>
      <TableCell>{order.name}</TableCell>
      <TableCell>
        <span style={colorEventType(order.event_name)}>{order.event_name}</span>
      </TableCell>
      <TableCell>{order.sent_at_second}</TableCell>
      <TableCell>
        {order.latitude}-{order.longitude}
      </TableCell>
      <TableCell align="right">{order.destination}</TableCell>
      <TableCell align="right">
        <button
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
      <Modal
        aria-labelledby="Edit Order Popup"
        aria-describedby="Modifying an existing order"
        open={open}
        onClose={() => setModalState(false)}
      >
        {editOrder && (
          <div style={modalStyle} className={classes.paper}>
            <h2>Edit Order</h2>
            <p>{editOrder.id}</p>
            <p>{editOrder.name}</p>
            <Select value={editOrder.event_name} onChange={updateEventType}>
              {CONSTANTS.ALL_EVENTS.map(event => {
                return (
                  <MenuItem key={event} value={event}>
                    {event}
                  </MenuItem>
                );
              })}
            </Select>
            <Button
              onClick={() => {
                handleUpdateOrder({ ...editOrder, sent_at_second: sec });
                setModalState(false);
              }}
            >
              Update Order
            </Button>
          </div>
        )}
      </Modal>

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
              inputProps={{ name: "filterBy", id: "filter" }}
            >
              <MenuItem value={"showAll"}> ALL</MenuItem>
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
            InputLabelProps={{ shrink: true }}
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
            <TableCell>Lat-Long</TableCell>
            <TableCell align="right">Destination</TableCell>
            <TableCell align="center">Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{results}</TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#">
          {" "}
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  activeOrders: activeOrdersSelector(state),
  data: state.data,
  filteredType: state.filteredType,
  filteredSec: state.filteredSec,
  sec: state.sec
});

const mapDispatchToProps = dispatch => ({
  handleFilterByType: e => dispatch(filterByType(e.target.value)),
  handleFilterBySec: e => dispatch(filterBySec(parseInt(e.target.value))),
  handleUpdateOrder: order => dispatch(updateOrder(order))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);
