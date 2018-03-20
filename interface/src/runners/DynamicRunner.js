import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withSerial} from './Serial.js';
import MeasuringMessage from './MeasuringMessage.js';
import SyntaxHighlighter from 'react-syntax-highlighter';
import CodeRunner from 'runners/CodeRunner.js';
import {StatCouple} from './DynamicStat.js';
import {
  Form,
  Checkbox,
  Segment,
  Message,
  Input,
  Button,
} from 'semantic-ui-react';

//
//// HARDWARE ANALYSIS
//
class DynamicRunnerShell extends React.Component {
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

  verify = () => {
    this.props.openPort();
    console.log('verify dynamic runner...');
    const err = 0.1; // ten percent
    const interval = setInterval(() => {
      const d = this.props.data;
      const len = d.length;
      if (len < 10) return;
      let changes = 0;
      let inc = false;
      let prev = 0;
      d.forEach(x => {
        const v = x.V;
        if (inc && v < prev) {
          // stop increasing
          changes += 1;
          inc = false;
          prev = v;
        } else if (!inc && v > prev) {
          // stop decreasing
          changes += 1;
          inc = true;
          prev = v;
        }
      });

      const time = d[len - 1].date - d[0].date;
      const value = time > 0 ? changes / time : '-';
      const out = Number(this.props.test.output);
      const pass = (1 - err) * out < value && value < (1 + err) * out;
      console.log(value, changes, time, pass);

      const past = this.props.pdata.state === 'pass';
      if (value > 0) this.setState({value});
      if (pass !== past) {
        clearInterval(interval);
        this.setState({measuring: false});
        setTimeout(() => {
          this.props.patch(pass);
        }, 550);
      }
    }, 250);
    this.setState({interval, measuring: true});
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
    if (this.props.pdata.state !== 'pass') {
      this.verify();
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.state.interval);
  };

  render() {
    const val = this.state.value;
    const out = Number(this.props.test.output);
    const input = val === '-' ? val : +val.toFixed(2);
    return (
      <div className="full">
        {this.props.test.description}
        <br />
        <StatCouple unit="Hz" input={input} out={out} />
        {this.state.measuring && <MeasuringMessage />}
      </div>
    );
  }
}

// second param is the number of maximum serial samples
const DynamicRunner = withSerial(DynamicRunnerShell, 10000);
