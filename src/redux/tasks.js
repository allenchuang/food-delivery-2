import io from "socket.io-client";
import {
  all,
  take,
  put,
  call,
  fork,
  flush,
  delay,
  race,
  cancel,
  cancelled
} from "redux-saga/effects";

import { eventChannel, buffers } from "redux-saga";
import * as ACTIONS from "./actions";
import * as CONSTANTS from "../constants";

// Socket.io
const socketServerURL = "http://localhost:4001"; // API proxy (http://localhost:4001 <- defined in package.json)

// wrapping functions for socket events (connect, disconnect, reconnect)
let socket;
const geoCache = {};

const connect = () => {
  socket = io(socketServerURL);
  return new Promise(resolve => {
    socket.on("connect", () => {
      resolve(socket);
    });
  });
};

const disconnect = socket => {
  return new Promise(resolve => {
    socket.on("disconnect", reason => {
      if (reason === "io server disconnect") {
        console.log("Disconnected", "Server Disconnected!");
      } else if (reason === "io client disconnect") {
        console.log("Disconnected", "Disconnected through Client");
        // socket.close(); // if stopped close current connection
      } else if (reason === "transport close") {
        console.log(reason);
      }
      // socket.close();
      resolve(socket);
    });
  });
};

const reconnect = socket => {
  return new Promise(resolve => {
    socket.on("reconnect", () => {
      console.log("Reconnected", "Server Reconnected!");
      resolve(socket);
    });
  });
};

// connection monitoring sagas
const listenDisconnectSaga = function*(socket) {
  while (true) {
    yield call(disconnect, socket);
    yield put({ type: ACTIONS.SERVER_OFF });
  }
};

const listenReconnectSaga = function*(socket) {
  while (true) {
    yield call(reconnect, socket);
    yield put({ type: ACTIONS.SERVER_ON });
  }
};

const listenWriteSaga = function*(socket) {
  while (true) {
    const { order } = yield take(ACTIONS.UPDATE_ORDER);
    // yield put({ type: ACTIONS.UPDATE_ORDER, order });
    socket.emit("updateOrder", order);
  }
};

// saga listens for start and stop actions
export const startStopChannel = function*() {
  while (true) {
    yield take(ACTIONS.START_CHANNEL);
    yield race({
      task: call(listenServerSaga),
      cancel: take(ACTIONS.STOP_CHANNEL)
    });
  }
};

// helper function for fetching APIS
async function fetchJson(url) {
  let resp;
  try {
    let data = await fetch(url);
    resp = await data.json();
  } catch (e) {
    resp = { err: e.message };
  }
  return resp;
}

const fetchGeoData = function*(order) {
  geoCache[order.id] = geoCache[order.id] ? geoCache[order.id] : {};

  // only fetch unique destinations per order
  // if not unique simply return the original order obj
  if (geoCache[order.id][order.destination]) {
    return geoCache[order.id][order.destination][order.directions]
      ? geoCache[order.id][order.destination]
      : order;
  } else {
    try {
      // set geoCache to empty obj to make unique
      geoCache[order.id][order.destination] = {};
      yield put({ type: ACTIONS.FETCH_GEODATA_START });
      let geoCodeUrl = `${CONSTANTS.MAPBOX_GEOCODE_URL}${order.destination}.json?access_token=${CONSTANTS.MAPBOX_TOKEN}`;

      // call geoCode API
      const geoCodeData = yield call(fetchJson, geoCodeUrl);
      if (!geoCodeData.err) {
        yield put({ type: ACTIONS.FETCH_GEOCODE_SUCCESS });
        const [
          longitude,
          latitude
        ] = geoCodeData.features[0].geometry.coordinates;
        let directionsUrl = `${
          CONSTANTS.MAPBOX_DIRECTIONS_URL
        }${CONSTANTS.MAPBOX_KITCHEN_COORDINATES.join(
          ","
        )};${longitude},${latitude}?geometries=geojson&access_token=${
          CONSTANTS.MAPBOX_TOKEN
        }`;

        // call directions API
        const directionsData = yield call(fetchJson, directionsUrl);
        if (!directionsData.err) {
          yield put({ type: ACTIONS.FETCH_DIRECTIONS_SUCCESS });
          yield put({ type: ACTIONS.FETCH_GEODATA_SUCCESS });
          const directions = directionsData.routes[0].geometry.coordinates;

          // save to hash table
          geoCache[order.id][order.destination] = {
            latitude,
            longitude,
            directions,
            ...order
          };
          // Return latitude / longitude and directions obj
          return geoCache[order.id][order.destination];
        } else {
          // Error for fetch directions API
          yield put({
            type: ACTIONS.FETCH_DIRECTIONS_FAILED,
            ...directionsData.err.message
          });
        }
      } else {
        // Error for fetch GeoCode API
        yield put({
          type: ACTIONS.FETCH_GEOCODE_FAILED,
          ...geoCodeData.err.message
        });
      }
    } catch (e) {
      // Error for Geo data fetch saga
      yield put({ type: ACTIONS.FETCH_GEODATA_FAILED, message: e.message });
    }
  }
};

const listenSubscription = function*(socketChannel) {
  while (true) {
    const currentEvent = yield take(socketChannel);

    // wait for all events within throttle ms
    yield delay(CONSTANTS.THROTTLE_DELAY);

    // store (flush) all the events within the 1 sec interval to variable
    const bufferedEvents = yield flush(socketChannel);
    const allEvents = [currentEvent].concat(bufferedEvents);

    // goes through all orders in buffer
    const eventsWithGeoData = yield all(
      allEvents.map(order => call(fetchGeoData, order))
    );

    // fork a put action for all event data
    yield fork(function*(allEvents) {
      console.log("all events", allEvents);

      yield put({
        type: ACTIONS.SUBSCRIBE_ORDER,
        orders: allEvents
      });
    }, eventsWithGeoData);
  }
};

const listenTimer = function*(socketChannel) {
  while (true) {
    const sec = yield take(socketChannel);

    yield put({
      type: ACTIONS.SUBSCRIBE_TIMER,
      sec
    });
  }
};

const listenServerSaga = function*() {
  try {
    yield put({ type: ACTIONS.CHANNEL_ON });
    const { socket, timeout } = yield race({
      socket: call(connect),
      timeout: delay(5000)
    });
    // if more than 5 sec
    if (timeout) {
      yield put({ type: ACTIONS.SERVER_OFF });
      socket.disconnect(true);
    }
    const newOrderChannel = yield call(createNewOrderChannel, socket);
    const timerChannel = yield call(createTimerChannel, socket);

    // Listens to timer
    yield fork(listenTimer, timerChannel);

    // Listens to new order events
    yield fork(listenSubscription, newOrderChannel);

    // writing data back to server
    yield fork(listenWriteSaga, socket);

    // listen for socket disconnect / reconnect
    yield fork(listenDisconnectSaga, socket);
    yield fork(listenReconnectSaga, socket);

    yield put({ type: ACTIONS.SERVER_ON });

    while (yield take(ACTIONS.STOP_CHANNEL)) {
      yield cancel(listenSubscription);
      yield cancel(listenWriteSaga);
      yield cancel(listenDisconnectSaga);
      yield cancel(listenReconnectSaga);
      yield cancel(listenServerSaga);
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (yield cancelled()) {
      socket && socket.disconnect(true);
      yield put({ type: ACTIONS.CHANNEL_OFF });
      yield put({ type: ACTIONS.SERVER_OFF });
    }
  }
};

// This is how channel is created
const createNewOrderChannel = socket =>
  eventChannel(emit => {
    const newOrderHandler = order => emit(order);
    socket.on("newOrder", newOrderHandler);

    return () => {
      socket.off("newOrder", newOrderHandler);
    };
  }, buffers.expanding(20));

const createTimerChannel = socket =>
  eventChannel(emit => {
    const timerHandler = sec => emit(sec);
    socket.on("timer", timerHandler);

    return () => {
      socket.off("timer", timerHandler);
    };
  });
