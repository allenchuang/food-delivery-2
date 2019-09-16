// ORDER CONSTANTS
export const CREATED = 'CREATED'
export const COOKED = 'COOKED'
export const DRIVER_RECEIVED = 'DRIVER_RECEIVED'
export const CANCELLED = 'CANCELLED'
export const DELIVERED = 'DELIVERED'
export const ACTIVE_EVENTS = [CREATED, COOKED, DRIVER_RECEIVED]
export const INACTIVE_EVENTS = [CANCELLED, DELIVERED]
export const ALL_EVENTS = [...ACTIVE_EVENTS, ...INACTIVE_EVENTS]

export const MAPBOX_DIRECTIONS_URL =
'https://api.mapbox.com/directions/v5/mapbox/driving/'
export const MAPBOX_GEOCODE_URL =
'https://api.mapbox.com/geocoding/v5/mapbox.places/'
export const MAPBOX_TOKEN =
'pk.eyJ1IjoiYWxjaHVhbmciLCJhIjoiY2swZGdxbWt3MDcxbTNocjBxYWlzMTN4aSJ9.l1B53WCC2Te-jLtMpVfyJg'
export const MAPBOX_KITCHEN_COORDINATES = `-118.461708,34.009408`
export const MAPBOX_KITCHEN_ADDRESS = `1800 Marine Street, Santa Monica, CA 90405`
