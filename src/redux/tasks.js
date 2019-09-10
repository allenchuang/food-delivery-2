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
        // socket.close();
      }
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

// Saga to switch on channel.
// const listenServerSaga = function* () {
//   try {
//     yield put({type: ACTIONS.CHANNEL_ON});
//     const {timeout} = yield race({
//       connected: call(connect),
//       timeout: delay(5000),
//     });
//     if (timeout) {
//       yield put({type: ACTIONS.SERVER_OFF});
//     }
//     const socket = yield call(connect);
//     const socketChannel = yield call(createSocketChannel, socket);

//     // yield fork(listenDisconnectSaga(socketChannel));
//     // yield fork(listenConnectSaga(socketChannel));
//     yield put({type: ACTIONS.SERVER_ON});

//     while (true) {
//       const { order, sec } = yield take(socketChannel);
//       yield put({type: ACTIONS.SUBSCRIBE_TIMER, order, sec});
//     }
//   } catch (error) {
//     console.log(error);
//   } finally {
//     if (yield cancelled()) {
//       socket.disconnect(true);
//       yield put({type: ACTIONS.CHANNEL_OFF});
//     }
//   }
// };

export default function* startStopChannel() {
  yield take(ACTIONS.START_CHANNEL);
  try {
    yield put({ type: ACTIONS.CHANNEL_ON });
    const { socket, timeout } = yield race({
      socket: call(connect),
      timeout: delay(5000)
    });
    if (socket) {
      yield put({ type: ACTIONS.SERVER_ON });
      yield fork(read, socket);
      yield fork(listenDisconnectSaga, socket);
      yield fork(listenReconnectSaga, socket);
    } else {
      yield put({ type: ACTIONS.SERVER_OFF });
      socket.disconnect(true);
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (yield cancelled()) {
      socket.disconnect(true);
      yield put({ type: ACTIONS.CHANNEL_OFF });
    }
  }
}

const read = function*(socket) {
  const socketChannel = yield call(createSocketChannel, socket);

  while (true) {
    const { order, sec } = yield take(socketChannel);
    yield put({ type: ACTIONS.SUBSCRIBE_TIMER, order, sec });
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
