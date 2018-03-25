import React, {Component} from 'react';
import {LineChart, Line, CartesianGrid, YAxis, ReferenceLine} from 'recharts';

// general data monitor
//Tooltip, <Tooltip />

class Graph extends Component {
  static defaultProps = {
    height: 400,
    width: 800,
    data: [],
  };

  render() {
    const dObject = this.props.data.map(x => {
      return {data: x}; // [num] => [obj]
    });

    const yOpts = {
      yMin: 0,
      yMax: 5,
      stroke: 'grey',
      alwaysShow: true,
      strokeWidth: 1,
      strokeDasharray: '5 15',
    };

    return (
      <div className="full flex-container">
        <LineChart
          width={this.props.width}
          height={this.props.height}
          data={dObject}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <YAxis domain={[0, 5]} />
          <Line
            isAnimationActive={false}
            type="step"
            stroke=" #17a1a5"
            dataKey="data"
            dot={false}
          />
          <ReferenceLine y={this.props.yMin} {...yOpts} />
          <ReferenceLine y={this.props.yMax} {...yOpts} />
        </LineChart>
      </div>
    );
  }
}

export default Graph;
