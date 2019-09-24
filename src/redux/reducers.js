import { combineReducers } from "redux";
import initialState from "./initialState";
import { filterAll, filterActive, filterInactive } from "./filtersReducer";
import * as ACTIONS from "./actions";

const handleSubscription = (state, action) => {
  const { order, sec } = action;
  let data = [...state.data],
    orderMap = { ...state.orderMap };
  if (Object.keys(order).length !== 0) {
    data.unshift(order);
    // if (order.event_name === CONSTANTS.CANCELLED) {
    //   delete orderMap[order.id];
    // } else {
    orderMap[order.id] = orderMap[order.id]
      ? {
          ...orderMap[order.id],
          event_name: order.event_name,
          sent_at_second: order.sent_at_second,
          uid: order.uid
        }
      : order;
    // }
  }

  // console.log("ordermap", orderMap);
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

const handleUpdateOrder = (state, action) => {
  const { order } = action;
  let data = [...state.data],
    orderMap = { ...state.orderMap };
  if (Object.keys(order).length !== 0) {
    data.unshift(order);
    // if (order.event_name === CONSTANTS.CANCELLED) {
    //   delete orderMap[order.id];
    // } else {
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
    // }
  }
  return {
    ...state,
    data,
    orderMap
  };
};

const oldReducer = (state = initialState, action) => {
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
      return handleSubscription(state, action);
    case ACTIONS.UPDATE_ORDER:
      return handleUpdateOrder(state, action);
    case ACTIONS.RESET_STORE:
      return initialState;
    default:
      return state;
  }
};

// export default (state = initialState, action) => {

// };

export default function(state = initialState, action) {
  return {
    ...oldReducer(state, action),
    filterAll: filterAll(state.filterAll, action),
    filterActive: filterActive(state.filterActive, action),
    filterInactive: filterInactive(state.filterInactive, action)
  };
}

// export default combineReducers({
//   ...oldReducer,
//   filterAll,
//   filterActive
// });

// function createReducer(initialState, handlers) {
//   return function reducer(state = initialState, action) {
//     if (handlers.hasOwnProperty(action.type)) {
//       return handlers[action.type](state, action)
//     } else {
//       return state
//     }
//   }
// }
