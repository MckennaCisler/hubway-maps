var parse = require('csv-parse');
var fs = require('fs');

loadCSV("public/data/hubway_stations.csv", function(results) {
	var geo = {
		"type":"FeatureCollection",
		"features": []
	};
	
	for (var i = 0; i < results.length; i++) {
		var row = {
			"type":"Feature",
			"geometry": {
				"type" : "Point",
				"coordinates": [parseFloat(results[i].lat), parseFloat(results[i].lng)]
			},
			"properties": results[i],
		};
		geo.features.push(row);
		console.log(row);
	}
	
	console.log("Writing...");
	fs.writeFile('public/data/hubway_stations_geojson.json', JSON.stringify(geo, null, 4));
});


function loadCSV(file, callback) {
	var headers;
	var results = [];
	
	var parser = parse({delimiter: ','});
	
	var input = fs.createReadStream(file);
	input.pipe(parser)
	.on('data', function(csvrow) {
		if (headers === undefined) {
			headers = csvrow;
		} else {
			row = {};
			for (var i = 0; i < csvrow.length; i++) {
				row[headers[i]] = csvrow[i];
			}
			results.push(row);
		}
	})
    .on('end',function() {
		callback(results);
    });
}