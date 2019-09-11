import * as CONSTANTS from "../constants";

export function colorEventType(event) {
  switch (event) {
    case CONSTANTS.CREATED:
      return { color: "black" };
    case CONSTANTS.COOKED:
      return { color: "orange" };
    case CONSTANTS.DRIVER_RECEIVED:
      return { color: "blue" };
    case CONSTANTS.DELIVERED:
      return { color: "green" };
    case CONSTANTS.CANCELLED:
      return { color: "red" };
    default:
      return event;
  }
}
