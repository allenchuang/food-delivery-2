import * as ACTIONS from "./actions";

const initialState = {
  data: [],
  activeOrders: [],
  inactiveOrders: [],
  orderMap: {},
  sec: 0,
  channelOnline: false,
  serverOnline: undefined
};

const handleSubscription = (state, action) => {
  const { order, sec } = action;
  // let { data, orderMap, inactiveOrders, activeOrders } = state;
  // let newData = [...data];
  // if (Object.keys(order).length !== 0) {
  //   state.data.unshift(order);
  // }
  //   orderMap[order.id] = order;
  //   activeOrders = Object.values(orderMap)
  //     .filter(order => ACTIONS.ACTIVE_EVENTS.includes(order.event_name))
  //     .sort((a, b) => b.sent_at_second - a.sent_at_second);
  //   inactiveOrders = Object.values(orderMap)
  //     .filter(order => ACTIONS.INACTIVE_EVENTS.includes(order.event_name))
  //     .sort((a, b) => b.sent_at_second - a.sent_at_second);
  // }

  return {
    ...state,
    serverOnline: true,
    sec, // time elapsed,
    data: Object.keys(order).length !== 0 ? [order, ...state.data] : state.data
    // orderMap,
    // activeOrders,
    // inactiveOrders
  };

  // return {
  //   ...state,
  //   serverOnline: true,
  //   data: [order, ...state.data], // create feed
  //   sec, // time elapsed
  //   orderMap,
  //   activeOrders,
  //   inactiveOrders
  // };
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
    default:
      return state;
  }
};
