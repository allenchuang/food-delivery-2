import io from "socket.io-client";
import {
  take,
  put,
  call,
  fork,
  delay,
  race,
  cancel,
  cancelled
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import * as ACTIONS from "./actions";
import * as CONSTANTS from "../constants";

// Socket.io
const socketServerURL = "http://localhost:4001"; // API proxy (http://localhost:4001 <- defined in package.json)

// wrapping functions for socket events (connect, disconnect, reconnect)
let socket;
export const connect = () => {
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
export const listenDisconnectSaga = function*(socket) {
  while (true) {
    yield call(disconnect, socket);
    yield put({ type: ACTIONS.SERVER_OFF });
  }
};

export const listenReconnectSaga = function*(socket) {
  while (true) {
    yield call(reconnect, socket);
    yield put({ type: ACTIONS.SERVER_ON });
  }
};

export const listenWriteSaga = function*(socket) {
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

export const listenSubscription = function*(socketChannel) {
  while (true) {
    const { order, sec } = yield take(socketChannel);
    yield put({
      type: ACTIONS.SUBSCRIBE_TIMER,
      order: order,
      sec
    });
  }
};

export const listenServerSaga = function*() {
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
    const socketChannel = yield call(createSocketChannel, socket);

    yield fork(listenSubscription, socketChannel);
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

export const fetchGeoData = async order => {
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

  return { ...order, latitude, longitude, directions };
};
// This is how channel is created
export const createSocketChannel = socket =>
  eventChannel(emit => {
    const newOrderHandler = async (order, sec) => {
      let newOrder = Object.assign({}, order);
      // Condition to fetch for Destination Geocode / Routes
      // TODO: Will have to include scenario for updating address,
      // i.e. only fetch when new order is created or order address has been updated
      if (order.event_name === CONSTANTS.CREATED) {
        try {
          newOrder = await fetchGeoData(order);
        } catch (error) {
          console.error(error);
        }
      }

      // if no fetch required, emit back the same order object.
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
