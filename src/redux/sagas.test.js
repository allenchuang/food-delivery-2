import SocketMock from "socket.io-mock";
import { eventChannel } from "redux-saga";
// import { call, put, take, fork, delay, cancelled } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
// import * as matchers from "redux-saga-test-plan/matchers";
// import { throwError } from "redux-saga-test-plan/providers";
import { listenSubscription } from "./tasks";
import * as ACTIONS from "./actions";
import * as CONSTANTS from "../constants";

const fakeFetchCall = jest.fn(order => ({
  ...order,
  latitude: -123,
  longitude: 90,
  directions: [[-123, 90], [-124, 91]]
}));

describe("listenSubscription Saga tests", () => {
  let emitter;
  let emitterChannel;
  let socket;
  let socketChannel;
  let type;
  let provideEvent;
  beforeEach(() => {
    emitter = new FakeEmitter();
    emitterChannel = socket => (emitter, eventType) => {
      return eventChannel(emit => {
        function mockHandler() {
          emit();
        }
        emitter.on(eventType, mockHandler);
        return () => emitter.off(eventType, emit);
      });
    };
    socket = new SocketMock();
    socket.close = () => {};

    socketChannel = emitterChannel(socket)(emitter, type);
    type = "newOrder";

    provideEvent = event => {
      let consumed = false;
      let newEvent = { ...event };
      return {
        take({ channel }, next) {
          if (channel === socketChannel && !consumed) {
            consumed = true;
            if (newEvent) {
              // console.log("order########", newEvent.order.event_name);
              if (newEvent.order.event_name === CONSTANTS.CREATED) {
                newEvent.order = fakeFetchCall(newEvent.order);
              }
              // console.log("new order@@@@@@@@@@@", newEvent);
            }
            return newEvent;
          }

          return next();
        }
      };
    };
  });

  it("should listen to socket subscription", () => {
    const fakeEvent = {
      order: {
        destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
        event_name: "COOKED",
        id: "f7711c3b",
        name: "Mushroom pizza",
        sent_at_second: 6
      },
      sec: 6
    };

    return expectSaga(listenSubscription, socketChannel)
      .provide([provideEvent(fakeEvent)])
      .put({
        type: ACTIONS.SUBSCRIBE_TIMER,
        order: {
          destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
          event_name: "COOKED",
          id: "f7711c3b",
          name: "Mushroom pizza",
          sent_at_second: 6
        },
        sec: 6
      })
      .run();
  });

  it("should fetch geo data from APIs if event_type is CREATED", () => {
    const fakeEvent = {
      order: {
        destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
        event_name: "CREATED",
        id: "f7711c3b",
        name: "Mushroom pizza",
        sent_at_second: 3
      },
      sec: 3
    };

    return expectSaga(listenSubscription, socketChannel)
      .provide([provideEvent(fakeEvent)])
      .put({
        type: ACTIONS.SUBSCRIBE_TIMER,
        order: {
          destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
          event_name: "CREATED",
          id: "f7711c3b",
          name: "Mushroom pizza",
          sent_at_second: 3,
          latitude: -123,
          longitude: 90,
          directions: [[-123, 90], [-124, 91]]
        },
        sec: 3
      })
      .run()
      .then(({ effects }) => {
        expect(fakeFetchCall).toHaveBeenCalled();
      });
  });

  // it("works", () => {
  //   const type = "newOrder";
  //   return (
  //     expectSaga(startStopChannel)
  //       .provide([
  //         [call(connect), socket],
  //         [matchers.call.fn(delay), null],
  //         [call(createSocketChannel), fakeChannel],
  //         {
  //           take({ socketChannel }, next) {
  //             if (socketChannel === fakeChannel) {
  //               return { order: {}, sec: 2 };
  //             }
  //             return next();
  //           }
  //         },
  //         [matchers.call.fn(cancelled), null]
  //       ])
  //       .put({
  //         type: ACTIONS.CHANNEL_ON
  //       })
  //       .put({
  //         type: ACTIONS.SERVER_ON
  //       })
  //       // .put({
  //       //   type: ACTIONS.SUBSCRIBE_TIMER,
  //       //   order: {},
  //       //   sec: 1
  //       // })

  //       .dispatch({
  //         type: ACTIONS.START_CHANNEL
  //       })

  //       .run()
  //   );
  // });
});

class FakeEmitter {
  constructor() {
    this.subs = [];
    this.count = 0;
  }

  on(type, listener) {
    this.subs.push({
      type,
      listener,
      id: this.count++
    });
  }

  off(type, listener) {
    this.subs = this.subs.filter(sub => sub.listener !== listener);
  }

  emit(event) {
    this.subs.forEach(({ type, listener }) => {
      if (type === event.type) listener(event);
    });
  }
}
