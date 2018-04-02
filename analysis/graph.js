var svg = d3.select('svg'),
  margin = {top: 20, right: 80, bottom: 30, left: 50},
  width = svg.attr('width') - margin.left - margin.right,
  height = svg.attr('height') - margin.top - margin.bottom,
  g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var x = d3.scaleLinear().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3
  .line()
  .x(function(d) {
    return x(d.time);
  })
  .y(function(d) {
    return y(d.progress);
  });

var time_norm_data = data.map(function(d) {
  return {
    id: d.user,
    control: d.control,
    start: d.start,
    end: d.end,
    values: d.data['progress-update'].map(function(e) {
      return {time: e.time - d.start, progress: +e.args.position};
    }),
  };
});

var users = data.map(function(d, i) {
  return {
    id: d.user,
    control: d.control,
    values: d.data['progress-update'].map(function(e) {
      return {time: e.time - d.start, progress: +e.args.position};
    }),
  };
});

let arrays = data.map(d => d.data['progress-update']);
var events = [].concat.apply([], arrays);

x.domain([
  0,
  d3.max(time_norm_data, function(d) {
    return d3.max(d.values, e => e.time);
  }),
]);

y.domain(
  d3.extent(events, function(d) {
    return d.args.position;
  }),
);

z.domain(
  users.map(function(c) {
    return c.id;
  }),
);

g
  .append('g')
  .attr('class', 'axis axis--x')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(x));

g
  .append('g')
  .attr('class', 'axis axis--y')
  .call(d3.axisLeft(y))
  .append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 6)
  .attr('dy', '0.71em')
  .attr('fill', '#000')
  .text('Step');

var user = g
  .selectAll('.user')
  .data(users)
  .enter()
  .append('g')
  .attr('class', 'user');

user
  .append('path')
  .attr('class', 'line')
  .attr('d', function(d) {
    return line(d.values);
  })
  .style('stroke', function(d) {
    return z(d.id);
  });

user
  .append('text')
  .datum(function(d) {
    return {id: d.id, value: d.values[d.values.length - 1]};
  })
  .attr('transform', function(d) {
    return 'translate(' + x(d.value.time) + ',' + y(d.value.progress) + ')';
  })
  .attr('x', 3)
  .attr('dy', '0.35em')
  .style('font', '10px sans-serif')
  .text(function(d) {
    return d.id;
  });
