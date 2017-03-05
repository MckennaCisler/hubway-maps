var stations = [];

// Waits for DOM to load before running
$(document).ready(() => {

    // Create table out of stations
    $.post("/stations",  responseJSON => {
        stations = responseJSON;
        console.log(responseJSON);
    });


    var width = 700,
        height = 580;

    var svg = d3.select("svg");

    var mapLayer = svg.append("g")
      .classed('map-layer', true);

    var albersProjection = d3.geoAlbers()
      .scale(500000)
      .rotate([71.1097, 0])
      .center([0, 42.3736])
      .translate([width/2, height/2]);

    var geoPath = d3.geoPath()
        .projection(albersProjection);

    // Load map data
    d3.json('cambridge.geo.json', function(error, mapData) {
      if (error) {
        console.log(error);
      } else {
        var features = mapData.features;
        console.log(features);
        console.log(mapLayer);

        // Draw each province as a path
        mapLayer.selectAll("path")
          .data(features)
          .enter().append("path")
          .attr("d", geoPath)
          .attr("fill", "#4d4d4d")
          .attr("class", "boundary");
      }
    });
});
