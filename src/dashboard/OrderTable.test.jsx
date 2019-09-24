import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mount } from "enzyme";
import OrderTable from "./OrderTable";

import OrderPopup from "./OrderPopup";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import * as CONSTANTS from "../constants";

import mockState, { filteredAllOrdersData } from "../redux/mockState";

describe("<OrderTable/>", () => {
  const mockStore = configureMockStore();
  const store = mockStore(mockState);

  let wrapper, props;
  beforeEach(() => {
    store.clearActions();
    props = {
      handleFilterByType: jest.fn(),
      handleFilterBySec: jest.fn()
    };

    wrapper = mount(
      <Provider store={store}>
        <OrderTable
          title={"All orders demo"}
          orderType={CONSTANTS.ALL_ORDERS}
          {...props}
        />
      </Provider>
    ).find(OrderTable);
  });
  it("renders ", () => {
    expect(wrapper.length).toBe(1);
  });

  it("should filter table data by event", () => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: CONSTANTS.COOKED } });
    expect(store.getActions()).toEqual([
      { type: "FILTER_ALL_ORDERS_EVENT", event: "COOKED" }
    ]);
  });

  it("should NOT show text field to filter for sec when filter COOKED is NOT selected", () => {
    const filteredStore = mockStore({
      ...mockState,
      filterAll: {
        event: CONSTANTS.CREATED,
        sec: null
      }
    });
    wrapper = mount(
      <Provider store={filteredStore}>
        <OrderTable
          title={"All orders demo"}
          orderType={CONSTANTS.ALL_ORDERS}
          {...props}
        />
      </Provider>
    );
    expect(wrapper.find(TextField).length).toBe(0);
  });

  it("should show text field to filter for sec when filter COOKED is selected", () => {
    const filteredStore = mockStore({
      ...mockState,
      filterAll: {
        event: CONSTANTS.COOKED,
        sec: 5
      }
    });
    wrapper = mount(
      <Provider store={filteredStore}>
        <OrderTable
          title={"All orders demo"}
          orderType={CONSTANTS.ALL_ORDERS}
          {...props}
        />
      </Provider>
    );
    expect(wrapper.find(TextField).length).toBe(1);
  });

  it("should update filter data table by sec", () => {
    const filteredStore = mockStore({
      ...mockState,
      filterAll: {
        event: CONSTANTS.COOKED,
        sec: 0
      }
    });
    wrapper = mount(
      <Provider store={filteredStore}>
        <OrderTable
          title={"All orders demo"}
          orderType={CONSTANTS.ALL_ORDERS}
          {...props}
        />
      </Provider>
    ).find(OrderTable);
    wrapper
      .find(TextField)
      .at(0)
      .props()
      .onChange({ target: { value: "5" } });

    expect(filteredStore.getActions()).toEqual([
      { type: "FILTER_ALL_ORDERS_SEC", sec: 5 }
    ]);
  });

  it("should show update order popup on click of edit button", () => {
    wrapper
      .find("button#edit-button")
      .first()
      .simulate("click");
    expect(wrapper.find(OrderPopup).length).toBe(1);
  });
});
