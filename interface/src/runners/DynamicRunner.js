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
    stream: [],
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
    this.props.openSPJS();
    const err = 0.04; // percent tolerance
    console.log('verify frequency runner...');
    const interval = setInterval(() => {
      if (this.props.test_mode !== 'freq') {
        clearInterval(interval);
        this.setState({measuring: false});
        this.closeSPJS();
      }

      const d = this.props.stream;
      if (d.length === 0) return;
      const value = d[d.length - 1].data; // MRU
      const out = Number(this.props.test.output);
      const pass = (1 - err) * out <= value && value <= (1 + err) * out;
      const prev = this.props.pdata.state === 'pass';
      this.setState({value});
      if (pass !== prev) {
        clearInterval(interval);
        this.setState({measuring: false});
        setTimeout(() => this.props.patch(pass), 1250);
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
  samples: 20,
  width: 10,
};

// second param is the number of maximum serial samples
const DynamicRunner = withSerial(DynamicRunnerShell, dynamicOptions);

export default DynamicRunner;
