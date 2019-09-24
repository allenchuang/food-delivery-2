import React from "react";
import { shallow } from "enzyme";

import Main from "./Main";
import OrderTable from "./OrderTable";
import Map from "./Map";

describe("<Main />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Main />);
  });

  it("should render menu items", () => {
    expect(wrapper.length).toBe(1);
  });
  it("should render order tables", () => {
    expect(
      wrapper
        .dive()
        .find(OrderTable)
        .exists()
    ).toEqual(true);
  });
  it("should render Map", () => {
    expect(
      wrapper
        .dive()
        .find(Map)
        .exists()
    ).toEqual(true);
  });
});
