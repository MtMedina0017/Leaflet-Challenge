// Creating URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

// Request to the query URL and creating features and functions
d3.json(queryUrl, function(data) {

    earthquakeFeatures(data.features);
    console.log(data.features);
});

// Getting data from query
function earthquakeFeatures(earthquakeData){

  // Defining function and giving feature a popup
  function onEachFeaturePrep(feature, layer) {
    layer.bindPopup("Magnitude: " + "<br>Location: " + feature.properties.mag + feature.properties.place);
  }
// Run the onEAchFeature and call geoJSON function
  var earthquakes = L.geoJSON(earthquakeData, {
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
  Earthquakes: earthquales
};

var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [streetmap, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false

}).addTo(myMap);

}


