import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mount } from "enzyme";
import Map from "./Map";

import { Marker, Popup } from "react-map-gl";
import Pin from "../components/Pin";
import * as CONSTANTS from "../constants";

import mockState from "../redux/mockState";

describe("<Map/>", () => {
  const mockStore = configureMockStore();
  const store = mockStore(mockState);

  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <Map />
      </Provider>
    ).find(Map);
  });
  it("renders ", () => {
    expect(wrapper.length).toBe(1);
  });
});
