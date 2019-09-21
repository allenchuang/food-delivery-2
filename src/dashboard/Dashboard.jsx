import React from "react";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import DeleteIcon from "@material-ui/icons/Delete";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Tooltip from "@material-ui/core/Tooltip";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import MainListItems from "./NavList";
import Chart from "./Chart";
import ServerStatus from "./ServerStatus";
import OrderTable from "./OrderTable";
import { Hidden } from "@material-ui/core";

import { compose } from "redux";
import { connect } from "react-redux";
import * as ACTIONS from "../redux/actions";
import { withStyles } from "@material-ui/core/styles";

import Map from "./Map";

import logo from "../logo-cloudkitchens.png";

import Router from "../Router";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {". Built with "}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI.
      </Link>
    </Typography>
  );
}

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  }
});

class Dashboard extends React.Component {
  state = {
    open: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  componentWillUnmount() {
    this.props.stopChannel();
  }

  render() {
    const {
      classes,
      channelOnline,
      serverOnline,
      sec,
      startChannel,
      stopChannel,
      resetStore
    } = this.props;
    const { open } = this.state;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const drawerContent = (
      <React.Fragment>
        <div className={classes.toolbarIcon}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <MainListItems handleClose={this.handleDrawerClose} />
      </React.Fragment>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.title}>
              <img src={logo} alt="Cloud Kitchens Dashboard" height={55} />
            </div>
            {/* <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Cloud Kitchen Dashboard
            </Typography> */}
            <Tooltip title="Initiate Socket">
              <IconButton
                onClick={startChannel}
                color="inherit"
                aria-label="start socket channel"
              >
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Terminate Socket">
              <IconButton
                onClick={stopChannel}
                color="inherit"
                aria-label="stop socket channel"
              >
                <StopIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Redux Store">
              <IconButton
                onClick={resetStore}
                color="inherit"
                aria-label="reset Redux Store"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Hidden xsUp implementation="css">
          <Drawer
            onClose={this.handleDrawerClose}
            classes={{
              paper: clsx(
                classes.drawerPaper,
                !open && classes.drawerPaperClose
              )
            }}
            open={open}
          >
            {drawerContent}
          </Drawer>
        </Hidden>
        <Hidden xsDown>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(
                classes.drawerPaper,
                !open && classes.drawerPaperClose
              )
            }}
            open={open}
          >
            {drawerContent}
          </Drawer>
        </Hidden>

        <main className={classes.content}>
          <div className={classes.appBarSpacer} />

          <Router />
          {/* <Grid container spacing={3}> */}
          {/* Chart */}
          {/* <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                  <Chart />
                </Paper>
              </Grid> */}
          {/* Server Status */}
          {/* <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <ServerStatus
                    channelOnline={channelOnline}
                    sec={sec}
                    serverOnline={serverOnline}
                  />
                </Paper>
              </Grid> */}
          {/* Map */}
          {/* <Grid item xs={12}>
                <Map />
              </Grid> */}
          {/* Recent Orders */}
          {/* <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Orders title="Active Orders" />
                </Paper>
              </Grid> */}
          {/* </Grid> */}
          {/* </Container> */}
          <Copyright />
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = {
  startChannel: ACTIONS.startChannel,
  stopChannel: ACTIONS.stopChannel,
  resetStore: ACTIONS.resetStore
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Dashboard);
