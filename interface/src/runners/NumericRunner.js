//

import React, {Component} from 'react';
import {withSerial} from '../Serial.js';
import MeasuringMessage from '../MeasuringMessage.js';
import {StatCouple} from '../DynamicStat.js';

// Single sample analysis

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
    stream: [],
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  componentWillUnmount = () => {
    clearInterval(this.state.interval);
  };

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
    this.props.openSPJS();
    console.log('verify numeric runner...');
    const err = 0.02; // two percent
    const interval = setInterval(() => {
      if (this.props.test_mode !== 'voltage') {
        clearInterval(interval);
        this.setState({measuring: false});
        return;
      }

      let sum = 0;
      const data = this.props.stream;
      const len = data.length;
      data.map(x => (sum += x));
      const value = len > 0 ? sum / len : '-';
      this.setState({value});
      if (len === 0) {
        this.setState({measuring: true});
        return;
      }

      const out = Number(this.props.test.output);
      const pass = (1 - err) * out < value && value < (1 + err) * out;
      const prev = this.props.pdata.state === 'pass';
      if (pass !== prev) {
        clearInterval(interval);
        this.setState({measuring: false});
        setTimeout(() => {
          this.props.patch(pass);
        }, 750);
      }
    }, 100);
    this.setState({interval});
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
  samples: 50,
});

export default NumericRunner;
