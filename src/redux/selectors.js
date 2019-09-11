import * as CONSTANTS from "../constants";

export function activeOrdersSelector(state = {}) {
  const { data, filteredType, filteredSec, sec } = state;

  const cutOffSec = filteredSec ? sec - filteredSec : 0; // we want to filter out events greater than cutoff;
  let result = filteredType
    ? data.filter(order => order.event_name === filteredType)
    : data;

  if (filteredType === CONSTANTS.COOKED && filteredSec > 0) {
    result = result.filter(order => order.sent_at_second > cutOffSec);
  }
  return result;
}

// activeOrders = Object.values(orderMap)
//   .filter(order => CONSTANTS.ACTIVE_EVENTS.includes(order.event_name))
//   .sort((a, b) => b.sent_at_second - a.sent_at_second);
// inactiveOrders = Object.values(orderMap)
//   .filter(order => CONSTANTS.INACTIVE_EVENTS.includes(order.event_name))
//   .sort((a, b) => b.sent_at_second - a.sent_at_second);
