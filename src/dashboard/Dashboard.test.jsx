import React from "react";
// import Adapter from "enzyme-adapter-react-16";
import configureMockStore from "redux-mock-store";
import { configure, mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import ConnectedDashboard, { Dashboard } from "./Dashboard";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

// import * as ACTIONS from "../redux/actions";

import initialState from "../redux/initialState";

// configure({ adapter: new Adapter() });

describe("<Dashboard/>", () => {
  const mockStore = configureMockStore();
  const store = mockStore(initialState);

  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ConnectedDashboard />)
        </MemoryRouter>
      </Provider>
    ).find(Dashboard);
  });
  describe("renders", () => {
    it("should render", () => {
      expect(wrapper.length).toBe(1);
    });
    it("renders AppBar component and Drawer component", () => {
      expect(wrapper.exists(AppBar)).toEqual(true);
      expect(wrapper.exists(Drawer)).toEqual(true);
    });
  });

  describe("when user clicks on the hamburger menu", () => {
    beforeEach(() => {
      wrapper
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

  describe("when user clicks on the close menu", () => {
    beforeEach(() => {
      wrapper
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

  describe("when user clicks on the start button", () => {
    beforeEach(() => {
      store.clearActions();
      wrapper
        .find(Toolbar)
        .first()
        .find(IconButton)
        .at(1)
        .simulate("click");
    });
    it("should dispatch startChannel action", () => {
      expect(store.getActions()).toEqual([{ type: "START_CHANNEL" }]);
    });
  });

  describe("when user clicks on the stop button", () => {
    beforeEach(() => {
      store.clearActions();
      wrapper
        .find(Toolbar)
        .first()
        .find(IconButton)
        .at(2)
        .simulate("click");
    });
    it("should dispatch stopChannel action", () => {
      expect(store.getActions()).toEqual([{ type: "STOP_CHANNEL" }]);
    });
  });

  describe("when user clicks on the reset button", () => {
    beforeEach(() => {
      store.clearActions();
      wrapper
        .find(Toolbar)
        .first()
        .find(IconButton)
        .at(3)
        .simulate("click");
    });
    it("should dispatch resetStore action", () => {
      expect(store.getActions()).toEqual([{ type: "RESET_STORE" }]);
    });
  });
});
