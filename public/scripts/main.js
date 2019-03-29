mapboxgl.accessToken = 'pk.eyJ1IjoiZGxhbWFydGluYSIsImEiOiJjanRsa3V6ZjAwOTljM3lvamwzeTE2bmp2In0.o8FGySTUwN0IG1NOcL3HKg';
var map = new mapboxgl.Map({
  container: 'map',
  zoom: 1,
  center: [0,0],
  style: 'mapbox://styles/mapbox/satellite-v9',
  maxBounds: [[-180, -85], [180, 85]]
});

// var mapURL = 'http://unpkg.com/world-atlas@1.1.4/world/50m.json';
//  110m significantly more performant during pan / zoom
var mapURL = 'https://unpkg.com/world-atlas@1.1.4/world/110m.json';

d3.queue()
  .defer(d3.json, mapURL)
  .defer(d3.csv, './data/all_data.csv', function(row){
    return{
      continent: row.Continent,
      country: row.Country,
      countryCode: row["Country Code"],
      emissions: +row["Emissions"],
      emissionsPerCapita: +row["Emissions Per Capita"],
      region: row.Region,
      year: +row.Year
    }
  })
  .await(function(error, mapData, data){
    if(error) throw error;
    var extremeYears = d3.extent(data, d => d.year);
    var currentYear = extremeYears[0];
    var currentDataType = d3.select('input[name="data-type"]:checked')
                            .attr("value");
                            console.log(currentDataType)
    var geoData = topojson.feature(mapData, mapData.objects.countries).features;

    var width = +d3.select(".chart-container")
                   .node().offsetWidth;
    var height = 300;

    // Create the map
    var svg = d3.select(map.getCanvasContainer()).append('svg')
      .attr('id', 'map-svg');
    drawMap(svg, geoData, data, currentYear, currentDataType);

    createPie(width, height * 1.2);
    createBar(width, height);
    drawPie(data, currentYear);
    drawBar(data, currentDataType, '');

    d3.select('#year')
      .property('min', currentYear)
      .property('max', extremeYears[1])
      .property('value', currentYear)
      .on('input', () => {
        currentYear = +d3.event.target.value;
        drawMap(svg, geoData, data, currentYear, currentDataType);
        drawPie(data, currentYear);
        highlightBars(currentYear);
      })
    d3.selectAll('input[name="data-type"]')
      .on('change', () => {
        var active = d3.select('.active').data()[0];
        var country = active ? active.properties.country : '';
        currentDataType = d3.event.target.value;
        console.log(d3.event)
        console.log(d3.event.target)
        console.log(d3.event.target.value)
        drawMap(svg, geoData, data, currentYear, currentDataType);
        drawBar(data, currentDataType, country);
      });
    d3.selectAll('svg')
      .on('mousemove touchmove', updateTooltip);

    // function updateTooltip(){
    //   var tooltip = d3.select('.tooltip');
    //   var tgt = d3.select(d3.event.target);
    //   var isCountry = tgt.classed('country');
    //   var isBar = tgt.classed('bar');
    //   var isArc = tgt.classed('arc');
    //   var dataType = d3.select('input:checked')
    //     .property('value');
    //   var units = dataType === 'emissions' ? 'thousand metric tons' : 'metric tons per capita';
    //   var data;
    //   var percentage = '';
    //   if (isCountry) data = tgt.data()[0].properties;
    //   if (isArc){
    //     data = tgt.data()[0].data;
    //     percentage = `<p>Percentage of total: ${getPercentage(tgt.data()[0])}</p>`;
    //   }
    //   if (isBar) data = tgt.data()[0];
    //   tooltip
    //       .style("opacity", +(isCountry || isArc || isBar))
    //       .style("left", (d3.event.pageX - tooltip.node().offsetWidth / 2) + "px")
    //       .style("top", (d3.event.pageY - tooltip.node().offsetHeight - 10) + "px");
    //   if (data) {
    //     var dataValue = data[dataType] ?
    //       data[dataType].toLocaleString() + " " + units :
    //       "Data Not Available";
    //     tooltip
    //         .html(`
    //           <p>Country: ${data.country}</p>
    //           <p>${formatDataType(dataType)}: ${dataValue}</p>
    //           <p>Year: ${data.year || d3.select("#year").property("value")}</p>
    //           ${percentage}
    //         `)
    //   }
    // }
  });

function formatDataType(key) {
  return key[0].toUpperCase() + key.slice(1).replace(/[A-Z]/g, c => " " + c);
}

function getPercentage(d) {
  var angle = d.endAngle - d.startAngle;
  var fraction = 100 * angle / (Math.PI * 2);
  return fraction.toFixed(2) + "%";
}

function updateTooltip(){
  var tooltip = d3.select('.tooltip');
  var tgt = d3.select(d3.event.target);
  var isCountry = tgt.classed('country');
  var isBar = tgt.classed('bar');
  var isArc = tgt.classed('arc');
  var dataType = d3.select('input:checked')
    .property('value');
  var units = dataType === 'emissions' ? 'thousand metric tons' : 'metric tons per capita';
  var data;
  var percentage = '';
  if (isCountry) data = tgt.data()[0].properties;
  if (isArc){
    data = tgt.data()[0].data;
    percentage = `<p>Percentage of total: ${getPercentage(tgt.data()[0])}</p>`;
  }
  if (isBar) data = tgt.data()[0];
  tooltip
      .style("opacity", +(isCountry || isArc || isBar))
      .style("left", (d3.event.pageX - tooltip.node().offsetWidth / 2) + "px")
      .style("top", (d3.event.pageY - tooltip.node().offsetHeight - 10) + "px");
  if (data) {
    var dataValue = data[dataType] ?
      data[dataType].toLocaleString() + " " + units :
      "Data Not Available";
    tooltip
        .html(`
          <p>Country: ${data.country}</p>
          <p>${formatDataType(dataType)}: ${dataValue}</p>
          <p>Year: ${data.year || d3.select("#year").property("value")}</p>
          ${percentage}
        `)
  }
}
