import rootReducer from "./reducers";
import initialState from "./initialState";
import * as ACTIONS from "./actions";

describe("Testing rootReducers", () => {
  // SOCKET REDUCER TESTS
  describe("SOCKET REDUCER TESTS", () => {
    describe("when passing ACTIONS.CHANNEL_ON action type", () => {
      it("should return channelOnline: true", () => {
        const action = {
          type: ACTIONS.CHANNEL_ON
        };

        const updatedState = rootReducer(initialState, action);
        expect(updatedState).toEqual({
          ...initialState,
          channelOnline: true
        });
      });
    });
    describe("when passing ACTIONS.CHANNEL_OFF action type", () => {
      it("should return channelOnline: false", () => {
        const action = {
          type: ACTIONS.CHANNEL_OFF
        };

        const updatedState = rootReducer(initialState, action);
        expect(updatedState).toEqual({
          ...initialState,
          channelOnline: false
        });
      });
    });
    describe("when passing ACTIONS.SERVER_ON action type", () => {
      it("should return serverOnline: true", () => {
        const action = {
          type: ACTIONS.SERVER_ON
        };

        const updatedState = rootReducer(initialState, action);
        expect(updatedState).toEqual({
          ...initialState,
          serverOnline: true
        });
      });
    });
    describe("when passing ACTIONS.SERVER_OFF action type", () => {
      it("should return serverOnline: false", () => {
        const action = {
          type: ACTIONS.SERVER_OFF
        };

        const updatedState = rootReducer(initialState, action);
        expect(updatedState).toEqual({
          ...initialState,
          serverOnline: false
        });
      });
    });
  });

  // SUBSCRIPTION TESTS
  describe("SUBSCRIPTION REDUCER TESTS", () => {
    describe("when passing ACTIONS.SUBSCRIBE_TIMER action type", () => {
      it("should add new data to top of array and update orderMap", () => {
        const action = {
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
        };

        const updatedState = rootReducer(initialState, action);

        expect(updatedState).toEqual({
          ...initialState,
          data: [
            {
              destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
              event_name: "CREATED",
              id: "f7711c3b",
              name: "Mushroom pizza",
              sent_at_second: 3,
              latitude: -123,
              longitude: 90,
              directions: [[-123, 90], [-124, 91]]
            }
          ],
          orderMap: {
            f7711c3b: {
              destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
              event_name: "CREATED",
              id: "f7711c3b",
              name: "Mushroom pizza",
              sent_at_second: 3,
              latitude: -123,
              longitude: 90,
              directions: [[-123, 90], [-124, 91]]
            }
          },
          sec: 3,
          serverOnline: true
        });
      });

      it("should overwrite orderMap data if id exists", () => {
        const mockInitialState = {
          ...initialState,
          data: [
            {
              destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
              event_name: "CREATED",
              id: "f7711c3b",
              name: "Mushroom pizza",
              sent_at_second: 3,
              latitude: -123,
              longitude: 90,
              directions: [[-123, 90], [-124, 91]]
            }
          ],
          orderMap: {
            f7711c3b: {
              destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
              event_name: "CREATED",
              id: "f7711c3b",
              name: "Mushroom pizza",
              sent_at_second: 3,
              latitude: -123,
              longitude: 90,
              directions: [[-123, 90], [-124, 91]]
            }
          },
          sec: 3
        };
        const action = {
          type: ACTIONS.SUBSCRIBE_TIMER,
          order: {
            destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
            event_name: "COOKED",
            id: "f7711c3b",
            name: "Mushroom pizza",
            sent_at_second: 6,
            latitude: -123,
            longitude: 90,
            directions: [[-123, 90], [-124, 91]]
          },
          sec: 6
        };

        const updatedState = rootReducer(mockInitialState, action);

        expect(updatedState).toEqual({
          ...mockInitialState,
          data: [
            {
              destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
              event_name: "COOKED",
              id: "f7711c3b",
              name: "Mushroom pizza",
              sent_at_second: 6,
              latitude: -123,
              longitude: 90,
              directions: [[-123, 90], [-124, 91]]
            },
            {
              destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
              event_name: "CREATED",
              id: "f7711c3b",
              name: "Mushroom pizza",
              sent_at_second: 3,
              latitude: -123,
              longitude: 90,
              directions: [[-123, 90], [-124, 91]]
            }
          ],
          orderMap: {
            f7711c3b: {
              destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
              event_name: "COOKED",
              id: "f7711c3b",
              name: "Mushroom pizza",
              sent_at_second: 6,
              latitude: -123,
              longitude: 90,
              directions: [[-123, 90], [-124, 91]]
            }
          },
          sec: 6,
          serverOnline: true
        });
      });
    });
  });
});

describe("RESET STORE REDUCER TEST", () => {
  describe("when passing ACTIONS.RESET_STORE action type", () => {
    it("should clear redux store to initial state", () => {
      const mockInitialState = {
        ...initialState,
        data: [
          {
            destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
            event_name: "CREATED",
            id: "f7711c3b",
            name: "Mushroom pizza",
            sent_at_second: 3,
            latitude: -123,
            longitude: 90,
            directions: [[-123, 90], [-124, 91]]
          }
        ],
        orderMap: {
          f7711c3b: {
            destination: "801 Toyopa Dr, Pacific Palisades, CA 90272",
            event_name: "CREATED",
            id: "f7711c3b",
            name: "Mushroom pizza",
            sent_at_second: 3,
            latitude: -123,
            longitude: 90,
            directions: [[-123, 90], [-124, 91]]
          }
        },
        sec: 3,
        serverOnline: true,
        channelOnline: true,
        filterAll: {
          event: "CREATED",
          sec: null
        },
        filterActive: {
          event: "COOKED",
          sec: 3
        },
        filterInactive: {
          event: "CANCELLED",
          sec: null
        }
      };
      const action = {
        type: ACTIONS.RESET_STORE
      };

      const updatedState = rootReducer(mockInitialState, action);

      expect(updatedState).toEqual(initialState);
    });
  });
});
