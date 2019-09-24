import { mapOrderTypesToKey, getOrdersWithFilters } from "./selectors";
import * as CONSTANTS from "../constants";
import mockState, {
  allOrdersData,
  filteredAllOrdersData,
  activeOrdersData,
  filteredActiveOrdersData,
  inactiveOrdersData,
  filteredInactiveOrdersData
} from "./mockState";

describe("testing order selector", () => {
  describe("All orders", () => {
    it("should return all orders from data received", () => {
      expect(getOrdersWithFilters(mockState, CONSTANTS.ALL_ORDERS)).toEqual(
        allOrdersData
      );
    });

    it("should return filtered all orders when filters are applied", () => {
      let filteredMockState = {
        ...mockState,
        filterAll: {
          event: CONSTANTS.COOKED,
          sec: 8
        }
      };

      expect(
        getOrdersWithFilters(filteredMockState, CONSTANTS.ALL_ORDERS)
      ).toEqual(filteredAllOrdersData);
    });
  });
  describe("Active orders", () => {
    it("should return active orders from data received", () => {
      expect(getOrdersWithFilters(mockState, CONSTANTS.ACTIVE_ORDERS)).toEqual(
        activeOrdersData
      );
    });

    it("should return filtered active orders when filters are applied", () => {
      let filteredMockState = {
        ...mockState,
        filterActive: {
          event: CONSTANTS.COOKED,
          sec: 4
        }
      };

      expect(
        getOrdersWithFilters(filteredMockState, CONSTANTS.ACTIVE_ORDERS)
      ).toEqual(filteredActiveOrdersData);
    });
  });
  describe("Inactive orders", () => {
    it("should return Inactive orders from data received", () => {
      expect(
        getOrdersWithFilters(mockState, CONSTANTS.INACTIVE_ORDERS)
      ).toEqual(inactiveOrdersData);
    });

    it("should return filtered all orders when filters are applied", () => {
      let filteredMockState = {
        ...mockState,
        filterInactive: {
          event: CONSTANTS.DELIVERED
        }
      };

      expect(
        getOrdersWithFilters(filteredMockState, CONSTANTS.INACTIVE_ORDERS)
      ).toEqual(filteredInactiveOrdersData);
    });
  });
});
