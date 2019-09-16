export const getDirections = (mapBox, geoJsonPath, id) => {
  var geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: geoJsonPath,
          type: 'LineString'
        }
      }
    ]
  }

  mapBox.addSource(`line-${id}`, {
    type: 'geojson',
    lineMetrics: true,
    data: geojson
  })
  // the layer must be of type 'line'
  mapBox.addLayer({
    type: 'line',
    source: `line-${id}`,
    id: `line-${id}`,
    paint: {
      'line-color': 'red',
      'line-width': 5,
      // 'line-gradient' must be specified using an expression
      // with the special 'line-progress' property
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        0,
        'blue',
        0.1,
        'royalblue',
        0.3,
        'cyan',
        0.5,
        'lime',
        0.7,
        'yellow',
        1,
        'red'
      ]
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    }
  })
}
