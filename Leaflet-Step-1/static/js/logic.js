var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
 createFeatures(data.features);
});


function createMap(earthquakes) {

   // Define map and layers
   var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
     tileSize: 512,
     maxZoom: 15,
     zoomOffset: -1,
     id: "mapbox/streets-v11",
     accessToken: API_KEY
   });
 
   var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
     maxZoom: 15,
     id: "dark-v10",
     accessToken: API_KEY
   });
 
   // Create a basemaps to hold base layers 
   var baseMaps = {
     "Street Map": streetmap,
     "Dark Map": darkmap
   };
 
   // create overlay to hold the layers
   var overlayMaps = {
     Earthquakes: earthquakes
   };
 
   // create map to display
   var myMap = L.map("map", {
     center: [
       37.09, -95.71
     ],
     zoom: 3,
     layers: [streetmap, earthquakes]
   });
 
   // make a layer control then pass in the baseMap and Overlaymap
   
   L.control.layers(baseMaps, overlayMaps, {
     collapsed: false
   }).addTo(myMap);
           // color legend 
function getColor(d) {
 return d > 90 ? '#ff4d4d' :
        d > 70  ? '#e67300' :
        d > 50  ? '#ffa64d' :
        d > 30  ? '#ffcc66' :
        d > 10  ? '#ffff66"' :
                   '#c4ff4d';
     
}
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

   var div = L.DomUtil.create('div', 'info legend'),
       grades = [-10, 10, 30, 50, 70, 90],
       labels = [];

   // loop through density generate legend labels 
   for (var i = 0; i < grades.length; i++) {
       div.innerHTML +=
           '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
           grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
   }

   return div;
};
// add legend
legend.addTo(myMap);
}
//create earthquake data
function createFeatures(earthquakeData) {

   function colorSel(depth){
     if (depth <10) {
     return "#c4ff4d";
     }
     else if (depth<30) {
     return  "#ffff66";
     }
     else if (depth < 50) {
     return  "#ffcc66";
     }
     else if (depth < 70) {
     return "#ffa64d";
     }
     else if (depth < 90) {
     return  "#e67300";
     }
     else {
     return  "#ff4d4d";
     }
   }

  // create marker size  
 function markerSize(magnitude) {
         return magnitude *6;
 }
 
 function quakeMarker(feature) {
   return{
   stroke: false,
   fillOpacity: 0.75,
   fillColor: colorSel(feature.geometry.coordinates[2]),
   radius: markerSize(feature.properties.mag)
   };
 }
var earthquakes = L.geoJSON(earthquakeData, {
     pointToLayer: function (feature, latlng) {
       return L.circleMarker(latlng);
       },
 style: quakeMarker,
 onEachFeature: function(feature, layer) {
   layer.bindPopup(
     "Magnitude: "
       + feature.properties.mag
       + "<br>Depth: "
       + feature.geometry.coordinates[2]
       + "<br>Location: "
       + feature.properties.place
   );
 }
});
//close out and createmap function
createMap(earthquakes);

};
