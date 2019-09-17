// //www.google.com/maps/place/1800+Marine+St,+Santa+Monica,+CA+90405/@34.0042001,-118.4568426,14.09z/data=!4m5!3m4!1s0x80c2bae0e843107b:0x4d898ae3b1fc2364!8m2!3d34.0094038!4d-118.4617154

// // https: // Display a map of order destinations: Use the ​Mapbox API​ to display orders on a map. Use the ​destination​ field to place a pin on the map to represent the order. At a minimum, the map should display the order status and name. To go even farther, when the order has been given to the driver display the route between the restaurant and where the driver is delivering the order to, again using the ​destination​ field. The restaurant address is ​1800 Marine Street, Santa Monica, CA 90405

// GEOCODER:
// https://api.mapbox.com/geocoding/v5/mapbox.places/801%20Toyopa%20Dr,%20Pacific%20Palisades,%20CA%2090272.json?access_token=pk.eyJ1IjoiYWxjaHVhbmciLCJhIjoiY2swZGdxbWt3MDcxbTNocjBxYWlzMTN4aSJ9.l1B53WCC2Te-jLtMpVfyJg

// {
//   "type": "FeatureCollection",
//   "query": [],
//   "features": [
//   {
//   "id": "address.1970630065630526",
//   "type": "Feature",
//   "place_type": [],
//   "relevance": 1,
//   "properties": {},
//   "text": "Toyopa Drive",
//   "place_name": "801 Toyopa Drive, Pacific Palisades, California 90272, United States",
//   "center": [
//   -118.52153,
//   34.04251
//   ],
//   "geometry": {
//   "type": "Point",
//   "coordinates": [
//   -118.52153,
//   34.04251
//   ]
//   },
//   "address": "801",
//   "context": []
//   },

// DIRECTIONS:
// https://api.mapbox.com/directions/v5/mapbox/cycling/-84.518641,39.134270;-84.512023,39.102779?geometries=geojson&access_token=pk.eyJ1IjoiYWxjaHVhbmciLCJhIjoiY2swZGdxbWt3MDcxbTNocjBxYWlzMTN4aSJ9.l1B53WCC2Te-jLtMpVfyJg

// {
//   "routes": [
//   {
//   "geometry": {
//   "coordinates": [
//   [
//   -84.518509,
//   39.134135
//   ],
//   [
//   -84.518432,
//   39.133835
//   ],
//   [
//   -84.519144,
//   39.13352
//   ],

// {
//   /* <Marker latitude={37.78} longitude={-122.41} offsetLeft={-20} offsetTop={-10}>
//   <div>You are here</div>
// </Marker> */
// }

import React from "react";
import ReactMapGL from "react-map-gl";

const accessToken =
  "pk.eyJ1IjoiYWxjaHVhbmciLCJhIjoiY2swZGdxbWt3MDcxbTNocjBxYWlzMTN4aSJ9.l1B53WCC2Te-jLtMpVfyJg";

class Map extends React.Component {
  state = {
    viewport: {
      lng: -118.1477,
      lat: 33.9644,
      zoom: 8.12,
      width: 400,
      height: 400
    }
  };

  render() {
    return <ReactMapGL {...this.state.viewport} />;
  }
}

export default Map;
