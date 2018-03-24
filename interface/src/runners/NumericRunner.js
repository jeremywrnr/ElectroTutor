import React, {Component} from 'react';
import {withSerial} from '../Serial.js';
import MeasuringMessage from '../MeasuringMessage.js';
import {StatCouple} from '../DynamicStat.js';

// Single sample analysis
//
class NumericRunnerShell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: false,
      preparing: false,
      measuring: false,
      value: '-',
    };
  }

  static defaultProps = {
    data: [0],
    log: [0],
  };

  // Potentially add in a test option here to have it be exact
  // Also figure out how to best deal with serial ports.

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  componentWillUnmount = () => {
    clearInterval(this.state.interval);
  };

  // Compute running average of last n frames to help with noise.
  // TODO pass in a desired error margin from the test itself

  verify = () => {
    if (this.props.test_mode === 'voltage') {
      this.measure();
    } else {
      this.setState({preparing: true});
      this.props.handleTestMode('voltage');
      this.props.api
        .postTVolt()
        .then(this.measure)
        .then(() => this.setState({preparing: false}));
    }
  };

  measure = () => {
    this.props.openPort();
    const err = 0.02; // two percent
    console.log('verify numeric runner...');
    const interval = setInterval(() => {
      if (this.props.test_mode !== 'voltage') {
        // Test mode has been reset
        clearInterval(interval);
        this.setState({measuring: false});
      }

      let sum = 0;
      const d = this.props.data;
      d.map(x => !isNaN(x.data) && (sum += x.data));
      const value = d.length > 0 ? sum / d.length : '-';
      const out = Number(this.props.test.output);
      const pass = (1 - err) * out < value && value < (1 + err) * out;
      const prev = this.props.pdata.state === 'pass';
      this.setState({value});
      if (pass !== prev) {
        clearInterval(interval);
        this.setState({measuring: false});
        setTimeout(() => {
          this.props.patch(pass);
        }, 1000);
      }
    }, 100);
    this.setState({interval, measuring: true});
  };

  render() {
    let input;
    const val = this.state.value;
    const prep = this.state.preparing;
    const out = Number(this.props.test.output);
    if (isNaN(val)) {
      input = '-';
    } else {
      input = +val.toFixed(2);
    }

    return (
      <div className="full">
        {this.props.test.description}
        <br />
        {prep ? (
          <MeasuringMessage
            icon="setting"
            head="Setting up..."
            text="Loading code onto test board."
          />
        ) : (
          <div className="full">
            <br />
            <StatCouple unit="V" input={input} out={out} />
            {this.state.measuring && <MeasuringMessage />}
          </div>
        )}
      </div>
    );
  }
}

const NumericRunner = withSerial(NumericRunnerShell, {
  samples: 2000,
  width: 100,
});

export default NumericRunner;
