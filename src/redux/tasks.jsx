import io from "socket.io-client";
import {
  take,
  put,
  call,
  fork,
  delay,
  race,
  cancelled
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import * as ACTIONS from "./actions";
import * as CONSTANTS from "../constants";

// Socket.io
const socketServerURL = "http://localhost:4001"; // API proxy (http://localhost:4001 <- defined in package.json)

// wrapping functions for socket events (connect, disconnect, reconnect)
let socket;
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

const listenServerSaga = function*() {
  try {
    yield put({ type: ACTIONS.CHANNEL_ON });
    const { socket, timeout } = yield race({
      socket: call(connect),
      timeout: delay(5000)
    });
    if (timeout) {
      yield put({ type: ACTIONS.SERVER_OFF });
      socket.disconnect(true);
    }
    const socketChannel = yield call(createSocketChannel, socket);
    yield fork(listenWriteSaga, socket);
    yield fork(listenDisconnectSaga, socket);
    yield fork(listenReconnectSaga, socket);
    yield put({ type: ACTIONS.SERVER_ON });

    while (true) {
      const { order, sec } = yield take(socketChannel);
      yield put({
        type: ACTIONS.SUBSCRIBE_TIMER,
        order: order,
        sec
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (yield cancelled()) {
      socket && socket.disconnect(true);
      yield put({ type: ACTIONS.CHANNEL_OFF });
    }
  }
};

const getGeocode = order => {
  // if (order.event_name === CONSTANTS.CREATED) {
  let url = `${CONSTANTS.MAPBOX_GEOCODE_URL}${order.destination}.json?access_token=${CONSTANTS.MAPBOX_TOKEN}`;
  return fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Fetch to MapBox Geocoder failed");
      }
    })
    .then(res => {
      // append lat / long coordinates
      let latitude = res.features[0].center[0],
        longitude = res.features[0].center[1];
      console.log("order", latitude);
      return {
        ...order,
        latitude,
        longitude
      };
    })
    .catch(error => console.log(error));
};

// This is how channel is created
const createSocketChannel = socket =>
  eventChannel(emit => {
    const newOrderHandler = async (order, sec) => {
      let newOrder = { ...order };
      if (order.event_name === CONSTANTS.CREATED) {
        let geoCodeUrl = `${CONSTANTS.MAPBOX_GEOCODE_URL}${order.destination}.json?access_token=${CONSTANTS.MAPBOX_TOKEN}`;
        const geoCodeResponse = await fetch(geoCodeUrl);
        const json = await geoCodeResponse.json();

        let longitude = json.features[0].geometry.coordinates[0];
        let latitude = json.features[0].geometry.coordinates[1];
        let directionsUrl = `${
          CONSTANTS.MAPBOX_DIRECTIONS_URL
        }${CONSTANTS.MAPBOX_KITCHEN_COORDINATES.join(
          ","
        )};${longitude},${latitude}?geometries=geojson&access_token=${
          CONSTANTS.MAPBOX_TOKEN
        }`;
        const directionsResponse = await fetch(directionsUrl);
        const directionsJson = await directionsResponse.json();

        let directions = directionsJson.routes[0].geometry.coordinates;
        newOrder = { ...order, latitude, longitude, directions };
      }

      emit({
        order: newOrder,
        sec
      });
    };

    socket.on("newOrder", newOrderHandler);

    return () => {
      socket.off("newOrder", newOrderHandler);
    };
  });
