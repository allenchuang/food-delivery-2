import createCachedSelector from "re-reselect";
import * as CONSTANTS from "../constants";

// Get sec
const getSec = state => state.sec;

// ORDER TYPE SELECTORS
const getAllOrders = state =>
  state.data.sort((a, b) => {
    if (a.sent_at_second === b.sent_at_second) {
      return b.name.toLowerCase() - a.name.toLowerCase();
    }
    return b.sent_at_second - a.sent_at_second;
  });
const getActiveOrders = state =>
  Object.values(state.orderMap)
    .filter(order => CONSTANTS.ACTIVE_ORDERS_EVENTS.includes(order.event_name))
    .sort((a, b) => {
      if (a.sent_at_second === b.sent_at_second) {
        return b.name.toLowerCase() - a.name.toLowerCase();
      }
      return b.sent_at_second - a.sent_at_second;
    });
const getInactiveOrders = state =>
  Object.values(state.orderMap)
    .filter(order =>
      CONSTANTS.INACTIVE_ORDERS_EVENTS.includes(order.event_name)
    )
    .sort((a, b) => {
      if (a.sent_at_second === b.sent_at_second) {
        return b.name.toLowerCase() - a.name.toLowerCase();
      }
      return b.sent_at_second - a.sent_at_second;
    });

const getDataByOrderType = (state, orderType) => {
  switch (orderType) {
    case CONSTANTS.ALL_ORDERS:
      return getAllOrders(state);
    case CONSTANTS.ACTIVE_ORDERS:
      return getActiveOrders(state);
    case CONSTANTS.INACTIVE_ORDERS:
      return getInactiveOrders(state);
    default:
      return getAllOrders(state);
  }
};

// Get Filters by Order Table
export const mapOrderTypesToKey = {
  [CONSTANTS.ALL_ORDERS]: "filterAll",
  [CONSTANTS.ACTIVE_ORDERS]: "filterActive",
  [CONSTANTS.INACTIVE_ORDERS]: "filterInactive"
};

const getFilterKeyByOrderType = orderType => mapOrderTypesToKey[orderType];

const filterEventByOrderType = (state, orderType) => {
  return state[getFilterKeyByOrderType(orderType)].event;
};

const filterSecByOrderType = (state, orderType) => {
  return state[getFilterKeyByOrderType(orderType)].sec;
};

const filterHelper = (orders, filterEvent, filterSec, sec) => {
  const cutOffSec = filterSec ? sec - filterSec : 0; // we want to filter out events greater than cutoff
  let filteredOrders = filterEvent
    ? orders.filter(order => order.event_name === filterEvent)
    : orders;

  if (filterEvent === CONSTANTS.COOKED && filterSec > 0) {
    filteredOrders = filteredOrders.filter(
      order => order.sent_at_second > cutOffSec
    );
  }
  return filteredOrders;
};

export const getOrdersWithFilters = createCachedSelector(
  // input selectors
  getDataByOrderType,
  filterEventByOrderType,
  filterSecByOrderType,
  getSec,

  // result func
  (orders, filterEvent, filterSec, sec) =>
    filterHelper(orders, filterEvent, filterSec, sec)
)(
  // re-reselect keySelector
  (orders, filterEvent, filterSec, sec) => `${sec}@${filterEvent}:${filterSec}` // cacheKey don't repeat for live data
);
