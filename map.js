var width = 1920
var height = 1280
var centered;

// md components setup
const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const buttonRipple =  new mdc.ripple.MDCRipple(document.querySelector('.mdc-button'));
const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));
const contentEls = document.querySelectorAll('.content');
const tab_home = new mdc.tab.MDCTab(document.querySelectorAll('.mdc-tab')[0]);
const tab_image = new mdc.tab.MDCTab(document.querySelectorAll('.mdc-tab')[1]);

drawer.open = true;
tabBar.listen('MDCTabBar:activated', (event) => activate_tab_content(event.detail.index));

function activate_tab_content(index) {
  // Hide currently-active content
  document.querySelector('.content--active').classList.remove('content--active');
  // Show content for newly-activated tab
  contentEls[index].classList.add('content--active');
}

buttonRipple.listen('click',() => {
  drawer.open = false;
})

select.listen('MDCSelect:change', () => {
  // recover the option that has been chosen
  cat = select.value
  mapLayer
    .selectAll("circle")
    .data(sample)
    .transition()
    .duration(2000)
    .attr("fill",d => colorScales[cat](d[cat]))

    lColors = legendColors(cat)
    legend.selectAll("stop").data(lColors)
    .attr("offset", d => `${d[1]}%`)
    .attr("stop-opacity", 1)
    .transition()
    .duration(1000)
    .attr("stop-color", d=> d[0])

    key.select('#left-legend-text')
    .text(legendTexts[cat][0])
    key.select('#right-legend-text')
    .text(legendTexts[cat][1])
});

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5qYWxvdCIsImEiOiJjaWhtdmxhNTIwb25zdHBsejk0NGdhODJhIn0.2-F2hS_oTZenAWc0BMf_uw'
//Setup mapbox-gl map
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-70.670000,-33.509502],
  zoom: 11,

})
map.addControl(new mapboxgl.NavigationControl());

// Setup our svg layer that we can manipulate with d3
var container = map.getCanvasContainer()

var svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .classed("main-svg",true)

var image_svg = d3.select('#radar').select('#picture')
    .append("svg")
    .attr("width", 500)
    .attr("height", 400);

var radar_svg = d3.select('#radar').select('#graph')
    .append("svg")
    .attr("width", 500)
    .attr("height", 450);

var mapLayer = svg.append('g')
  .classed('map-layer', true);

var dotLayer = mapLayer.append('g')

var bigText = svg.append('text')
  .classed('big-text', true)
  .attr('x', 20)
  .attr('y', 45);

var path;

function project(d) {
  return map.project(getLL(d));
}
function getLL(d) {
  return new mapboxgl.LngLat(+d.lng, +d.lat)
}

//Project any point to map's current state
function projectPoint(lon, lat) {
  var point = map.project(new mapboxgl.LngLat(lon, lat));
  this.stream.point(point.x, point.y);
}

//Projection function
var transform = d3.geoTransform({point:projectPoint});
var path = d3.geoPath().projection(transform);

var cat = 'wealthy'
var sampleSize = 5000;
var sample = []

var colorScales = {
  wealthy: d3.scaleSequential(d3.interpolateRdYlGn).domain([-5,4]),
  depressing: d3.scaleSequential(d3.interpolatePuOr).domain([4,-3]),
  safety: d3.scaleSequential(d3.interpolateRdYlGn).domain([-5,4]),
  lively: d3.scaleSequential(d3.interpolateCool).domain([-4,4]),
  boring: d3.scaleSequential(d3.interpolateRdGy).domain([-5,4]),
  beautiful: d3.scaleSequential(d3.interpolateViridis).domain([-5,3]),
}

var legendTexts = {
  wealthy: ['Muy pobre', 'Muy rico'],
  depressing: ['Muy deprimente', 'No deprimente'],
  safety: ['Muy inseguro', 'Muy seguro'],
  lively: ['Poco animado', 'Muy animado'],
  boring: ['Poco Aburrido', 'Muy aburrido'],
  beautiful: ['Muy feo', 'Muy bello'],
}

var clicked;
var IMAGE_DIR = 'santiago/'

function legendColors(cat) {
  percents = [0,33,66,100]
  domain = colorScales[cat].domain()
  return percents.map((p) => {
    xCoord =  domain[0] + ((domain[1] -domain[0])*p/100)
    return [colorScales[cat](xCoord), p]
  })
}


d3.csv("data/santiago_rank.csv", function(data) {
  for(var i = 0; i < sampleSize; i++){
    index = Math.floor(Math.random()*data.length);
    selected_point = data[index]
    sample.push(selected_point)
  }
  sample.forEach(function(d) {
    d.rank = +d[cat]
    d.file = d['id']
    var aux  = d['id'].slice(0,-4).split(",").map((n) => Number(n))
    d.lat = aux[0]
    d.lng = aux[1]
    d.cx =  project(d).x
    d.cy =  project(d).y
  });
  dots = dotLayer.selectAll("circle")
        .data(sample)
  dots.enter().append("circle").classed("dot", true)
      .attr("r", 1)
      .attr("cx", (d) => d.cx)
      .attr("cy", (d) => d.cy)
      .attr("fill",d => colorScales[cat](d[cat]))
      .on("click",click_dot)
      .transition().duration(1000)
      .attr("r", 4)

  function render_dots(sample) {
      sample.forEach(function(d) {
        d.cx =  project(d).x
        d.cy =  project(d).y
      });
      mapLayer.selectAll("circle").data(sample)
      .attr("cx", (d) => d.cx)
      .attr("cy", (d) => d.cy)
    }
    // re-render our visualization whenever the view changes
    map.on("viewreset", function() {
      render_dots(sample)
    })
    map.on("move", function() {
      render_dots(sample)
    })
})


// add the legend now
var legend_w = 500, legend_h = 70;

lColors = legendColors(cat)
var key = mapLayer
  .append("svg")
  .attr("width", legend_w)
  .attr("height", legend_h)
  .classed("legend",true)
  .attr("x",width/2 - legend_w/2)
  .attr("y",900)

var legend = key.append("defs")
  .append("svg:linearGradient")
  .attr("id", "gradient")
  .attr("x1", "0%")
  .attr("y1", "100%")
  .attr("x2", "100%")
  .attr("y2", "100%")
  .attr("spreadMethod", "pad");

legend.selectAll("stop").data(lColors)
  .enter()
  .append("stop")
  .attr("offset", d => `${d[1]}%`)
  .attr("stop-color", d=> d[0])
  .attr("stop-opacity", 1);

key.append("rect")
  .attr("width", legend_w)
  .attr("height", legend_h - 30)
  .style("fill", "url(#gradient)")
  .attr("transform", "translate(0,10)");

key.append("g")
  .append("text")
  .attr("y", 0)
  .attr("dy", "1.5em")
  .text(legendTexts[cat][0])
  .attr("id","left-legend-text")

key.append("g")
  .append("text")
  .attr("y", 0)
  .attr("x",legend_w)
  .attr("dy", "1.5em")
  .style("text-anchor", "end")
  .text(legendTexts[cat][1])
  .attr("id","right-legend-text")

var imgs;
function click_dot(datum){
  selected_point = datum
  imgs = image_svg.selectAll("image").data([selected_point])
    .attr("xlink:href", d => `${IMAGE_DIR}${d.file}`)
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', 480)
    .attr('height', 320);
  imgs
    .enter().append("svg:image")
    .attr("xlink:href", d => `${IMAGE_DIR}${d.file}`)
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', 480)
    .attr('height', 320);
  imgs.exit().remove()
  drawer.open = true;
  tab_home.deactivate()
  tab_image.activate()
  activate_tab_content(1);

  update_radar(selected_point);
}
var attribs = ["wealthy", "depressing", "safety","lively","boring","beautiful"]

let radialScale = d3.scaleLinear()
.domain([-5,5])
.range([0,200]);
let ticks = [-5,-3,-1,1,3,5];
init_radar();

function init_radar() {
    var axises = radar_svg.selectAll('circle').data(ticks).enter().append("circle")
    .attr("cx", 225)
    .attr("cy", 225)
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("r", d => radialScale(d));

    var  txts = radar_svg.selectAll('text').data(ticks).enter().append('text')
        .attr("x", 230)
        .attr("y", d => (225 - radialScale(d)))
        .text(d => d)

    attribs.forEach((element, index) => {
      let ft_name = element;
      let angle = indexToAngle(index,attribs.length);
      let line_coordinate = angleToCoordinate(angle, 5);
      let label_coordinate = angleToCoordinate(angle, 5.7);

      //draw axis line
      radar_svg.append("line")
      .attr("x1", 225)
      .attr("y1", 225)
      .attr("x2", line_coordinate.x)
      .attr("y2", line_coordinate.y)
      .attr("stroke","black");

      //draw axis label
      var label = radar_svg.append("text")
      .attr("x", label_coordinate.x)
      .attr("y", label_coordinate.y)
      .text(ft_name);

      if (angle > (Math.PI / 2) && angle < (Math.PI / 2)*3) {
        label.attr('text-anchor','end')
      } else if (angle < (Math.PI / 2) || angle > (Math.PI / 2)*3) {
        label.attr('text-anchor','start')
      } else {
        label.attr('text-anchor','middle')
      }
    })
}

let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);

function indexToAngle(i,len) {
  return (Math.PI / 2) + (2 * Math.PI * i / len);
}
function angleToCoordinate(angle, value){
  let x = Math.cos(angle) * radialScale(value);
  let y = Math.sin(angle) * radialScale(value);
  return {"x": 225 + x, "y": 225 - y};
}
function getPathCoordinates(data_point){
  coordinates = attribs.map( (attribute,i) => {
      var angle = indexToAngle(i, attribs.length);
      return angleToCoordinate(angle, data_point[attribute]);
  });
  return [...coordinates, coordinates[0]]
}

var radar_path;
var coordinates;
function update_radar(point) {
  coordinates = getPathCoordinates(point);
  radar_path = radar_svg.selectAll('path').data([coordinates])
  radar_path
    .attr("stroke-width", 3)
    .attr("stroke", 'rgb(50, 182, 122)')
    .attr("fill", 'rgb(50, 182, 122)')
    .attr("stroke-opacity", 1)
    .attr("fill-opacity",0.3)
    .transition()
    .duration(1000)
    .attr("d",line)

  radar_path.enter()
    .append('path')
    .attr("stroke-width", 3)
    .attr("stroke", 'rgb(50, 182, 122)')
    .attr("fill", 'rgb(50, 182, 122)')
    .attr("stroke-opacity", 1)
    .attr("fill-opacity",0.3)
    .attr("d",line)

}

