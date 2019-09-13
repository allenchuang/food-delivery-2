// ACTION CONSTANTS
export const START_CHANNEL = 'START_CHANNEL'
export const STOP_CHANNEL = 'STOP_CHANNEL'
export const CHANNEL_ON = 'CHANNEL_ON'
export const CHANNEL_OFF = 'CHANNEL_OFF'
export const SERVER_ON = 'SERVER_ON'
export const SERVER_OFF = 'SERVER_OFF'

export const SUBSCRIBE_TIMER = 'SUBSCRIBE_TIMER'

export const GET_ACTIVE_ORDERS = 'GET_ACTIVE_ORDERS'
export const FILTER_ACTIVE_ORDERS_TYPE = 'FILTER_ACTIVE_ORDERS_TYPE'
export const FILTER_ACTIVE_ORDERS_SEC = 'FILTER_ACTIVE_ORDERS_SEC'

export const GET_ORDER_HISTORY = 'GET_ORDER_HISTORY'
export const UPDATE_ORDER = 'UPDATE_ORDER'

export const GET_ORDERS_GEOCODE = 'GET_ORDERS_GEOCODE'

// ACTION CREATORS

// --- SOCKETS
export const startChannel = () => ({
  type: START_CHANNEL
})

export const stopChannel = () => ({
  type: STOP_CHANNEL
})

// --- ACTIVE ORDERS
export const getActiveOrders = () => ({
  type: GET_ACTIVE_ORDERS
})

export const filterByType = eventType => ({
  type: FILTER_ACTIVE_ORDERS_TYPE,
eventType})

export const filterBySec = secTilNow => ({
  type: FILTER_ACTIVE_ORDERS_SEC,
secTilNow})

// --- ORDER HISTORY
export const getOrderHistory = () => ({
  type: GET_ORDER_HISTORY
})

// --- UPDATE ORDER
export const updateOrder = (id, order) => ({
  type: UPDATE_ORDER,
order})

export const getOrdersGeocode = order => ({
  type: GET_ORDERS_GEOCODE,
order})
