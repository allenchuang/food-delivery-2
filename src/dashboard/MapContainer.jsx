import React from "react";
import Map from "./Map";

const MapContainer = React.memo(() => {
  return (
    <React.Fragment>
      <Map height={"100vh"} />
    </React.Fragment>
  );
});

export default MapContainer;
