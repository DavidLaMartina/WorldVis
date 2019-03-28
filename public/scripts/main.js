mapboxgl.accessToken = 'pk.eyJ1IjoiZGxhbWFydGluYSIsImEiOiJjanRsa3V6ZjAwOTljM3lvamwzeTE2bmp2In0.o8FGySTUwN0IG1NOcL3HKg';

var map = new mapboxgl.Map({
  container: 'map',
  zoom: 1,
  center: [0,0],
  style: 'mapbox://styles/mapbox/satellite-v9'
});
map.setMaxBounds(map.getBounds());    // Prevent

var container = map.getCanvasContainer();
var svg = d3.select(container).append('svg')
  .attr('id', 'map-svg');

function getD3(){
  // var bbox = container.getBoundingClientRect();
  var bbox = $('#map').get(0).getBoundingClientRect();
  var center = map.getCenter();
  var zoom = map.getZoom();
  var scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);
  var d3projection = d3.geoMercator()
    .center([center.lng, center.lat])
    .translate([bbox.width/2, bbox.height/2])
    .scale(scale)
  return  d3projection;
}
var d3projection = getD3();
// var url = 'http://unpkg.com/world-atlas@1.1.4/world/50m.json';
//  110m significantly more performant during pan / zoom
var url = 'http://unpkg.com/world-atlas@1.1.4/world/110m.json';

d3.json(url, function(err, data){
  var geoData = topojson.feature(data, data.objects.countries).features;

  var mapSvg = d3.select('#map-svg');
  var projection = getD3();
  var path = d3.geoPath().projection(projection);

  var update = mapSvg.selectAll('.country')
    .data(geoData);

  update
    .enter()
    .append('path')
    .classed('country', true)
    .attr('d', path)
    .attr('fill', 'blue')
    .attr('fill-opacity', 0.6)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)

  function render(){
    projection = getD3();
    path.projection(projection)
    mapSvg.selectAll('.country')
      .attr('d', path)
  }
  map.on('viewreset', render)
  map.on('move', render)
  // render();
})
