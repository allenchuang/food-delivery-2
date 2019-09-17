import React, { Component } from "react";
// import { render } from "react-dom";
import { connect } from "react-redux";
import MapGL, { Marker, Popup, SVGOverlay, CanvasOverlay } from "react-map-gl";

// import ControlPanel from "./control-panel";
import Pin from "../components/Pin";
import OrderInfo from "../components/OrderInfo";

import CITIES from "../cities.json";

import * as CONSTANTS from "../constants";

import { getDirections } from "../components/Directions";

const windowAlert = window.alert;

const TOKEN =
  "pk.eyJ1IjoiYWxjaHVhbmciLCJhIjoiY2swZGdxbWt3MDcxbTNocjBxYWlzMTN4aSJ9.l1B53WCC2Te-jLtMpVfyJg"; // Set your mapbox token here

function round(x, n) {
  const tenN = Math.pow(10, n);
  return Math.round(x * tenN) / tenN;
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 34.0544,
        longitude: -118.2439,
        zoom: 8.5,
        bearing: 0,
        pitch: 0
      },
      popupInfo: null
    };
  }

  componentDidMount() {
    // const map = this.reactMap.getMap();
    // const orderMap = this.props;
    // const directions =
    //   Object.entries(orderMap).length !== 0 && orderMap.constructor === Object
    //     ? Object.keys(orderMap).map(orderId => {
    //         return getDirections(map, orderMap[orderId].directions, orderId);
    //       })
    //     : "";
    // map.on("load", () => {
    //   return directions;
    // });
  }

  // _onStyleLoad = (map, event) => {
  //   console.log("map", map, "event: ", event, this.refs.map);
  //   console.log("ABC");
  //   map.addSource("16MAR13-FP-TOMNOD", {
  //     type: "vector",
  //     tiles: [
  //       "https://s3.amazonaws.com/tomnod-vector-tiles/16MAR13-FP-TOMNOD/{z}/{x}/{y}"
  //     ]
  //   });
  //   map.addLayer({
  //     id: "16MAR13-FP-TOMNOD",
  //     type: "line",
  //     source: "16MAR13-FP-TOMNOD",
  //     "source-layer": "16MAR13-FP-TOMNOD",
  //     layout: {
  //       visibility: "visible"
  //     },
  //     paint: {},
  //     interactive: true
  //   });
  // };

  _updateViewport = viewport => {
    this.setState({ viewport });
  };

  _renderOrderMarker = order => {
    return (
      <Marker
        key={`marker-${order.id}`}
        longitude={order.longitude}
        latitude={order.latitude}
      >
        {/* <Pin size={20} customStyle={{ fill: "#d00", stroke: "none" }} /> */}
        <Pin
          size={20}
          customStyle={{
            fill:
              order.event_name === CONSTANTS.DELIVERED
                ? "green"
                : order.event_name === CONSTANTS.COOKED
                ? "orange"
                : order.event_name === CONSTANTS.DRIVER_RECEIVED
                ? "blue"
                : "black"
          }}
          onClick={() => this.setState({ popupInfo: order })}
        />
      </Marker>
    );
  };

  _renderRoute = (points, index) => {
    return (
      <g style={{ pointerEvents: "click", cursor: "pointer" }}>
        <g
          style={{ pointerEvents: "visibleStroke" }}
          onClick={() => windowAlert(`route ${index}`)}
        >
          <path
            style={{
              fill: "none",
              stroke: "grey",
              strokeWidth: 6
            }}
            d={`M${points.join("L")}`}
          />
        </g>
      </g>
    );
  };

  _redrawSVGOverlay = ({ project }) => {
    const { orderMap, data } = this.props;
    // if (data && data[0] && data[0].event_name === CONSTANTS.DRIVER_RECEIVED) {
    return (
      <g>
        {Object.keys(orderMap)
          .filter(
            orderId =>
              orderMap[orderId].directions &&
              orderMap[orderId].event_name === CONSTANTS.DRIVER_RECEIVED
          )
          .map(orderId => {
            const points = orderMap[orderId].directions
              .map(project)
              .map(p => [round(p[0], 1), round(p[1], 1)]);
            return <g key={orderId}>{this._renderRoute(points, orderId)}</g>;
          })}
      </g>
    );
    // } else {
    //   return;
    // }
  };

  _redrawCanvasOverlay = ({ ctx, width, height, project }) => {
    const { orderMap } = this.props;
    ctx.clearRect(0, 0, width, height);
    Object.keys(orderMap)
      .filter(
        orderId =>
          orderMap[orderId].directions &&
          orderMap[orderId].event_name === CONSTANTS.DRIVER_RECEIVED
      )
      .map(orderId =>
        orderMap[orderId].directions.map(project).forEach((p, i) => {
          const point = [round(p[0], 1), round(p[1], 1)];
          ctx.fillStyle = "grey";
          ctx.beginPath();
          ctx.arc(point[0], point[1], 2, 0, Math.PI * 2);
          ctx.fill();
        })
      );
  };
  _renderPopup() {
    const { popupInfo } = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <OrderInfo info={popupInfo} />
        </Popup>
      )
    );
  }

  render() {
    const { viewport } = this.state;
    const { orderMap, data } = this.props;

    // let dataMap = data
    //   .filter(
    //     order =>
    //       order.event_name === CONSTANTS.CREATED &&
    //       order.latitude &&
    //       order.longitude
    //   )
    //   .map(this._renderOrderMarker);

    const orderAdd =
      Object.entries(orderMap).length !== 0 && orderMap.constructor === Object
        ? Object.keys(orderMap)
            .filter(
              orderId =>
                orderMap[orderId].latitude && orderMap[orderId].longitude
            )
            .map(orderId => {
              return this._renderOrderMarker(orderMap[orderId], orderId);
              // }
            })
        : "";
    return (
      <React.Fragment>
        <MapGL
          {...viewport}
          ref={reactMap => (this.reactMap = reactMap)}
          width="100%"
          height="480px"
          mapStyle="mapbox://styles/mapbox/light-v9"
          onViewportChange={this._updateViewport}
          mapboxApiAccessToken={TOKEN}
          onStyleLoad={this._onStyleLoad}
        >
          <SVGOverlay redraw={this._redrawSVGOverlay} />,
          <CanvasOverlay redraw={this._redrawCanvasOverlay} />
          <Marker key={`kitchen`} longitude={-118.461708} latitude={34.009408}>
            <Pin
              size={20}
              customStyle={{
                fill: "MAGENTA",
                stroke: "none",
                strokeWidth: "2"
              }}
            />
          </Marker>
          {orderAdd}
          {this._renderPopup()}
        </MapGL>
        {/* {dataMap} */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  orderMap: state.orderMap,
  data: state.data
});

export default connect(
  mapStateToProps,
  null
)(App);
