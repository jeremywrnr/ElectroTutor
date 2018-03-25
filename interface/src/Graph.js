import React, {Component} from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';

// general data monitor
//Tooltip, <Tooltip />

class Graph extends Component {
  static defaultProps = {
    data: [],
  };

  render() {
    const dObject = this.props.data.map(x => {
      return {x}; // [num] => [obj]
    });

    return (
      <LineChart width={820} height={400} data={dObject}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <YAxis domain={[0, 5]} />
        <XAxis dataKey="x" />
        <Line
          isAnimationActive={false}
          type="step"
          stroke=" #17a1a5"
          dataKey="data"
          dot={false}
        />
        <ReferenceLine
          y={5}
          stroke="grey"
          alwaysShow={true}
          strokeWidth="1"
          strokeDasharray="5 15"
        />
      </LineChart>
    );
  }
}

export default Graph;
