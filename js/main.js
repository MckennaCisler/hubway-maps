// Waits for DOM to load before running
$(document).ready(() => {
    var HOVER_TRANS_MS = 250;

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

    document.onmousemove = function(e) {
      div.attr("style", "left:" + (e.pageX + 25) + "px;top:" + e.pageY + "px");
    };
    
    // graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
      
    var max_poverty_rate = 26.5;
    var max_stations_per = 4;
    
    // add the graph canvas to the body of the webpage
    var svgGraph = d3.select("#bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          
    // setup x 
    var xValue = function(d) { return d.properties.stations * 100;}, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.axisBottom().scale(xScale);
    
    // setup y
    var yValue = function(d) { return d.properties.poverty_rate * 10000;}, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.axisLeft().scale(yScale);
        
    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([0, 4]);
    yScale.domain([0, max_poverty_rate]);
        
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
          .attr("fill", "#d3d3d3")
          .attr("stroke", "#555")
          .attr("class", "boundary")
          .on("mouseover", function(d) {
              d3.select(this).transition()
              .duration(HOVER_TRANS_MS)
              .attr("fill", "#3978e5").attr("stroke", "#3978e5");
              
              div.classed("hidden", false);
              div.style("opacity", 1);
              div.html(getTractTooltip(d));
            })
          .on("mouseout", function(d) {
              d3.select(this).transition()
              .duration(HOVER_TRANS_MS)
              .attr("fill", "#d3d3d3").attr("stroke", "#555");
              
              div.classed("hidden", true);
           });

        // x-axis
        svgGraph.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
         .append("text")
           .attr("class", "label")
           .attr("x", width)
           .attr("y", -6)
           .style("text-anchor", "end")
           .text("Calories");
        
        // y-axis
        svgGraph.append("g")
           .attr("class", "y axis")
           .call(yAxis)
         .append("text")
           .attr("class", "label")
           .attr("transform", "rotate(-90)")
             .attr("y", 6)
             .attr("dy", ".71em")
             .style("text-anchor", "end")
             .text("Protein (g)");
        
        // dots
        svgGraph.selectAll(".dot")
           .data(features)
           .enter().append("circle")
           .attr("class", "dot")
           .attr("r", 5)
           .attr("cx", function(d) {
               return d.properties.stations * (width / max_stations_per);
           })
           .attr("cy", function(d) {
               return (height / max_poverty_rate) * (max_poverty_rate - d.properties.poverty_rate * 100);
           })
           .style("fill", "#000")
           .on("mouseover", function(d) {
               d3.select(this)
                   .transition()
                     .duration(HOVER_TRANS_MS)
                     .attr("r",10);
                     
               
               div.classed("hidden", false);
               div.style("opacity", 1);
               div.html(getTractTooltip(d));
             })
           .on("mouseout", function(d) {
               d3.select(this)
                   .transition()
                     .duration(HOVER_TRANS_MS)
                     .attr("r", 5);
               
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
                      return albersProjection([parseFloat(d.properties.lng), parseFloat(d.properties.lat)])[0];
                  })
                  .attr("cy", function (d) {
                      return albersProjection([parseFloat(d.properties.lng), parseFloat(d.properties.lat)])[1];
                  })
                  .attr("fill", "#191919")
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
            d.properties.municipal;
}