var stations = [];

// Waits for DOM to load before running
$(document).ready(() => {
    
    // Create table out of stations
    $.post("/stations",  responseJSON => {
        stations = responseJSON;
        console.log(responseJSON);
        
        //d3.select("#station-table > tbody")
        //    .selectAll("tr")
        //    .data(responseJSON)
        //    .enter().append("tr")
        //      .html(function(data) {
        //        var innerHTML = "";
        //            for (let stationProp in data) {
        //                if (data.hasOwnProperty(stationProp)) {
        //                    innerHTML += "<td>" + data[stationProp] +"</td>";
        //                }
        //            }
        //            return innerHTML;
        //        });
        
        var width = 500,
            height = 500,
            margin = 50;
          
        var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
        var x = d3.scaleLinear().domain([-71.146452, -71.035705]).range([margin, width - margin]);
        var y = d3.scaleLinear().domain([42.309467, 42.40449]).range([height - margin, margin]);
        var c = d3.scaleOrdinal(d3.schemeCategory10).domain(["Existing", "Removed"]);
        
        svg.selectAll("circle").data(responseJSON).enter()
            .append("circle")
            .attr("cx",function(d,i) {return x(stations[i]["lng"]);})
            .attr("cy",function(d,i) {return y(stations[i]["lat"]);})
            .attr("r",5)
            .style("fill",function(d,i) {return c(stations[i][status]);})
              .append("title")
              .text(String);
    });
});