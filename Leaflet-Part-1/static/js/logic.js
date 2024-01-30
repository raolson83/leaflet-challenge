// Part 1: Create the Earthquake Visualization
// Your first task is to visualize an earthquake dataset. Complete the following steps:

// 1)Get your dataset. To do so, follow these steps:
// The USGS provides earthquake data in a number of different formats, updated every 5 minutes. Visit the USGS GeoJSON FeedLinks to an external site. page and choose a dataset to visualize. The following image is an example screenshot of what appears when you visit this link:
// When you click a dataset (such as "All Earthquakes from the Past 7 Days"), you will be given a JSON representation of that data. Use the URL of this JSON to pull in the data for the visualization. The following image is a sampling of earthquake data in JSON format:

// 2)Import and visualize the data by doing the following:
// Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
// Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, 
//and earthquakes with greater depth should appear darker in color.
// Hint: The depth of the earth can be found as the third coordinate for each earthquake.

// Include popups that provide additional information about the earthquake when its associated marker is clicked.
// Create a legend that will provide context for your map data.
// Your visualization should look something like the preceding map.


function createMap(earthQuakes) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
      "Earth Quakes": earthQuakes
    };
  
    // Create the map object with options.
    let map = L.map("map", {
      center: [78.72, 41.22],
      zoom: 2,
      layers: [streetmap, earthQuakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  

// Function to determine marker size 
function markerSize(mag) {
  return mag * 100000;
}

// Function to create the map 
function createMap(earthQuakes) {
  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
      "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the earthquake layer.
  let overlayMaps = {
      "Earthquakes": earthQuakes
  };

  // Create the map object with options.
  let map = L.map("map", {
      center: [0, 0], // Set your desired initial center coordinates
      zoom: 2,
      layers: [streetmap, earthQuakes]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(map);

  // Call the createLegend function after creating the map
  createLegend(map);
}

// Function to create the legend 
function createLegend(map) {
  let legend = L.control({ position: 'topright' });

  legend.onAdd = function () {
      let div = L.DomUtil.create('div', 'info legend');
      let grades = [0, 25, 50, 100];
      let colors = ['yellow', 'pink', 'violet', 'blue']; // Adjust colors accordingly

      // Loop through depth thresholds and generate a label with a colored square for each
      for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colors[i] + '"></i> ' +
              (grades[i + 1] ? grades[i] + '&ndash;' + grades[i + 1] + '<br>' : grades[i] + '+');
      }

      return div;
  };

  legend.addTo(map);
}


// Function to create earthquake markers 
function createMarkers(response) {
  let quakes = response.features;

  // Initialize an array to hold markers.
  let quakeMarkers = [];

  // Loop through the quake array.
  for (let index = 0; index < quakes.length; index++) {
      let quake = quakes[index];

      // Determine color based depth
      let color = "";
      if (quake.geometry.coordinates[2] > 100) {
          color = "blue";
      } else if (quake.geometry.coordinates[2] > 50) {
          color = "violet";
      } else if (quake.geometry.coordinates[2] > 25) {
          color = "pink";
      } else {
          color = "white";
      }

      // Create a marker with size relative to mag, and bind a popup with the quake name, mag, and depth.
      let quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
          fillOpacity: 0.75,
          color: "white",
          fillColor: color,
          radius: markerSize(quake.properties.mag)
      }).bindPopup("<h3>" + quake.properties.place + "<h3><h3>Mag: " + quake.properties.mag + "<h3><h3>Depth: " + quake.geometry.coordinates[2] + "</h3>");

      // Add the marker to the quakeMarkers array.
      quakeMarkers.push(quakeMarker);
  }

  // Create a layer group that's made from the quake markers array, and pass it to the createMap function.
  createMap(L.layerGroup(quakeMarkers));
}

// Perform an API call to get earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(createMarkers);



  