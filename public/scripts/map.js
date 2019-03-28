function createMap(width, height){
  d3.select('#map-svg')
    .attr('width', width)
    .attr('height', height)
}
function drawMap(geoData){
  var map = d3.select('#map-svg')
  var projection = d3.geoMercator()
    .scale(110)
    .translate()
}
