import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
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
  },
  finePrint: {
    color: "grey",
    display: "block"
  },
  orderName: {
    fontWeight: "bold"
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
      {editOrder ? (
        <div style={modalStyle} className={classes.paper}>
          <h4>Edit Order</h4>
          <small className={classes.finePrint}>{editOrder.id}</small>
          <p className={classes.orderName}>{editOrder.name}</p>
          <div>
            <Select value={editOrder.event_name} onChange={updateEventType}>
              {CONSTANTS.ALL_ORDERS_EVENTS.map(event => {
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
      ) : (
        <p>No data</p>
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

OrderPopup.propTypes = {
  sec: PropTypes.number.isRequired,
  handleUpdateOrder: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setModalState: PropTypes.func.isRequired,
  editOrder: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    event_name: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    sent_at_second: PropTypes.number.isRequired,
    directions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    longitude: PropTypes.number,
    latitude: PropTypes.number
  }),
  setEditOrder: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderPopup);
