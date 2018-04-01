$(document).ready(() => {

  commonTestData = [
    [1000, {label: 'A'}],
    [1300, {label: 'B'}],
    [3600, {label: 'C'}],
    [4000, {label: 'D'}],
    [5200, {label: 'E'}],
    [7000, {label: 'F', color: '#FFBE33'}],
    [0,    {label: 'G'}]
  ]

  $('#defaults-graph').tufteBar({
    data: commonTestData
  });

  $('#static-properties-graph').tufteBar({
    data: commonTestData,
    barWidth: 0.8,
    barLabel:  'Y',
    axisLabel: 'X',
    color:     '#aa0000'
  });

  $('#dynamic-properties-graph').tufteBar({
    data: commonTestData,
    barWidth:  function(i) { return 0.5 + (i % 2) * 0.2 },
    barLabel:  function(i) { return this[0] },
    axisLabel: function(i) { return this[1].label },
    color:     function(i) {
      return this[1].color || ['#E57536', '#82293B'][i % 2]
    }
  });

});
