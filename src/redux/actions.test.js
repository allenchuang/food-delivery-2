import configureMockStore from "redux-mock-store";
import * as ACTIONS from "./actions";
import * as CONSTANTS from "../constants";
import initialState from "./initialState";

const mockStore = configureMockStore();
const store = mockStore(initialState);

describe("Testing Actions", () => {
  beforeEach(() => {
    store.clearActions();
  });
  describe("Testing Socket Actions", () => {
    describe("---startChannel", () => {
      it("should receive START_CHANNEL action in store", () => {
        const action = ACTIONS.startChannel();
        store.dispatch(action);
        const actions = store.getActions();
        expect(actions).toEqual([{ type: "START_CHANNEL" }]);
      });
    });
    describe("---stopChannel", () => {
      it("should receive STOP_CHANNEL action in store", () => {
        const action = ACTIONS.stopChannel();
        store.dispatch(action);
        const actions = store.getActions();
        expect(actions).toEqual([{ type: "STOP_CHANNEL" }]);
      });
    });
  });
  describe("Reset store action", () => {
    describe("---resetStore", () => {
      it("should receive RESET_STORE action in store", () => {
        const action = ACTIONS.resetStore();
        store.dispatch(action);
        const actions = store.getActions();
        expect(actions).toEqual([{ type: "RESET_STORE" }]);
      });
    });
  });
  describe("Filter actions", () => {
    describe("---filterEventByOrderType", () => {
      describe("All orders", () => {
        it("should receive FILTER_ALL_ORDERS_EVENT action when ALL_ORDERS is passed", () => {
          const action = ACTIONS.filterEventByOrderType(CONSTANTS.ALL_ORDERS)(
            null
          );
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_ALL_ORDERS_EVENT", event: null }
          ]);
        });
        it("should pass in event based on selection", () => {
          const action = ACTIONS.filterEventByOrderType(CONSTANTS.ALL_ORDERS)(
            CONSTANTS.CREATED
          );
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_ALL_ORDERS_EVENT", event: "CREATED" }
          ]);
        });
      });
      describe("Active orders", () => {
        it("should receive FILTER_ACTIVE_ORDERS_EVENT action when ACTIVE_ORDERS is passed", () => {
          const action = ACTIONS.filterEventByOrderType(
            CONSTANTS.ACTIVE_ORDERS
          )(null);
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_ACTIVE_ORDERS_EVENT", event: null }
          ]);
        });
        it("should pass in event based on selection", () => {
          const action = ACTIONS.filterEventByOrderType(
            CONSTANTS.ACTIVE_ORDERS
          )(CONSTANTS.COOKED);
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_ACTIVE_ORDERS_EVENT", event: "COOKED" }
          ]);
        });
      });
      describe("Inactive orders", () => {
        it("should receive FILTER_INACTIVE_ORDERS_EVENT action when INACTIVE_ORDERS is passed", () => {
          const action = ACTIONS.filterEventByOrderType(
            CONSTANTS.INACTIVE_ORDERS
          )(null);
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_INACTIVE_ORDERS_EVENT", event: null }
          ]);
        });
        it("should pass in event based on selection", () => {
          const action = ACTIONS.filterEventByOrderType(
            CONSTANTS.INACTIVE_ORDERS
          )(CONSTANTS.DRIVER_RECEIVED);
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_INACTIVE_ORDERS_EVENT", event: "DRIVER_RECEIVED" }
          ]);
        });
      });
    });

    describe("---filterSecByOrderType", () => {
      describe("All orders", () => {
        it("should receive FILTER_ALL_ORDERS_SEC action when ALL_ORDERS is passed", () => {
          const action = ACTIONS.filterSecByOrderType(CONSTANTS.ALL_ORDERS)(
            null
          );
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_ALL_ORDERS_SEC", sec: null }
          ]);
        });
        it("should pass in event based on selection", () => {
          const action = ACTIONS.filterSecByOrderType(CONSTANTS.ALL_ORDERS)(3);
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([{ type: "FILTER_ALL_ORDERS_SEC", sec: 3 }]);
        });
      });
      describe("Active orders", () => {
        it("should receive FILTER_ACTIVE_ORDERS_SEC action when ACTIVE_ORDERS is passed", () => {
          const action = ACTIONS.filterSecByOrderType(CONSTANTS.ACTIVE_ORDERS)(
            null
          );
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_ACTIVE_ORDERS_SEC", sec: null }
          ]);
        });
        it("should pass in event based on selection", () => {
          const action = ACTIONS.filterSecByOrderType(CONSTANTS.ACTIVE_ORDERS)(
            4
          );
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_ACTIVE_ORDERS_SEC", sec: 4 }
          ]);
        });
      });
      describe("Inactive orders", () => {
        it("should receive FILTER_INACTIVE_ORDERS_SEC action when INACTIVE_ORDERS is passed", () => {
          const action = ACTIONS.filterSecByOrderType(
            CONSTANTS.INACTIVE_ORDERS
          )(null);
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_INACTIVE_ORDERS_SEC", sec: null }
          ]);
        });
        it("should pass in event based on selection", () => {
          const action = ACTIONS.filterSecByOrderType(
            CONSTANTS.INACTIVE_ORDERS
          )(5);
          store.dispatch(action);
          const actions = store.getActions();
          expect(actions).toEqual([
            { type: "FILTER_INACTIVE_ORDERS_SEC", sec: 5 }
          ]);
        });
      });
    });
  });
  describe("Update Orders", () => {
    const mockOrder = {
      destination: "1041 S Fairfax Ave, Los Angeles, CA 90019",
      event_name: "COOKED",
      id: "031c71b2",
      name: "Chocolate ice cream",
      sent_at_second: 16,
      uid: "d91cc590-de67-11e9-b74d-51e03e6b6aaf"
    };
    const action = ACTIONS.updateOrder(mockOrder);
    store.dispatch(action);
    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: "UPDATE_ORDER",
        order: mockOrder
      }
    ]);
  });
});
