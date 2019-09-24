import { filterAll, filterActive, filterInactive } from "./filtersReducer";
import { defaultFilterState } from "./initialState";
import * as ACTIONS from "./actions";
import * as CONSTANTS from "../constants";

describe("Testing filter reducers", () => {
  // FILTER EVENT REDUCER TESTS
  describe("FILTER EVENT REDUCER TESTS", () => {
    describe("when passing FILTER_{ORDER_TYPE}_EVENT action type", () => {
      it("should update All orders filter based on orderType", () => {
        const allOrdersAction = {
          type: ACTIONS.FILTER_ALL_ORDERS_EVENT,
          event: CONSTANTS.CREATED
        };

        const updatedAllOrdersState = filterAll(
          defaultFilterState,
          allOrdersAction
        );

        expect(updatedAllOrdersState).toEqual({
          ...defaultFilterState,
          event: CONSTANTS.CREATED
        });
      });
      it("should update Inactive filter based on orderType", () => {
        const inactiveAction = {
          type: ACTIONS.FILTER_INACTIVE_ORDERS_EVENT,
          event: CONSTANTS.CANCELLED
        };

        const updatedInactiveState = filterInactive(
          defaultFilterState,
          inactiveAction
        );
        expect(updatedInactiveState).toEqual({
          ...defaultFilterState,
          event: CONSTANTS.CANCELLED
        });
      });
      it("should update Active filter based on orderType", () => {
        const activeAction = {
          type: ACTIONS.FILTER_ACTIVE_ORDERS_EVENT,
          event: CONSTANTS.COOKED
        };

        const updatedActiveState = filterActive(
          defaultFilterState,
          activeAction
        );

        expect(updatedActiveState).toEqual({
          ...defaultFilterState,
          event: CONSTANTS.COOKED
        });
      });
    });
  });

  describe("FILTER SEC REDUCER TESTS", () => {
    describe("when passing FILTER_{ORDER_TYPE}_SEC action type", () => {
      it("should update All orders filter based on orderType", () => {
        const allOrdersAction = {
          type: ACTIONS.FILTER_ALL_ORDERS_SEC,
          sec: 2
        };

        const updatedAllOrdersState = filterAll(
          defaultFilterState,
          allOrdersAction
        );

        expect(updatedAllOrdersState).toEqual({
          ...defaultFilterState,
          sec: 2
        });
      });
      it("should update Inactive filter based on orderType", () => {
        const inactiveAction = {
          type: ACTIONS.FILTER_INACTIVE_ORDERS_SEC,
          sec: 8
        };

        const updatedInactiveState = filterInactive(
          defaultFilterState,
          inactiveAction
        );
        expect(updatedInactiveState).toEqual({
          ...defaultFilterState,
          sec: 8
        });
      });
      it("should update Active filter based on orderType", () => {
        const activeAction = {
          type: ACTIONS.FILTER_ACTIVE_ORDERS_SEC,
          sec: 9
        };

        const updatedActiveState = filterActive(
          defaultFilterState,
          activeAction
        );

        expect(updatedActiveState).toEqual({
          ...defaultFilterState,
          sec: 9
        });
      });
    });
  });
});
