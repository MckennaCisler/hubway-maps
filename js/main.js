var stations = [];

// Waits for DOM to load before running
$(document).ready(() => {
    var HOVER_TRANS_MS = 150;

    var width = 1700,
        height = 800;
    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    var mapLayer = svg.append("g")
      .classed('map-layer', true);

    var albersProjection = d3.geoAlbers()
      .scale(700000)
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
          .attr("fill", "#d3d3d3")
          .attr("stroke", "#555")
          .attr("class", "boundary")
          .on("mouseover", function() {
                d3.select(this)
                .attr("fill", "#3978e5")
                .attr("stroke", "#3978e5");
            })
          .on("mouseout", function() {
                d3.select(this)
                .attr("fill", "#d3d3d3")
                .attr("stroke", "#555");
            });
          
        // nest because the first elements put onto an SVG show up on top
        d3.json("data/hubway_stations.geo.json", function(error, statData) {
            // Draw the hudway data on the map
            if (error) {
                console.log(error);
            } else {
                var features = statData.features;
                console.log(features);
          
                mapLayer.selectAll("circle")
                    .data(features)
                    .enter().append("circle")
                    .attr("cx", function (d) {
                        console.log(d);
                        return albersProjection([parseFloat(d.properties.lng), parseFloat(d.properties.lat)])[0];
                    })
                    .attr("cy", function (d) {
                        return albersProjection([parseFloat(d.properties.lng), parseFloat(d.properties.lat)])[1];
                    })
                    .attr("fill", "#78e539")
                    .style("z-index", 1000)
                    .attr("r", 5)
                    .on("mouseover", function() {
                          d3.select(this)
                          .transition()
                            .duration(HOVER_TRANS_MS)
                            .attr("r",10);
                      })
                    .on("mouseout", function() {
                          d3.select(this)
                          .transition()
                            .duration(HOVER_TRANS_MS)
                            .attr("r", 5);
                    });
                }
            });
        }
    });
    
    $.post("/stations",  responseJSON => {
        stations = responseJSON;
        console.log(responseJSON);
        
        
            

        // Create table out of stations
        d3.select("#station-table > tbody")
            .selectAll("tr")
            .data(responseJSON)
            .enter().append("tr")
              .html(function(data) {
                var innerHTML = "";
                    for (let stationProp in data) {
                        if (data.hasOwnProperty(stationProp)) {
                            innerHTML += "<td>" + data[stationProp] +"</td>";
                        }
                    }
                    return innerHTML;
                });
    });
});
