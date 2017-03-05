var express = require('express');
var parse = require('csv-parse');
var fs = require('fs');

var app = express();
app.use(express.static('public'));

app.listen(3000, function () {
	
	console.log('Hubway listening on port 3000!');
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