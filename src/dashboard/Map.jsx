import React, { Component } from "react";
import { connect } from "react-redux";
import MapGL, { Marker, Popup, SVGOverlay, CanvasOverlay } from "react-map-gl";

// import ControlPanel from "./control-panel";
import Pin from "../components/Pin";
import OrderInfo from "../components/OrderInfo";

import * as CONSTANTS from "../constants";

import MARKER_STYLE from "../styles/marker-style";
// import "../styles/mapbox-overrides.css";

function round(x, n) {
  const tenN = Math.pow(10, n);
  return Math.round(x * tenN) / tenN;
}
class Map extends Component {
  static defaultProps = {
    width: "100%",
    height: "480px",
    mapStyle: "mapbox://styles/mapbox/light-v9"
  };

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 34.0544,
        longitude: -118.2439,
        zoom: 8.5,
        bearing: 0,
        pitch: 85
      },
      popupInfo: null
    };
  }

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
        <Pin
          className="station"
          size={30}
          customStyle={{
            fill:
              order.event_name === CONSTANTS.DELIVERED
                ? "#81ff00"
                : order.event_name === CONSTANTS.COOKED
                ? "#ff803e"
                : order.event_name === CONSTANTS.DRIVER_RECEIVED
                ? "#78ecb8"
                : order.event_name === CONSTANTS.CANCELLED
                ? "red"
                : "#eadd04"
          }}
          onClick={() => this.setState({ popupInfo: order })}
        />
        {/* <span style={{ fontWeight: "bold" }}>{order.name}</span> */}
        {/* <div className="station">
          <span>{order.name}</span>
        </div> */}
      </Marker>
    );
  };

  _renderRoute = (points, index) => {
    return (
      <g style={{ pointerEvents: "click", cursor: "pointer" }}>
        <g style={{ pointerEvents: "visibleStroke" }}>
          <path
            style={{
              fill: "none",
              stroke: "grey",
              strokeWidth: 4
            }}
            d={`M${points.join("L")}`}
          />
        </g>
      </g>
    );
  };

  _redrawSVGOverlay = ({ project }) => {
    const { orderMap } = this.props;
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
          tipSize={20}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={true}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <OrderInfo order={popupInfo} />
        </Popup>
      )
    );
  }

  render() {
    const { viewport } = this.state;
    const { orderMap, height, width, mapStyle } = this.props;
    const MapGLProps = { height, width, mapStyle };
    const [
      kitchenLongitude,
      kitchenLatitude
    ] = CONSTANTS.MAPBOX_KITCHEN_COORDINATES;

    const orderAdd =
      Object.entries(orderMap).length !== 0 &&
      orderMap.constructor === Object &&
      Object.keys(orderMap)
        .filter(
          orderId => orderMap[orderId].latitude && orderMap[orderId].longitude
        )
        .map(orderId => {
          return this._renderOrderMarker(orderMap[orderId], orderId);
          // }
        });
    return (
      <React.Fragment>
        <MapGL
          {...viewport}
          ref={reactMap => (this.reactMap = reactMap)}
          onViewportChange={this._updateViewport}
          mapboxApiAccessToken={CONSTANTS.MAPBOX_TOKEN}
          onStyleLoad={this._onStyleLoad}
          {...MapGLProps}
        >
          <style>{MARKER_STYLE}</style>
          <SVGOverlay redraw={this._redrawSVGOverlay} />,
          <CanvasOverlay redraw={this._redrawCanvasOverlay} />
          <Marker
            key={`kitchen`}
            longitude={kitchenLongitude}
            latitude={kitchenLatitude}
          >
            <Pin
              size={40}
              customStyle={{
                fill: "blue",
                stroke: "none",
                strokeWidth: "2"
              }}
            />
          </Marker>
          {orderAdd}
          {this._renderPopup()}
        </MapGL>
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
)(Map);
