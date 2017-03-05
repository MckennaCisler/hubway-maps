// Waits for DOM to load before running
$(document).ready(() => {
    var HOVER_TRANS_MS = 150;

    var div = d3.select("body").append("div")
        .attr("class", "tooltip");
    div.classed("hidden", true);

    var width = 1700,
        height = 800;

    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    var albersProjection = d3.geoAlbers()
      .scale(700000)
      .rotate([71.1097, 0])
      .center([0, 42.3736])
      .translate([width/2, height/2]);

    var geoPath = d3.geoPath()
        .projection(albersProjection);

    var color = d3.scaleLinear()
      .domain([0, 0.3])
      .clamp(true)
      .range(['#f2f2f2', '#cc0000']);

    function fillFn(d){
      return color(d.properties.poverty_rate);
    }

    document.onmousemove = function(e) {
      div.attr("style", "left:" + (e.pageX + 25) + "px;top:" + e.pageY + "px");
    };

    // Load map data
    d3.json('data/complete_data.json', function(error, mapData) {
      if (error) {
        console.log(error);
      } else {
        var features = mapData.features;
        console.log(features);

        // Draw each province as a path
        svg.selectAll("path")
          .data(features)
          .enter().append("path")
          .attr("d", geoPath)
          .style("fill", fillFn)
          .style("stroke", '#000000')
          .attr("class", "boundary")
          .on("mouseover", function(d) {
              d3.select(this).transition()
              .duration(HOVER_TRANS_MS)
              .style("opacity", "1");
              div.classed("hidden", false);
              div.style("opacity", "1");
              div.html(getTractTooltip(d));
            })
          .on("mouseout", function(d) {
              d3.select(this).transition()
              .style("opacity", "0.75")
              .duration(HOVER_TRANS_MS);
              div.classed("hidden", true);
           });
      }

      // nest because the first elements put onto an SVG show up on top
      d3.json("data/hubway_stations.geo.json", function(error, statData) {
          // Draw the hudway data on the map
          if (error) {
              console.log(error);
          } else {
              var features = statData.features;
              console.log(features);

              svg.selectAll("circle")
                  .data(features)
                  .enter().append("circle")
                  .attr("cx", function (d) {
                      console.log(d);
                      return albersProjection([parseFloat(d.properties.lng), parseFloat(d.properties.lat)])[0];
                  })
                  .attr("cy", function (d) {
                      return albersProjection([parseFloat(d.properties.lng), parseFloat(d.properties.lat)])[1];
                  })
                  .attr("fill", "#191919")
                  .style("z-index", 1000)
                  .attr("r", 5)
                  .on("mouseover", function(d) {
                        d3.select(this)
                        .transition()
                          .duration(HOVER_TRANS_MS)
                          .attr("r",10);

                        div.classed("hidden", false);
                        div.style("opacity", 1);
                        div.html(getStationTooltip(d));
                    })
                  .on("mouseout", function() {
                        d3.select(this)
                        .transition()
                          .duration(HOVER_TRANS_MS)
                          .attr("r", 5);

                        div.classed("hidden", true);
                  });
              }
          });
  });
});

function getTractTooltip(d) {
    return "Population: <b>" + d.properties.population + "</b><br>" +
            "Poverty rate: <b>" + Math.round(d.properties.poverty_rate * 1000) / 10 + "%</b><br>" +
            "# of hubway stations: <b>" + d.properties.stations;
}

function getStationTooltip(d) {
    return d.properties.station + "</br>" +
            d.properties.municipal + "</br>" +
            d.properties.status;
}
