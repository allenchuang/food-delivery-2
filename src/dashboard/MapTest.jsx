import React, { Component } from "react";
import { render } from "react-dom";
import MapGL, { Marker, Popup } from "react-map-gl";

// import ControlPanel from "./control-panel";
import Pin from "../components/Pin";
import OrderInfo from "../components/OrderInfo";

import CITIES from "../cities.json";

const TOKEN =
  "pk.eyJ1IjoiYWxjaHVhbmciLCJhIjoiY2swZGdxbWt3MDcxbTNocjBxYWlzMTN4aSJ9.l1B53WCC2Te-jLtMpVfyJg"; // Set your mapbox token here

export default class App extends Component {
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

  componentDidMount() {}

  _updateViewport = viewport => {
    this.setState({ viewport });
  };

  _renderCityMarker = (city, index) => {
    return (
      <Marker
        key={`marker-${index}`}
        longitude={city.longitude}
        latitude={city.latitude}
      >
        <Pin size={20} onClick={() => this.setState({ popupInfo: city })} />
      </Marker>
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

    return (
      <MapGL
        {...viewport}
        width="100%"
        height="480px"
        mapStyle="mapbox://styles/mapbox/light-v9"
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={TOKEN}
      >
        {CITIES.map(this._renderCityMarker)}

        {this._renderPopup()}
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}
