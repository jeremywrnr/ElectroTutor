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
    margin: {top: 5, right: 10, left: 0, bottom: 5},
    height: 400,
    width: 550,
    data: [],
  };

  render() {
    const dObject = this.props.data.map(x => {
      return {data: x}; // [num] => [obj]
    });

    const yOpts = {
      y: Math.max(...this.props.data),
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
          margin={this.props.margin}
          data={dObject}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <YAxis domain={[0, 'dataMax']} />
          <XAxis tick={false} padding={{bottom: 20}} />
          <ReferenceLine {...yOpts} />
          <Line
            isAnimationActive={false}
            type="step"
            stroke=" #17a1a5"
            dataKey="data"
            dot={false}
          />
        </LineChart>
      </div>
    );
  }
}

export default Graph;
