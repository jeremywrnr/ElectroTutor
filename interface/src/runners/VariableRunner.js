import React, {Component} from 'react';
import {withSerial} from '../Serial.js';
import {StatCouple} from '../DynamicStat.js';
import {Icon, Label} from 'semantic-ui-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import MeasuringMessage from '../MeasuringMessage.js';
import MarkdownView from '../MarkdownView.js';
import {Message} from 'semantic-ui-react';
import {groupBy} from 'lodash';
import Config from '../Config.js';
import Graph from '../Graph.js';

// Variable Analysis

class VariableRunnerShell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: false,
      preparing: false,
      measuring: false,
      compile: {},
      value: [],
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
    clearTimeout(this.state.failTimeout);
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
    const failTimeout = setTimeout(() => {
      clearInterval(interval);
      this.props.patch(false); // fail
    }, 12000);

    const interval = setInterval(() => {
      if (this.props.test_mode !== 'variable') {
        clearInterval(interval);
        this.setState({measuring: false});
        return;
      }

      const d = this.props.stream;
      if (d.length === 0) return;
      const parsedIdt = this.props.idents;
      const grouped = groupBy(d, 'name');
      const gKey = Object.keys(grouped);
      const value = gKey
        .map(k => {
          const gData = grouped[k];
          const name = parsedIdt[k];
          const last = gData.slice(-1)[0];
          const exp = data.find(x => x.name === name);
          const expv = exp && exp.value;
          const op = exp && exp.op;
          return {
            last: last.data,
            line: last.line,
            data: gData.map(g => g.data),
            expv,
            name,
            op,
          };
        })
        .filter(d => d.expv !== undefined);
      this.setState({value});
      const checkPass = d => {
        if (d.op === 'gt') {
          return d.last >= d.expv;
        } else {
          // assume equals...
          return d.last === d.expv;
        }
      };
      const pass = value.length > 0 && value.every(checkPass);
      console.log(value, pass);
      const prev = this.props.pdata.state === 'pass';
      if (pass !== prev) {
        this.setState({changing: true, pass: pass});
        setTimeout(() => {
          clearInterval(interval);
          this.setState({measuring: false});
          this.props.patch(pass);
        }, 2000);
      }
    }, 200);

    this.setState({interval, failTimeout, measuring: true});
  };

  render() {
    const fail = this.props.pdata.state === 'fail';
    const help = this.props.test.onerror;
    const show = fail && help;

    const data = JSON.parse(this.props.test.jsondata);
    let value = this.state.value;
    if (value.length === 0) {
      value = data.map(d => {
        return {
          name: d.name,
          line: d.line,
          expv: d.value,
          data: [],
        };
      });
    }
    const compile = this.state.compile;
    const ok = compile.code === 0;
    const err = !ok && compile.error;
    const prep = !err && this.state.preparing;
    const pass = !err && this.state.pass && this.state.changing;
    const meas = !err && this.state.measuring;
    const col = meas ? 'green' : 'grey';
    const nanCheck = v => {
      if (isNaN(v)) {
        return '-';
      } else {
        return +v.toFixed(2);
      }
    };

    return (
      <div className="full">
        {this.state.loading && <MeasuringMessage head="Recompiling..." />}
        {err && <SyntaxHighlighter>{err}</SyntaxHighlighter>}
        {pass && (
          <Message
            success
            header={'Test Passed!'}
            icon={'check'}
            content={'Correct measurement recorded.'}
          />
        )}

        {show && <Message info content={help} />}

        {prep && (
          <MeasuringMessage
            icon="setting"
            head="Setting up..."
            text="Loading instrumented code onto development board."
          />
        )}
        {meas &&
          !prep &&
          value.map((x, i) => {
            return (
              <div className="full" key={`var-${i}`}>
                <br />
                <VarLabel
                  color={col}
                  key={i}
                  name={`${x.name} ${x.op === 'gt' ? '>' : ''}=`}
                />
                <StatCouple
                  key={`${x}-${i}`}
                  input={nanCheck(x.last)}
                  out={`${x.op === 'gt' ? '>=' : ''} ${x.expv}`}
                />
                {x.data.length > 0 && <Graph data={x.data} />}
              </div>
            );
          })}
        {meas && (
          <MeasuringMessage text="Measuring code variable data changes..." />
        )}
        <MarkdownView source={this.props.test.description} />
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
  samples: 50000,
});

export default VariableRunner;
