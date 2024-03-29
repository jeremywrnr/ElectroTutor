import React, {Component} from 'react';
import {Message} from 'semantic-ui-react';
import {withSerial} from '../Serial.js';
import MeasuringMessage from '../MeasuringMessage.js';
import MarkdownView from '../MarkdownView.js';
import {StatCouple} from '../DynamicStat.js';
import Graph from '../Graph.js';

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
    clearTimeout(this.state.failTimeout);
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
    this.setState({measuring: true});
    console.log('verify numeric runner...');
    const err = 0.02; // two percent
    const interval = setInterval(() => {
      if (this.props.test_mode !== 'voltage') {
        clearInterval(interval);
        this.setState({measuring: false});
        return;
      }
      let sum = 0;
      const d = this.props.stream;
      console.log(d);
      const len = d.length;
      if (len && len <= 0) return;
      d.map(x => (sum = sum + Number(x.data)));
      const value = sum / len;
      this.setState({value});
      const out = Number(this.props.test.output);
      const pass = (1 - err) * out <= value && value <= (1 + err) * out;
      const prev = this.props.pdata.state === 'pass';
      if (pass !== prev && !this.state.changing) {
        this.setState({pass: pass, changing: true});
        setTimeout(() => {
          clearInterval(interval);
          this.setState({measuring: false});
          this.props.patch(pass);
        }, 2000);
      }
    }, 100);

    const failTimeout = setTimeout(() => {
      clearInterval(interval);
      this.props.patch(false); // fail
    }, 12000);

    this.setState({interval, failTimeout});
  };

  render() {
    let input;
    const val = this.state.value;
    const pass = this.state.pass && this.state.changing; // fail -> pass
    const prep = this.state.preparing;
    const meas = this.state.measuring;
    const d = this.props.stream.map(x => x.data);
    const out = Number(this.props.test.output);
    if (isNaN(val)) {
      input = '-';
    } else {
      input = +val.toFixed(2);
    }

    const fail = this.props.pdata.state === 'fail';
    const help = this.props.test.onerror;
    const show = fail && help;

    return (
      <div className="full">
        {pass && (
          <Message
            success
            header={'Test Passed!'}
            icon={'check'}
            content={'Correct measurement recorded.'}
          />
        )}

        {meas && (
          <div className="full">
            <br />
            <StatCouple unit="V" input={input} out={out} />
            {d.length > 0 && <Graph data={d} />}
            <MeasuringMessage />
            <br />
          </div>
        )}

        {prep && (
          <MeasuringMessage
            icon="setting"
            head="Setting up..."
            text="Loading code onto test board."
          />
        )}

        {show && <Message info content={help} />}

        <MarkdownView source={this.props.test.description} />
      </div>
    );
  }
}

const NumericRunner = withSerial(NumericRunnerShell, {
  samples: 100,
});

export default NumericRunner;
