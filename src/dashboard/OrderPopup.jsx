import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import Modal from "@material-ui/core/Modal";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

import { updateOrder } from "../redux/actions";

import * as CONSTANTS from "../constants";

const useStyles = makeStyles(theme => ({
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

const OrderPopup = ({
  // passed in props
  open,
  setModalState,
  editOrder,
  setEditOrder,
  // mapStateToProps
  sec,
  // mapDispatchToProps
  handleUpdateOrder
}) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const updateEventType = e => {
    let newOrder = { ...editOrder, event_name: e.target.value };
    setEditOrder(newOrder);
  };

  return (
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
          <div>
            <Select value={editOrder.event_name} onChange={updateEventType}>
              {CONSTANTS.ALL_EVENTS.map(event => {
                return (
                  <MenuItem key={event} value={event}>
                    {event}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleUpdateOrder({ ...editOrder, sent_at_second: sec });
                setModalState(false);
              }}
            >
              Update Order
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

const mapStateToProps = state => ({
  sec: state.sec
});

const mapDispatchToProps = dispatch => ({
  handleUpdateOrder: order => dispatch(updateOrder(order))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderPopup);
