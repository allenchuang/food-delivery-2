import React from "react";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";

import NavList from "./NavList";
import ListItem from "@material-ui/core/ListItem";
import * as CONSTANTS from "../constants";

import mockState from "../redux/mockState";

describe("<NavList />", () => {
  let wrapper, props;
  beforeEach(() => {
    props = {
      handleClose: jest.fn()
    };
    wrapper = mount(
      <MemoryRouter initialEntries={["/map"]}>
        <NavList {...props} />
      </MemoryRouter>
    ).find(NavList);
  });

  it("should render menu items", () => {
    expect(wrapper.find(ListItem).length).toBe(3);
  });

  it("should close menu on click of item", () => {
    wrapper
      .find(ListItem)
      .at(2)
      .simulate("click");
    expect(props.handleClose).toHaveBeenCalled();
  });

  it("should highlist the ListItem when path matches", () => {
    expect(
      wrapper
        .find(ListItem)
        .at(2)
        .props().selected
    ).toBe(true);
  });

  it("should NOT highlist the ListItem when path DOES NOT match", () => {
    expect(
      wrapper
        .find(ListItem)
        .at(1)
        .props().selected
    ).toBe(false);
  });
});
