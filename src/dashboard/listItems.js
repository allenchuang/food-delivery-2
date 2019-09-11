import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import HomeIcon from "@material-ui/icons/Home";

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Order History" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DriveEtaIcon />
      </ListItemIcon>
      <ListItemText primary="Delivery Map" />
    </ListItem>
  </div>
);
