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

  let { orderMap, activeOrders, inactiveOrders } = state;
  orderMap[order.id] = order;
  activeOrders = Object.values(orderMap)
    .filter(order => ACTIONS.ACTIVE_EVENTS.includes(order.event_name))
    .sort((a, b) => b.sent_at_second - a.sent_at_second);
  inactiveOrders = Object.values(orderMap)
    .filter(order => ACTIONS.INACTIVE_EVENTS.includes(order.event_name))
    .sort((a, b) => b.sent_at_second - a.sent_at_second);

  let combineOrder = { ...order, sec };
  return {
    ...state,
    serverOnline: true,
    data: [combineOrder, ...state.data], // create feed
    sec, // time elapsed
    orderMap,
    activeOrders,
    inactiveOrders
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
    default:
      return state;
  }
};
