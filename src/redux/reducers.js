import * as ACTIONS from "./actions";
import * as CONSTANTS from "../constants";

const initialState = {
  data: [],
  activeOrders: [],
  inactiveOrders: [],
  orderMap: {},
  sec: 0,
  channelOnline: false,
  serverOnline: undefined,
  filteredType: "",
  filteredSec: ""
};

const handleSubscription = (state, action) => {
  const { order, sec } = action;
  let data = [...state.data],
    orderMap = { ...state.orderMap };
  if (Object.keys(order).length !== 0) {
    data.unshift(order);
    if (order.event_name === CONSTANTS.CANCELLED) {
      delete orderMap[order.id];
    } else {
      orderMap[order.id] = orderMap[order.id]
        ? {
            ...orderMap[order.id],
            event_name: order.event_name,
            sent_at_second: order.sent_at_second
          }
        : order;
    }
  }

  console.log("ordermap", orderMap);
  return {
    ...state,
    serverOnline: true,
    sec, // time elapsed,
    data,
    orderMap
    // Moved logic to selectors.js
    // activeOrders,
    // inactiveOrders
  };
};

const handleFilterByType = (state, action) => {
  const { eventType } = action;
  switch (eventType) {
    case "showAll":
      return {
        ...state,
        filteredType: null
      };
    case CONSTANTS.CREATED:
      return {
        ...state,
        filteredType: CONSTANTS.CREATED
      };
    case CONSTANTS.COOKED:
      return {
        ...state,
        filteredType: CONSTANTS.COOKED
      };
    default:
      return {
        ...state,
        filteredType: eventType
      };
  }
};

const handleFilterBySec = (state, action) => {
  const { secTilNow } = action;
  return {
    ...state,
    filteredSec: secTilNow
  };
};

const handleUpdateOrder = (state, action) => {
  const { order } = action;
  let data = [...state.data],
    orderMap = { ...state.orderMap };
  if (Object.keys(order).length !== 0) {
    data.unshift(order);
    if (order.event_name === CONSTANTS.CANCELLED) {
      delete orderMap[order.id];
    } else {
      orderMap[order.id] = orderMap[order.id]
        ? {
            ...orderMap[order.id],
            event_name: order.event_name,
            destination: order.destination,
            name: order.name,
            sent_at_second: order.sent_at_second
          }
        : order;
    }
  }
  return {
    ...state,
    data,
    orderMap
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.CHANNEL_ON:
      return { ...state, channelOnline: true };
    case ACTIONS.CHANNEL_OFF:
      return {
        ...state,
        channelOnline: false,
        serverOnline: undefined,
        sec: 0
      };
    case ACTIONS.SERVER_OFF:
      return { ...state, serverOnline: false };
    case ACTIONS.SERVER_ON:
      return { ...state, serverOnline: true };
    case ACTIONS.SUBSCRIBE_TIMER:
      return handleSubscription(state, action);
    case ACTIONS.FILTER_ACTIVE_ORDERS_TYPE:
      return handleFilterByType(state, action);
    case ACTIONS.FILTER_ACTIVE_ORDERS_SEC:
      return handleFilterBySec(state, action);
    case ACTIONS.UPDATE_ORDER:
      return handleUpdateOrder(state, action);
    default:
      return state;
  }
};
