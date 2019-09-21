import * as CONSTANTS from "./constants";

export function colorEventType(event) {
  switch (event) {
    case CONSTANTS.CREATED:
      return { backgroundColor: "#eadd04", color: "white" };
    case CONSTANTS.COOKED:
      return { backgroundColor: "#ff803e", color: "white" };
    case CONSTANTS.DRIVER_RECEIVED:
      return { backgroundColor: "#78ecb8", color: "white" };
    case CONSTANTS.DELIVERED:
      return { backgroundColor: "#81ff00", color: "white" };
    case CONSTANTS.CANCELLED:
      return { backgroundColor: "red", color: "white" };
    default:
      return event;
  }
}
