// ORDER TYPES
export const ALL_ORDERS = 'ALL_ORDERS'
export const ACTIVE_ORDERS = 'ACTIVE_ORDERS'
export const INACTIVE_ORDERS = 'INACTIVE_ORDERS'

// ORDER EVENT NAMES
export const CREATED = 'CREATED'
export const COOKED = 'COOKED'
export const DRIVER_RECEIVED = 'DRIVER_RECEIVED'
export const CANCELLED = 'CANCELLED'
export const DELIVERED = 'DELIVERED'

// ORDER EVENT TYPES  
export const ACTIVE_ORDERS_EVENTS = [CREATED, COOKED, DRIVER_RECEIVED]
export const INACTIVE_ORDERS_EVENTS = [CANCELLED, DELIVERED]
export const ALL_ORDERS_EVENTS = [...ACTIVE_ORDERS_EVENTS, ...INACTIVE_ORDERS_EVENTS]

// MAPBOX 
export const MAPBOX_DIRECTIONS_URL =
'https://api.mapbox.com/directions/v5/mapbox/driving/'
export const MAPBOX_GEOCODE_URL =
'https://api.mapbox.com/geocoding/v5/mapbox.places/'
export const MAPBOX_TOKEN =
'pk.eyJ1IjoiYWxjaHVhbmciLCJhIjoiY2swZGdxbWt3MDcxbTNocjBxYWlzMTN4aSJ9.l1B53WCC2Te-jLtMpVfyJg'
export const MAPBOX_KITCHEN_COORDINATES = [-118.461708, 34.009408]
export const MAPBOX_KITCHEN_ADDRESS = `1800 Marine Street, Santa Monica, CA 90405`
