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
  let { data, orderMap, inactiveOrders, activeOrders } = state;
  let newData = [...data];
  if (Object.keys(order).length !== 0) {
    newData.unshift(order);
    orderMap[order.id] = order;
  }

  return {
    ...state,
    serverOnline: true,
    sec, // time elapsed,
    data: newData,
    orderMap,
    activeOrders,
    inactiveOrders
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

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.CHANNEL_ON:
      return { ...state, channelOnline: true };
    case ACTIONS.CHANNEL_OFF:
      return { ...state, channelOnline: false, serverOnline: undefined };
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
    default:
      return state;
  }
};
