import React, {Component} from 'react';
import MeasuringMessage from '../MeasuringMessage.js';
import {StatCouple} from '../DynamicStat.js';
import {withSerial} from '../Serial.js';

class ContinuityRunnerShell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      measuring: false,
      value: '-',
    };
  }

  static defaultProps = {
    data: [],
    log: [],
  };

  // Potentially add in a test option here to have it be exact
  // Also figure out how to best deal with serial ports.

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  // Compute running average of last n frames to help with noise.
  // TODO pass in a desired error margin from the test itself

  verify = () => {
    this.props.openPort();
    const err = 0.02; // two percent
    console.log('verify continuity runner...');
    const interval = setInterval(() => {
      let sum = 0;
      const d = this.props.data;
      d.map(x => (sum += x.V));
      const value = d.length > 0 ? sum / d.length : '-';
      const out = Number(this.props.test.output);
      const pass = (1 - err) * out < value && value < (1 + err) * out;
      const prev = this.props.pdata.state === 'pass';
      console.log(d, value, pass);
      this.setState({value});
      if (pass !== prev) {
        clearInterval(interval);
        this.setState({measuring: false});
        setTimeout(() => {
          this.props.patch(pass);
        }, 220);
      }
    }, 100);
    this.setState({measuring: true});
  };

  render() {
    const val = this.state.value;
    const out = Number(this.props.test.output);
    const input = val === '-' ? val : +val.toFixed(2);
    return (
      <div className="full">
        {this.props.test.description}
        <br />
        <br />
        <StatCouple input={input} out={out} />
        {this.state.measuring && <MeasuringMessage />}
      </div>
    );
  }
}

const ContinuityRunner = withSerial(ContinuityRunnerShell, {});

export default ContinuityRunner;
