var stations = [];

// Waits for DOM to load before running
$(document).ready(() => {
    
    // Create table out of stations
    $.post("/stations",  responseJSON => {
        stations = responseJSON;
        console.log(responseJSON);
        
        d3.select("#station-table")
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