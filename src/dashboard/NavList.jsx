import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withRouter } from "react-router";

import { Link } from "react-router-dom";

import Routes from "../Routes";

function NavList(props) {
  const activeRoute = routeName => {
    return props.location.pathname === routeName ? true : false;
  };

  return (
    <List>
      {Routes.map((route, key) => {
        return (
          <ListItem
            key={key}
            component={Link}
            to={route.path}
            selected={activeRoute(route.path)}
            button
          >
            <ListItemIcon>
              <route.icon />
            </ListItemIcon>
            <ListItemText primary={route.sidebarName} />
          </ListItem>
        );
      })}
      {/* <ListItem component={Link} to="/" button selected>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem component={Link} to="/history" button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Order History" />
      </ListItem>
      <ListItem component={Link} to="/map" button>
        <ListItemIcon>
          <DriveEtaIcon />
        </ListItemIcon>
        <ListItemText primary="Delivery Map" />
      </ListItem> */}
    </List>
  );
}

export default withRouter(NavList);
