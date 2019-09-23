import React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "./dashboard/Main";
import MapContainer from "./dashboard/MapContainer";
import OrderHistory from "./dashboard/OrderHistory";

export default () => (
  <Switch>
    {/* Add your app's routes here */}
    <Route exact path="/" component={Main} />
    <Route exact path="/map" component={MapContainer} />
    <Route exact path="/history" component={OrderHistory} />

    {/* <Route path="/*" component={NotFound} /> */}
  </Switch>
);
