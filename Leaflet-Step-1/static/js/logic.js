const API_KEY = "pk.eyJ1IjoibXRtZWRpbmEwMDE3IiwiYSI6ImNra3JrYzE5MjBkYTkycWxqdms4aTlmNTYifQ.LMyBlTCSu9zxE_pSUeCcDw";

// Creating URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Request to the query URL and creating features and functions
d3.json(queryUrl, function(data) {

    earthquakeFeatures(data.features);
    console.log(data.features);
});

// Getting data from query
function earthquakeFeatures(earthquakeData){

  // Defining function and giving feature a popup
  function onEachFeaturePrep(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " +  feature.properties.place);
  }
// Run the onEAchFeature and call geoJSON function
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circle(latlng,
        {radius: (feature.properties.mag) * 35000,

        fillColor: getColor(feature.geometry.coordinates[2]),

        color: "black",

        stroke: true,

        weight: 0.6

        });
    },
    onEachFeature: onEachFeaturePrep
  });

// Sending earthquakes layer to createMap function
  createMap(earthquakes);
}

function createMap(earthquakes){
 
  // Defining layers
var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// Defining maps
var baseMaps = {
  "Gray Map": graymap,
  "Satellite Map": satellitemap,
  "Outdoors": outdoors
};

// Creating overlay
var overlayMaps = {
  Earthquakes: earthquakes
};

var myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [outdoors, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false

}).addTo(myMap);

// an object legend
var legend = L.control({
  position: "bottomleft"
});

// details for the legend
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");

  var depth = [-10, 10, 30, 50, 70, 90];
  var colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

// loop through our density intervals and generate a label with a colored square for each interval - https://leafletjs.com/examples/choropleth/
for (var i = 0; i < depth.length; i++) {
  div.innerHTML +=
      '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
      depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);

}

// set different color from depth
function getColor(depth) {
  switch (true) {
  case depth > 90:
    return "#ea2c2c";
  case depth > 70:
    return "#ea822c";
  case depth > 50:
    return "#ee9c00";
  case depth > 30:
    return "#eecc00";
  case depth > 10:
    return "#d4ee00";
  default:
    return "#98ee00";
  }
}
// set radiuss from magnitude
  function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }

  return magnitude * 4;
}
