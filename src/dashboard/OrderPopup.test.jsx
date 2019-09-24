import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mount } from "enzyme";

import OrderPopup from "./OrderPopup";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import * as CONSTANTS from "../constants";

import mockState from "../redux/mockState";

describe("<OrderPopup />", () => {
  const mockStore = configureMockStore();
  const store = mockStore(mockState);

  let wrapper, props;
  beforeEach(() => {
    store.clearActions();
    props = {
      open: true,
      editOrder: {
        destination: "222 S Main St Apt 1701, Los Angeles, CA 90012",
        event_name: "DRIVER_RECEIVED",
        id: "2d181b1a",
        name: "Veggie pizza",
        sent_at_second: 20,
        uid: "db803100-de67-11e9-b74d-51e03e6b6aaf"
      },
      setModalState: jest.fn(),
      setEditOrder: jest.fn()
    };

    wrapper = mount(
      <Provider store={store}>
        <OrderPopup {...props} />
      </Provider>
    );
  });

  it("renders", () => {
    expect(wrapper.length).toBe(1);
  });

  it("should update order event_type on Select change", () => {
    wrapper
      .find(Select)
      .at(0)
      .props()
      .onChange({ target: { value: CONSTANTS.CANCELLED } });
    expect(props.setEditOrder).toHaveBeenCalled();
  });

  it("should update order event_type on submit", () => {
    wrapper = mount(
      <Provider store={store}>
        <OrderPopup
          {...props}
          editOrder={{ ...props.editOrder, event_name: CONSTANTS.CANCELLED }}
        />
      </Provider>
    );

    wrapper
      .find(Button)
      .at(0)
      .simulate("click");
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_ORDER",
        order: {
          destination: "222 S Main St Apt 1701, Los Angeles, CA 90012",
          event_name: "CANCELLED",
          id: "2d181b1a",
          name: "Veggie pizza",
          sent_at_second: 20,
          uid: "db803100-de67-11e9-b74d-51e03e6b6aaf"
        }
      }
    ]);
  });
});
