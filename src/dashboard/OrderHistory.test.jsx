import React from "react";
import { shallow } from "enzyme";

import OrderHistory from "./OrderHistory";
import OrderTable from "./OrderTable";
import Chart from "./Chart";

describe("<OrderHistory />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<OrderHistory />);
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
  it("should render Chart", () => {
    expect(
      wrapper
        .dive()
        .find(Chart)
        .exists()
    ).toEqual(true);
  });
});
