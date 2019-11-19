var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1980,
    outerHeight = 720,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();


x.domain([-6, 6]);
y.domain([-6, 6]);

var height_image = y(0) - y(2);


var width_image = x(1) - x(0);

// dropdown setup
var allGroup = ["wealthy", "depressing", "safety","lively","boring","beautiful"]

var xCat = "wealthy",
    yCat = "wealthy";

// add the options to the button
d3.select("#selectButtonY")
  .selectAll('myOptions')
  .data(allGroup)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

d3.select("#selectButtonX")
  .selectAll('myOptions')
  .data(allGroup)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

var sampleSize = 50;
var IMAGE_DIR = 'santiago/'

d3.csv("data/santiago_rank.csv", function(data) {
  sample = []
  for(var i = 0; i < sampleSize; i++){
    index = Math.floor(Math.random()*data.length);
    selected_point = data[index]
    sample.push(selected_point)
  }
  sample.forEach(function(d) {
    d.xAxis = +d[xCat]
    d.yAxis = +d[yCat]
    d.file = d['id']
  });

  // var xMax = d3.max(data, function(d) { return d.xAxis; }) * 1.05,
  //     xMin = d3.min(data, function(d) { return d.xAxis; }),
  //     xMin = xMin > 0 ? 0 : xMin,
  //     yMax = d3.max(data, function(d) { return d.yAxis; }) * 1.05,
  //     yMin = d3.min(data, function(d) { return d.yAxis; }),
  //     yMin = yMin > 0 ? 0 : yMin;


  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return d["id"] + "<br>" + `<img src=${IMAGE_DIR}/${d['file']} height=250 width=300> </img>`;
      });

  var zum = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#images")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zum);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .classed("x", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text(xCat);

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .classed("y", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yCat);

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  var pictures;
  image_gen()

  var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects");

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .attr("class", "xline")
    .style("stroke", "gray")
    .style("stroke-width", "1px")
    .style("stroke-dasharray", "5,5")
    .style("opacity", "0");

  mouseG.append("path") // this is the black horizontal line to follow mouse
  .attr("class", "mouse-line")
  .attr("class", "yline")
  .style("stroke", "gray")
  .style("stroke-width", "1px")
  .style("stroke-dasharray", "5,5")
  .style("opacity", "0");

  mouseG.append("text")
    .attr('class','mouse-text-x')
    .style("fill", "gray")
    .style("opacity", "0")

  mouseG.append("text")
  .attr('class','mouse-text-y')
  .style("fill", "gray")
  .style("opacity", "0")
  
  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".picture")
        .attr("transform", transform)
  }

  function transform(d) {
    return "translate(" + (x(d[xCat]) - width_image/2) + "," + (y(d[yCat]) - height_image/2) + ")";
  }




  // A function that updates the chart
  function updateAxis(selectedGroup,axis) {

    // Create new data with the selection?
    if (axis == 'x' ){
      xCat = selectedGroup
      svg.select(".x .label").text(xCat)
    }else if (axis == 'y' ){
      yCat = selectedGroup
      svg.select(".y .label").text(yCat)
    }
    sample  = sample.map(function(d) {
      d.xAxis = +d[xCat]
      d.yAxis = +d[yCat]
      // d.class = d['class']
      d.file = d['id']
      return d
    });

    // Give these new data to update line
    pictures
        .data(sample)
        .transition()
        .duration(1000)
        .attr("transform", transform)
  }

  function image_gen(){
    pictures = objects.selectAll(".picture")
      .data(sample)
    .enter().append("svg:image")
      .classed("picture", true)

      .attr('xlink:href', d => (`${IMAGE_DIR}/${d['file']}`))
      .attr("height", height_image)
      .attr('width', width_image)
      .attr("transform", transform)
      .on('mouseover', function(item) { // on mouse in show line and tooltip
        tip.show(item)
        d3.select(".xline")
          .attr("d", function() {
            var d = "M" + x(item[xCat]) + "," + height;
            d += " " + x(item[xCat]) + "," + 0;
            return d;
          })
          .style("opacity", "1")
        d3.select(".yline")
          .attr("d", function() {
            var d = "M" + width + "," + y(item[yCat]);
            d += " " + 0 + "," + y(item[yCat]);
            return d;
          })
          .style("opacity", "1")
        d3.select('.mouse-text-x')
          .style("opacity", "1")
          .attr('transform',`translate(${x(item[xCat]) - 20},${height + 15})`)
          .text(Number(item[xCat]).toFixed(3));
        d3.select('.mouse-text-y')
          .style("opacity", "1")
          .attr('transform',`translate(${0 - 50},${y(item[yCat]) + 5})`)
          .text(Number(item[yCat]).toFixed(3));
      })
      .on('mouseout', function(item) { // on mouse out hide line and tooltip
        tip.hide(item)
        d3.select(".xline")
          .style("opacity", "0");
        d3.select(".yline")
          .style("opacity", "0");
        d3.select(".mouse-text-x")
          .style("opacity", "0");
        d3.select(".mouse-text-y")
          .style("opacity", "0");
      })
  }

  // When the button is changed, run the updateChart function
  d3.select("#selectButtonX").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      updateAxis(selectedOption,'x')
  })
  
  // When the button is changed, run the updateChart function
  d3.select("#selectButtonY").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    updateAxis(selectedOption,'y')
  })

  function select_samples() {
    sampleSize  = d3.select('#sample-size').property("value")
    sample = []
    for(var i = 0; i < sampleSize; i++){
      index = Math.floor(Math.random()*data.length);
      selected_point = data[index]
      sample.push(selected_point)
    }
    sample.forEach(function(d) {
      d.xAxis = +d[xCat]
      d.yAxis = +d[yCat]
      d.file = d['id']
    });
    objects.selectAll(".picture").remove()

    image_gen()
  }

  d3.select("#button_resample").on("click",select_samples)



});
