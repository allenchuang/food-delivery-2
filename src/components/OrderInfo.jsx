import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import { colorEventType } from "../utils";
import clsx from "clsx";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "280px",
    padding: theme.spacing(1)
  },
  row: { display: "flex", flexDirection: "row" },
  left: { flex: "4" },
  right: { flex: "4" },
  finePrint: {
    color: "grey",
    display: "block"
  },
  orderName: {
    fontWeight: "bold"
  },
  eventLabel: { fontWeight: "bold", padding: "4px" },
  editBtn: {
    fontWeight: "bold",
    border: "1px black dotted"
  },
  destination: {
    textAlign: "right"
  },
  timestamp: {
    marginTop: theme.spacing(2)
  }
});

class OrderInfo extends PureComponent {
  render() {
    const { order, classes } = this.props;
    // const displayName = `${order.name}, ${order.destination}`;

    return (
      <div className={classes.root}>
        <div className={classes.row}>
          <div className={classes.left}>
            <small className={classes.finePrint}>{order.id}</small>
            <p className={classes.orderName}>{order.name}</p>
            <small
              className={classes.eventLabel}
              style={colorEventType(order.event_name)}
            >
              {order.event_name}
            </small>
          </div>
          <div className={classes.right}>
            <div>
              <p className={classes.destination}>{order.destination}</p>
            </div>
          </div>
        </div>
        <small
          className={clsx(classes.finePrint, classes.timestamp)}
        >{`Last updated at: ${order.sent_at_second} second`}</small>
      </div>
    );
  }
}

export default withStyles(styles)(OrderInfo);
