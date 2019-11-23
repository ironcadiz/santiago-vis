var width = 1920
var height = 1280
var centered;
var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}
var sampleSize = isMobile? 1000 : 5000;
var radius = isMobile?  7:4;

// md components setup
const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const buttonClose =  new mdc.ripple.MDCRipple(document.querySelectorAll('.mdc-button')[0]);
const buttonSample =  new mdc.ripple.MDCRipple(document.querySelectorAll('.mdc-button')[1]);
const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));
const contentEls = document.querySelectorAll('.content');
const tab_home = new mdc.tab.MDCTab(document.querySelectorAll('.mdc-tab')[0]);
const tab_image = new mdc.tab.MDCTab(document.querySelectorAll('.mdc-tab')[1]);
const textField = new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));

var xDown = null, yDown = null, xUp = null, yUp = null;
document.addEventListener('touchstart', touchstart, false);
document.addEventListener('touchmove', touchmove, false);
document.addEventListener('touchend', touchend, false);
function touchstart(evt) { const firstTouch = (evt.touches || evt.originalEvent.touches)[0]; xDown = firstTouch.clientX; yDown = firstTouch.clientY; }
function touchmove(evt) { if (!xDown || !yDown ) return; xUp = evt.touches[0].clientX; yUp = evt.touches[0].clientY; }
function touchend(evt) {
    var xDiff = xUp - xDown, yDiff = yUp - yDown;
    if ((Math.abs(xDiff) > Math.abs(yDiff)) && (Math.abs(xDiff) > 0.33 * document.body.clientWidth)) {
        if (xDiff >= 0)
          console.log("swaip")
          drawer.open = false
    }
    xDown = null, yDown = null;
}


drawer.open = true;
textField.value = sampleSize;

tabBar.listen('MDCTabBar:activated', (event) => activate_tab_content(event.detail.index));

function activate_tab_content(index) {
  // Hide currently-active content
  document.querySelector('.content--active').classList.remove('content--active');
  // Show content for newly-activated tab
  contentEls[index].classList.add('content--active');
}

buttonClose.listen('click',() => {
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
  style: 'mapbox://styles/mapbox/dark-v10',
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
    .attr("height", 350)
image_svg.append("text")
    .attr("x",250)
    .attr("y",200)
    .attr("text-anchor","middle")
    .text("Clickea un punto para ver la imagen")

var radar_svg = d3.select('#radar').select('#graph')
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

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
        .data(sample, d => d.file)
  dots.enter().append("circle").classed("dot", true)
      .attr("r", 1)
      .attr("cx", (d) => d.cx)
      .attr("cy", (d) => d.cy)
      .attr("fill",d => colorScales[cat](d[cat]))
      .on("click",click_dot)
      .transition().duration(1000)
      .attr("r", radius)

  buttonSample.listen('click', () => {
        sampleSize = Math.max(Math.min(Number(textField.value),80000),0)
        textField.value = sampleSize;
        sample = []
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
              .data(sample, d => d.file)
        dots.enter().append("circle").classed("dot", true)
            .attr("r", 1)
            .attr("cx", (d) => d.cx)
            .attr("cy", (d) => d.cy)
            .attr("fill",d => colorScales[cat](d[cat]))
            .on("click",click_dot)
            .transition().duration(1000)
            .attr("r", radius)
        dots.exit().transition().duration(1000).attr("r", 0).remove()
      })

  function render_dots(sample) {
      dotLayer.selectAll("circle")
      .attr("cx", (d) => project(d).x)
      .attr("cy", (d) => project(d).y)
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
var legend_w = "50vw", legend_h = 70;

lColors = legendColors(cat)
var key = mapLayer
  .append("svg")
  .attr("width", legend_w)
  .attr("height", legend_h)
  .classed("legend",true)
  .attr("x","25vw")
  .attr("y","80vh")

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
var translates = {
  "wealthy": "Riqueza",
  "depressing": "Depresividad",
  "safety": "Seguridad",
  "lively": "Vivacidad",
  "boring": "Aburrimiento",
  "beautiful": "Belleza",
}


let radialScale = d3.scaleLinear()
.domain([-5,5])
.range([0,200]);
let ticks = [-5,-3,-1,1,3,5];
var xCenter = 225
var yCenter = 250
init_radar();

function init_radar() {
    var axises = radar_svg.selectAll('circle').data(ticks).enter().append("circle")
    .attr("cx", xCenter)
    .attr("cy", yCenter)
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("r", d => radialScale(d));

    var  txts = radar_svg.selectAll('text').data(ticks).enter().append('text')
        .attr("x", xCenter + 5)
        .attr("y", d => (yCenter - radialScale(d)))
        .text(d => d)

    attribs.forEach((element, index) => {
      let ft_name = element;
      let angle = indexToAngle(index,attribs.length);
      let line_coordinate = angleToCoordinate(angle, 5);
      let label_coordinate = angleToCoordinate(angle, 5.7);

      //draw axis line
      radar_svg.append("line")
      .attr("x1", xCenter)
      .attr("y1", yCenter)
      .attr("x2", line_coordinate.x)
      .attr("y2", line_coordinate.y)
      .attr("stroke","black");

      //draw axis label
      var label = radar_svg.append("text")
      .attr("x", label_coordinate.x)
      .attr("y", label_coordinate.y)
      .text(translates[ft_name])
      .attr('text-anchor','middle')

      if (angle > (Math.PI / 2) && angle < (Math.PI / 2)*3) {
        label.attr("transform",`rotate(${270 - angle* (180/Math.PI) + 180 },${label_coordinate.x},${label_coordinate.y})`)
      } else if (angle < (Math.PI / 2) || angle > (Math.PI / 2)*3) {
        label.attr("transform",`rotate(${90 - angle* (180/Math.PI)},${label_coordinate.x},${label_coordinate.y})`)
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
  return {"x": xCenter + x, "y": yCenter - y};
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

