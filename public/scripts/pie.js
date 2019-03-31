function createPie(width, height) {
  var pie = d3.select("#pie")
                  .attr("width", width)
                  .attr("height", height);

  pie.append("g")
      .attr("transform", "translate(" + width / 2 + ", " + (height / 2 + 10) + ")")
      .classed("chart", true);

  pie.append("text")
      .attr("x", width / 2)
      .attr("y", "1em")
      .attr("font-size", "1.5em")
      .style("text-anchor", "middle")
      .classed("pie-title", true);
}

function drawPie(data, currentYear) {
  var pie = d3.select("#pie");

  var arcs = d3.pie()
               .sort((a,b) => {
                 if (a.country < b.country) return -1;
                 if (a.country > b.country) return 1;
                 return a.data - b.data;
               })
               .value(d => d.data);

  var path = d3.arc()
               .outerRadius(+pie.attr("height") / 2 - 50)
               .innerRadius(0);

  var yearData = data.data.filter(d => d.year === currentYear);
  var countries = [];
  for (var i = 0; i < yearData.length; i++){
    var country = yearData[i].country;
    if(!countries.includes(country)){
      countries.push(country);
    }
  }

  var colorScale = d3.scaleOrdinal()
    // .domain(d3.extent(data.data, d => d.data))
    .domain(countries)
    .range(["#ab47bc", "#7e57c2", "#26a69a", "#42a5f5", "#78909c"]);
  var update = pie
    .select(".chart")
    .selectAll(".arc")
    .data(arcs(yearData));

  update
    .exit()
    .remove();
  update
    .enter()
      .append("path")
      .classed("arc", true)
      .attr("stroke", "#dff1ff")
      .attr("stroke-width", "0.25px")
    .merge(update)
      .attr('fill', d => colorScale(d.data.country))
      .attr("d", path);

      console.log($('#data-select').text())

  pie.select(".pie-title")
      .text($('#data-select option:selected').text() + ' by Country, ' + currentYear);
}
