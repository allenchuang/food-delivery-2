import React from "react";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import Main from "./dashboard/Main";
import Map from "./dashboard/Map";
import OrderHistory from "./dashboard/OrderHistory";

export default () => (
  <Switch>
    {/* Add your app's routes here */}
    <Route exact path="/" component={Main} />

    <Route path="/*" component={NotFound} />
  </Switch>
);
