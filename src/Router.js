import React from "react";
import { Route, Switch } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
const Main = React.lazy(() => import("./dashboard/Main"));
const MapContainer = React.lazy(() => import("./dashboard/MapContainer"));
const OrderHistory = React.lazy(() => import("./dashboard/OrderHistory"));

export default () => (
  <Switch>
    {/* Add your app's routes here */}
    <React.Suspense fallback={<CircularProgress />}>
      <Route exact path="/" component={Main} />
      <Route exact path="/map" component={MapContainer} />
      <Route exact path="/history" component={OrderHistory} />
    </React.Suspense>

    {/* <Route path="/*" component={NotFound} /> */}
  </Switch>
);
