import initialState from "./initialState";
import { filterAll, filterActive, filterInactive } from "./filtersReducer";
import * as ACTIONS from "./actions";

const handleTimerSubscription = (state, action) => {
  const { sec } = action;
  if (sec) {
    return {
      ...state,
      sec
    };
  }
  return state;
};

const handleOrderSubscription = (state, action) => {
  const { orders } = action;

  if (orders) {
    let data = [...state.data].concat(orders);
    let orderMap = { ...state.orderMap };

    // create a hash map of orderId: orderObj
    orders.forEach(order => {
      orderMap[order.id] = orderMap[order.id]
        ? {
            ...orderMap[order.id],
            event_name: order.event_name,
            sent_at_second: order.sent_at_second,
            uid: order.uid
          }
        : order;
    });

    return {
      ...state,
      data,
      orderMap
    };
  }

  return state;
};

const handleUpdateOrder = (state, action) => {
  const { order } = action;

  // if empty response just return unchanged state to prevent
  // rerendering caused by cloning new state
  if (Object.keys(order).length !== 0) {
    let newData = [...state.data],
      orderMap = { ...state.orderMap };
    newData.unshift(order);
    orderMap[order.id] = orderMap[order.id]
      ? {
          ...orderMap[order.id],
          sent_at_second: order.sent_at_second,
          event_name: order.event_name
          // TODO: add ability to update other attributes
          // destination: order.destination,
          // name: order.name
        }
      : order;
    return {
      ...state,
      data: newData,
      orderMap
    };
  }
  return state;
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.CHANNEL_ON:
      return { ...state, channelOnline: true };
    case ACTIONS.CHANNEL_OFF:
      return { ...state, channelOnline: false };
    case ACTIONS.SERVER_OFF:
      return { ...state, serverOnline: false };
    case ACTIONS.SERVER_ON:
      return { ...state, serverOnline: true };
    case ACTIONS.SUBSCRIBE_TIMER:
      return handleTimerSubscription(state, action);
    case ACTIONS.SUBSCRIBE_ORDER:
      return handleOrderSubscription(state, action);
    case ACTIONS.UPDATE_ORDER:
      return handleUpdateOrder(state, action);
    case ACTIONS.RESET_STORE:
      return initialState;
    default:
      return state;
  }
};

export default function(state = initialState, action) {
  return {
    ...mainReducer(state, action),
    filterAll: filterAll(state.filterAll, action),
    filterActive: filterActive(state.filterActive, action),
    filterInactive: filterInactive(state.filterInactive, action)
  };
}
