import * as ACTIONS from "../actions";

const initialState = {
  data: [],
  activeOrders: [],
  sec: 0,
  channelOnline: false,
  serverOnline: undefined
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
      const { order, sec } = action;
      let combineOrder = { ...order, sec };
      return {
        ...state,
        data: [combineOrder, ...state.data],
        sec,
        serverOnline: true
      };
    default:
      return state;
  }
};
