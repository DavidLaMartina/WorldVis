function drawMap(svg, geoData, data, year, dataType){
  var projection = getProjection();
  var path = d3.geoPath().projection(projection);

  d3.select('#year-val').text(year);

  geoData.forEach(d => {
    var countries = data.filter(row => row.un_code === parseInt(d.id))
    var name = '';
    if (countries.length > 0) name = countries[0].country;
    d.properties = countries.find(c => c.year === year) || { country: name };
  });

  var colors = ["#f1c40f", "#e67e22", "#e74c3c", "#c0392b"];

  var domains = {
    emissions: [0, 2.5e5, 1e6, 5e6],
    emissionsPerCapita: [0, 0.5, 2, 10]
  };

  var mapColorScale = d3.scalePow()
    // .domain(domains.emissions)
    .domain([0, Math.max.apply(Math, data.map(function(o) { return o.data; }))])
    // .domain(d3.extent(data, d => d.data))
    .range(['yellow', 'red']);

  var update = svg.selectAll('.country').data(geoData);

  update
    .enter()
    .append('path')
      .classed('country', true)
      .attr('d', path)
      .on('click', function(){
        var currentDataType = $('#data-select').val();
        var country = d3.select(this);
        var isActive = country.classed('active');
        var countryName = isActive ? '' : country.data()[0].properties.country;
        drawBar(data, currentDataType, countryName);
        highlightBars(+d3.select('#year').property('value'));
        d3.selectAll('.country').classed('active', false);
        country.classed('active', !isActive);
    })
    .merge(update)
      .transition().duration(750)
      .attr('fill', d => {
        var val = d.properties.data;
        return val ? mapColorScale(val) : '#ccc';
      })
    .attr('fill-opacity', 0.6)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)

    map.on('viewreset', () => renderCountries(svg, path));
    map.on('move', () => renderCountries(svg, path));
    renderCountries(svg, path)
}
function getProjection(){
  var bbox = $('#map').get(0).getBoundingClientRect();
  var center = map.getCenter();
  var zoom = map.getZoom();
  var scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);
  var projection = d3.geoMercator()
    .center([center.lng, center.lat])
    .translate([bbox.width/2, bbox.height/2])
    .scale(scale);
  return projection;
}
function renderCountries(svg, path){
  projection = getProjection();
  path.projection(projection);
  svg.selectAll('.country').attr('d', path);
}
