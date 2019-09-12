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

// saga listens for start and stop actions
export const startStopChannel = function* () {
  while (true) {
    yield take(ACTIONS.START_CHANNEL);
    yield race({
      task: call(listenServerSaga),
      cancel: take(ACTIONS.STOP_CHANNEL),
    });
  }
};


const listenServerSaga = function* () {
  try {
    yield put({ type: ACTIONS.CHANNEL_ON });
    const { socket, timeout } = yield race({
      socket: call(connect),
      timeout: delay(5000),
    });
    // if (socket) {
    //   const socketChannel = yield call(createSocketChannel, socket);
    //   yield fork(listenDisconnectSaga, socket);
    //   yield fork(listenReconnectSaga, socket);
    //   yield put({ type: ACTIONS.SERVER_ON });
    //   // yield fork(read, socket);
    // } else  
    if (timeout) {
      yield put({ type: ACTIONS.SERVER_OFF });
      socket.disconnect(true);
    }
    const socketChannel = yield call(createSocketChannel, socket);
      yield fork(listenDisconnectSaga, socket);
      yield fork(listenReconnectSaga, socket);
      yield put({ type: ACTIONS.SERVER_ON });

    while (true) {
      const { order, sec } = yield take(socketChannel);
      // const newOrder = yield call(getGeocode, order);
      // const newOrder = yield take(fetchGeocode);
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
}

const getGeocode = async order => {
  if (order.event_name === CONSTANTS.CREATED) {
    let url = `${CONSTANTS.MAPBOX_GEOCODE_URL}${order.destination}.json?access_token=${CONSTANTS.MAPBOX_TOKEN}`;
    return await fetch(url)
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
        return {
          ...order,
          latitude,
          longitude
        };
      })
      .catch(error => console.log(error));
  } else {
    return order;
  }
};

const read = function*(socket) {
  const socketChannel = yield call(createSocketChannel, socket);

  while (true) {
    const { order, sec } = yield take(socketChannel);
    // const newOrder = yield call(getGeocode, order);
    // const newOrder = yield take(fetchGeocode);
    yield put({
      type: ACTIONS.SUBSCRIBE_TIMER,
      order: order,
      sec
    });
    // yield put({ type: ACTIONS.GET_ORDERS_GEOCODE, order});
  }
};

// This is how channel is created
const createSocketChannel = socket =>
  eventChannel(emit => {
    const newOrderHandler = (order, sec) => {
      emit({
        order,
        sec
      });
    };

    socket.on("newOrder", newOrderHandler);

    return () => {
      socket.off("newOrder", newOrderHandler);
    };
  });
