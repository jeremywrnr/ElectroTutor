import React, {Component} from 'react';
import {withSerial} from '../Serial.js';
import {StatCouple} from '../DynamicStat.js';
import {Icon, Label} from 'semantic-ui-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import MeasuringMessage from '../MeasuringMessage.js';
import Config from '../Config.js';

//
// Variable Analysis
//

class VariableRunnerShell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: false,
      preparing: false,
      measuring: false,
      compile: {},
      value: '-',
    };
  }

  static defaultProps = {
    data: [0],
    log: [0],
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  componentWillUnmount = () => {
    clearInterval(this.state.interval);
  };

  verify = () => {
    this.setState({measuring: false, preparing: true});
    const code = this.props.progress.code;
    const data = JSON.parse(this.props.test.jsondata);
    const idt = data.map(d => d.name);
    this.props.handleTestMode('variable');
    this.props.api
      .postTCode(code, idt)
      .then(compile => this.setState({compile}))
      .then(this.measure)
      .then(() => this.setState({preparing: false}));
  };

  measure = () => {
    this.props.openSPJS();
    console.log('verify variable runner...');
    const data = JSON.parse(this.props.test.jsondata);
    const idt = data.map(d => d.name)[0];
    const interval = setInterval(() => {
      if (this.props.test_mode !== 'variable') {
        clearInterval(this.state.interval);
        this.setState({measuring: false});
      }

      const d = this.props.stream;
      const dl = d.length - 1;
      const idtidx = this.props.idents.findIndex(x => x === idt);
      const value = d.filter(d => d.name === idtidx)[dl];
      const pass = false;
      const prev = this.props.pdata.state === 'pass';
      this.setState({value});
      if (pass !== prev) {
        clearInterval(this.state.interval);
        this.setState({measuring: false});
        setTimeout(() => this.props.patch(false), 8000);
      }
    }, 200);
    this.setState({interval, measuring: true});
  };

  render() {
    let input;
    const val = this.state.value && this.state.value.data;
    const prep = this.state.preparing;
    const meas = this.state.measuring;
    const col = meas ? 'green' : 'grey';
    const compile = this.state.compile;
    const ok = compile.code === 0;
    const err = !ok && compile.error;
    const data = JSON.parse(this.props.test.jsondata);
    const idt = data.map(d => d.name);
    if (isNaN(val)) {
      input = '-';
    } else {
      input = +val.toFixed(2);
    }

    return (
      <div className="full">
        {this.props.test.description}
        {idt.length >= 0 && <br />}
        {idt.map((x, i) => <VarLabel color={col} key={i} name={x} />)}
        {this.state.loading && <MeasuringMessage head="Recompiling..." />}
        {err && <SyntaxHighlighter>{err}</SyntaxHighlighter>}
        <br />
        {!err &&
          prep && (
            <MeasuringMessage
              icon="setting"
              head="Setting up..."
              text="Loading instrumented code onto development board."
            />
          )}
        {!err && !prep && <StatCouple input={input} out={out} />}
        {!err && meas && <MeasuringMessage />}
      </div>
    );
  }
}

class VarLabel extends Component {
  render() {
    return (
      <Label as="a" size="large">
        <Icon color={this.props.color} name="eye" /> {this.props.name}
      </Label>
    );
  }
}

const VariableRunner = withSerial(VariableRunnerShell, {
  port: Config.serial.device,
  delim: `\r\n`,
  samples: 100,
});

export default VariableRunner;
