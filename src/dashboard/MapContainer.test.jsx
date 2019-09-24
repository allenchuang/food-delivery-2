import React from "react";
import { shallow } from "enzyme";

import MapContainer from "./MapContainer";
import Map from "./Map";

describe("<MapContainer />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<MapContainer />);
  });

  it("should render menu items", () => {
    expect(wrapper.length).toBe(1);
  });
  it("should render Map", () => {
    expect(wrapper.find(Map).exists()).toEqual(true);
  });
});
