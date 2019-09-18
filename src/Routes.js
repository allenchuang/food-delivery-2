import {
  Home,
  Dashboard,
  DriveEta,
  ShoppingCart,
  History
} from "@material-ui/icons";
import Main from "./dashboard/Main";
import MapContainer from "./dashboard/MapContainer";
import OrderHistory from "./dashboard/OrderHistory";

const Routes = [
  {
    path: "/",
    sidebarName: "Main",
    navbarName: "Main",
    icon: Dashboard,
    component: Main
  },
  {
    path: "/history",
    sidebarName: "Order History",
    navbarName: "Order History",
    icon: History,
    component: OrderHistory
  },
  {
    path: "/map",
    sidebarName: "Map",
    navbarName: "Map",
    icon: DriveEta,
    component: MapContainer
  }
];

export default Routes;
