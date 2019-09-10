// ACTION CONSTANTS
export const START_CHANNEL = 'START_CHANNEL';
export const STOP_CHANNEL = 'STOP_CHANNEL';
export const CHANNEL_ON = 'CHANNEL_ON';
export const CHANNEL_OFF = 'CHANNEL_OFF';
export const SERVER_ON = 'SERVER_ON';
export const SERVER_OFF = 'SERVER_OFF';

export const SUBSCRIBE_TIMER = 'SUBSCRIBE_TIMER';

export const GET_ACTIVE_ORDERS = 'GET_ACTIVE_ORDERS';
export const FILTER_CREATED_ORDERS = 'FILTER_CREATED_ORDERS';
export const FILTER_COOKED_ORDERS = 'FILTER_COOKED_ORDERS';

export const GET_ORDER_HISTORY = 'GET_ORDER_HISTORY';
export const UPDATE_ORDER = 'UPDATE_ORDER';


// ACTION CREATORS

// --- SOCKETS
export const startChannel = () => ({
  type: START_CHANNEL
});

export const stopChannel = () => ({
  type: STOP_CHANNEL
})

// --- ACTIVE ORDERS
export const getActiveOrders = () => ({
  type: GET_ACTIVE_ORDERS
});

export const filterCreatedOrders = () => ({
  type: FILTER_CREATED_ORDERS
});

export const filterCookedOrders = () => ({
  type: FILTER_COOKED_ORDERS
});

// --- ORDER HISTORY
export const getOrderHistory = () => ({
  type: GET_ORDER_HISTORY
});

// --- UPDATE ORDER
export const updateOrder = (id, order) => ({
  type: UPDATE_ORDER,
  order
});
