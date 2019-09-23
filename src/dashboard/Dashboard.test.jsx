import React from "react";
import { configure, shallow, mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/store";
import Adapter from "enzyme-adapter-react-16";
import ConnectedDashboard, { Dashboard } from "./Dashboard";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

configure({ adapter: new Adapter() });

describe("<Dashboard/>", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedDashboard />)
        </MemoryRouter>
      </Provider>
    );
  });
  describe("renders", () => {
    it("should render", () => {
      // console.log("WRAPPER", wrapper);
      expect(wrapper.length).toBe(1);
    });
  });

  describe("when user clicks on the hamburger menu", () => {
    beforeEach(() => {
      wrapper
        .find(Dashboard)
        .find(Toolbar)
        .first()
        .find(IconButton)
        .first()
        .simulate("click");
    });
    it("should set state open to true", () => {
      expect(wrapper.find(Dashboard).instance().state.open).toEqual(true);
    });
  });

  describe("when user clicks on the close button", () => {
    beforeEach(() => {
      wrapper
        .find(Dashboard)
        .find(Toolbar)
        .first()
        .find(IconButton)
        .first()
        .simulate("click");
    });
    it("should set state open to true", () => {
      expect(wrapper.find(Dashboard).instance().state.open).toEqual(true);
    });
  });
});
