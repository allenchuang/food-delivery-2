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
            onClick={props.handleClose}
          >
            <ListItemIcon>
              <route.icon />
            </ListItemIcon>
            <ListItemText primary={route.sidebarName} />
          </ListItem>
        );
      })}
    </List>
  );
}

export default withRouter(NavList);
