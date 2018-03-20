import React, {Component} from 'react';
import MeasuringMessage from '../MeasuringMessage.js';
import {StatCouple} from '../DynamicStat.js';
import {withSerial} from '../Serial.js';

// HARDWARE ANALYSIS
//
class DynamicRunnerShell extends Component {
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
    data: [],
    log: [],
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  componentWillUnmount = () => {
    clearInterval(this.state.interval);
  };

  verify = () => {
    if (this.props.test_mode === 'freq') {
      this.measure();
    } else {
      this.setState({preparing: true});
      this.props.handleTestMode('freq');
      this.props.api
        .postTFreq()
        .then(this.measure)
        .then(() => this.setState({preparing: false}));
    }
  };

  measure = () => {
    this.props.openPort();
    const err = 0.02; // two percent
    console.log('verify dynamic runner...');
    const interval = setInterval(() => {
      // Test mode has been reset
      if (this.props.test_mode !== 'freq') {
        clearInterval(interval);
        this.setState({measuring: false});
      }

      const d = this.props.data;
      if (d.length === 0) return;
      const value = d[d.length - 1].V;
      const out = Number(this.props.test.output);
      const pass = (1 - err) * out <= value && value <= (1 + err) * out;
      const prev = this.props.pdata.state === 'pass';
      //console.log(value, pass);
      this.setState({value});
      if (pass !== prev) {
        clearInterval(interval);
        this.setState({measuring: false});
        setTimeout(() => this.props.patch(pass), 1000);
      }
    }, 100);
    this.setState({interval, measuring: true});
  };

  render() {
    let input;
    const val = this.state.value;
    const out = Number(this.props.test.output);
    const prep = this.state.preparing;
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
            <StatCouple unit="Hz" input={input} out={out} />
            {this.state.measuring && <MeasuringMessage />}
          </div>
        )}
      </div>
    );
  }
}

const dynamicOptions = {
  samples: 10,
  width: 10,
};

// second param is the number of maximum serial samples
const DynamicRunner = withSerial(DynamicRunnerShell, dynamicOptions);

export default DynamicRunner;
