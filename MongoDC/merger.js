
//variables geo, stations, demographic
features = geo.features
//returns aggregated files
function main(){

}

//add demographic info to geo

//returns whether location is inside
function inside(point, polygon) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var vs = polygon
    //var x = point[0], y = point[1];
    var x = point.lng
    var y = point.lat

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
//takes feature object and returns polygon
function get_polygon(f){
    return(f.geometry.coordinates[0])
}

//retrieves string tract
function get_bad_tract(f){
  stringy_tract = (f.properties.NAME10)
  return(Number(stringy_tract))
}

//adds tracts to all data in number format under properties.tract
function add_tracts(){
  for(var i = 0; i < features.length; i++){
    features[i].properties.tract = get_bad_tract(features[i])
  }
}

//displays geo data
function display(){
  document.getElementById("a").innerHTML = JSON.stringify(geo)
}

//adds the stations count as a property to the geo file
function add_stations(){
  for (var i = 0; i < features.length; i++) {
      counter = 0
      for (var j = 0; j < stations.length; j++){
        poly = get_polygon(features[i])
          if(inside(stations[j], poly)){
            counter++
          }
      }
      features[i].properties.stations = counter
  }
}

//adds population and poverty rate to geo file
function add_population_poverty (){
  for (var i = 0; i < features.length; i++) {
      counter = 0
      for (var j = 0; j < demographic.length; j++){
          if(features[i].properties.tract == demographic[j].tract){
            features[i].properties.population = demographic[j].population
            features[i].properties.poverty_rate = demographic[j].poverty_rate
          }
      }
  }
}

//filter stations for only Cambridge stations
function filter_for_Cambridge(){
  features = map.features
  new_map = {"type": "FeatureCollection", "features": []}
  for (var i = 0; i < features.length; i++){
    if(features[i].properties.municipal == "Cambridge"){
      new_map.features.push(features[i])
    }
  }
  document.getElementById("a").innerHTML = JSON.stringify(new_map)
}
