var express = require('express');
var parse = require('csv-parse');
var fs = require('fs');

var app = express();
app.use(express.static('public'));

const STATIONS_FILE = 'public/data/hubway_stations.csv';
const STATIONS_HEADERS = ["id", "terminal", "station", "municipal", "lat", "lng", "status"];

// data
var stations = [];

app.post("/stations", function(req, res) {
	res.send(stations);
});

app.listen(3000, function () {
	console.log("Loading stations csv...");
	
	// Create the parser
	var parser = parse({delimiter: ','});
	
	var input = fs.createReadStream(STATIONS_FILE);
	input.pipe(parser)
	.on('data', function(csvrow){
		station = {};
		for (var i = 0; i < STATIONS_HEADERS.length; i++) {
			station[STATIONS_HEADERS[i]] = csvrow[i];
		}
		stations.push(station);
	})
    .on('end',function() {
		console.log("Finished loading stations!");
    });
	
	console.log('Hubway listening on port 3000!');
});