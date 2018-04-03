// d3 info visualization
var dataset = data;
var padding = 200
var padbot = 50
var rpad = 50
var h = 500
var w = 3000
var col1 = 0
var col2 = 50
var col3 = 130
var yspan = h - padbot


//Create scale functions
var xs = d3.scale.linear() // event time scale
    .domain([0, d3.max(dataset, function(d) {
      return d3.max(d.phases.concat(d.events),
              function(p) { return p.stop; });
    })]).range([padding, w-rpad]);
var yss = d3.scale.linear() // session scale
    .domain([0, 3])
    .range([yspan/8, 7*yspan/8]);
var yst = d3.scale.linear() // type scaling
    .domain([0, 7])
    .range([yspan/16, 15*yspan/16]);
var ysn = d3.scale.linear() // name scaling
    .domain([0, 15])
    .range([yspan/32, 31*yspan/32]);
var ysi = d3.scale.linear() // item scaling
    .domain([0, 16])
    .range([0, yspan]);


//Create SVG elements
var svg = d3.select("body")
    .append("div")
    .append("svg")
    .attr("height", h)
    .attr("width", w);

// Adding sess labels
svg.selectAll(".sess")
   .data([0, 1, 2, 3])
   .enter()
   .append("text")
   .attr("x", col1)
   .attr("y", function(d) { return yss(d); })
   .text(function(d) { return "S" + d; })

// Adding type labels
var iter = [0, 1, 2, 3, 4, 5, 6, 7]
svg.selectAll(".type")
   .data(iter)
   .enter()
   .append("text")
   .attr("x", col2)
   .attr("y", function(d, i) { return yst(i); })
   .text(function(d, i) { return i % 2 ? "events" : "phases"; })

// Adding name labels
var names = [0, 1, 0, 1, 2, 3, 2, 3, 4, 5, 4, 5, 6, 7, 6, 7]
svg.selectAll(".name")
   .data(names)
   .enter()
   .append("text")
   .attr("x", col3)
   .attr("y", function(d, i) { return ysn(i); })
   .text(function(d) { return dataset[d].name; })


// Constructing coder timelines
var coder = svg.selectAll("g")
   .data(dataset)
   .enter()
   .append("g");

 // Defining colors
var colors = {
  "html": "#66c2a5", // phases
  "style": "#fc8d62",
  "data": "#8da0cb",
  "load": "#e78ac3",
  "view": "#b3de69", // events
  "git": "#8dd3c7",
  "docs": "#ffffb3",
  "etest": "#bebada",
  "itest": "#fb8072",
  "edit": "#80b1d3",
  "other": "#fdb462",
}

// color all edits/views same
var strip = function(str) {
    return str.replace(/_.*/, '')
}

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");

// Drawing a phase or event timeline per coder
var plot = function(data, name, yindex, scale) {
    coder.selectAll(name)
       .data(data)
       .enter()
       .append("rect")
       .attr("x", function(d) { return scale(d.start); })
       .attr("y", function(d) { return ysi(yindex); })
       .attr("fill", function(d) { return colors[strip(d.name)]; }) // strip
       .attr("height", (yspan/16))
       .attr("width", function(d) {
         return scale(d.stop) - scale(d.start);
       }) // adding hover info here
      .on("mouseover", function(){return tooltip.style("visibility", "visible");})
      .on("mousemove", function(d){ // moving name
        tooltip.text( d.name );
        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
}


// Map over all data elements
dataset.map(function(d, i) {
  plot(d.phases, d.name + "_phases", i + d.session*2, xs)
});

dataset.map(function(d, i) {
  plot(d.events, d.name + "_events", i + d.session*2 + 2, xs)
});


// Create timeline axes
var xAxis = d3.svg.axis()
    .scale(xs)
.orient("bottom")
    .ticks(20);
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + yspan + ")")
    .call(xAxis);



////////////////////////////////////////////////////////////////////////////////
// LEGEND CONSTRUCTION
////////////////////////////////////////////////////////////////////////////////

var legendData =  [];
for (name in colors)
  legendData.push({ "name" : name, "color": colors[name] });

// Creating legend header and display for all colors used
d3.select("body").append("h2").text("Legend")
var legend = d3.select("body")
    .append("svg")
    .attr("height", h/2)
    .attr("width", w/2);

var lplot = function(data, name, xcol) {
  legend.append("text")
      .attr("x", xcol + 50)
      .attr("y", ysn(0))
      .text(name)
  legend.selectAll('.' + name + '_label')
      .data(data)
      .enter()
      .append("text")
      .attr("x", xcol)
      .attr("y", function(d, i) { return ysn(i+1); })
      .text(function(d) { return d.name; })
  legend.selectAll('.' + name + '_color')
      .data(data)
      .enter()
      .append("rect")
      .attr("x", xcol + 50)
      .attr("y", function(d, i) { return ysn(i+0.5); })
      .attr("fill", function(d) { return d.color; })
      .attr("height", (yspan/16))
      .attr("width", 50)
}

// calling legend plotting function
lplot(legendData.slice(0, 4), "phases", col2)
lplot(legendData.slice(4, 11), "events", col2 + col3)

// change all text selections to be 14 point
d3.selectAll("text").attr("font-size", "14px");

