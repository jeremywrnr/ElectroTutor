/*eslint eqeqeq:0*/

// TODO cache the users last output to save their answers.
// TODO saving previous user input and output to reference in errors and also
// to help with the suggestion of fixes -> providing tips for fixing errors

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withSerial} from './Serial.js';
import MeasuringMessage from './MeasuringMessage.js';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {StatCouple} from './DynamicStat.js';
import {
  Form,
  //Label,
  Checkbox,
  Segment,
  Message,
  Input,
  Button,
} from 'semantic-ui-react';

//
//
// Code Analysis
//
//
//
class CodeRunner extends React.Component {
  verify = () => {
    console.log('Verifying snippet...');
    const code = this.props.selected;
    const data = JSON.parse(this.props.test.jsondata);
    const regex = new RegExp(data.match, data.flag || '');
    const pass = regex.test(code);
    this.props.patch(pass);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    const sel = this.props.selected;
    return (
      <div className="full">
        {this.props.test.description}
        <br />
        {sel && (
          <SyntaxHighlighter language="arduino">
            {this.props.selected}
          </SyntaxHighlighter>
        )}
      </div>
    );
  }
}

//const errorLabel = (text = '') => { return ( <Label attached="top right" color="red"> {text} </Label>); };

// Code Compile testing
//
class CompileRunner extends React.Component {
  state = {};
  verify = () => {
    this.setState({loading: true});
    this.props
      .handleCompile()
      .then(() => this.setState({loading: false}))
      .then(() => {
        const ok = this.props.compile.code === 0;
        this.props.patch(ok);
      });
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    const ok = this.props.compile.code === 0;
    const err = this.props.compile.error;
    return (
      <div className="full">
        {this.props.test.description}
        <br />
        {this.state.loading && <MeasuringMessage head="Compiling..." />}
        {!ok && err && <SyntaxHighlighter>{err}</SyntaxHighlighter>}
      </div>
    );
  }
}

// Upload code testing
//
class UploadRunner extends React.Component {
  state = {};
  verify = () => {
    this.setState({loading: true});
    this.props
      .handleUpload()
      .then(() => this.setState({loading: false}))
      .then(() => {
        const ok = this.props.compile.code === 0;
        this.props.patch(ok);
      });
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    const ok = this.props.compile.code === 0;
    const err = this.props.compile.error;
    return (
      <div className="full">
        {this.props.test.description}
        <br />
        {this.state.loading && <MeasuringMessage head="Uploading..." />}
        {!ok && err && <SyntaxHighlighter>{err}</SyntaxHighlighter>}
      </div>
    );
  }
}
//
//
//
//
//// HARDWARE ANALYSIS
//
//
//
class DynamicRunner extends React.Component {
  verify = () => {
    console.log('verifying dynamic...');
    //const output = this.props.test.output;
    //const value = this.state.value;
    this.props.patch(true);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    return (
      <div className="full">
        <Message content={'dynamic test yet to be implemented'} />
        {this.props.test.description}
        <br />
        jsondata: {this.props.test.jsondata}
        <br />
        output: {this.props.test.output}
      </div>
    );
  }
}

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
        }, 200);
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
class ResistanceRunnerShell extends Component {
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
    console.log('verify resistance runner...');
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
        }, 200);
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
        <StatCouple unit="Ω" input={input} out={out} />
        {this.state.measuring && <MeasuringMessage />}
      </div>
    );
  }
}

// Single sample analysis
//
class NumericRunnerShell extends Component {
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
    if (this.props.pdata.state !== 'pass') {
      this.verify();
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.state.interval);
  };

  // Compute running average of last n frames to help with noise.
  // TODO pass in a desired error margin from the test itself

  verify = () => {
    this.props.openPort();
    const err = 0.02; // two percent
    console.log('verify numeric runner...');
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
        }, 200);
      }
    }, 100);
    this.setState({interval, measuring: true});
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
        <StatCouple unit="V" input={input} out={out} />
        {this.state.measuring && <MeasuringMessage />}
      </div>
    );
  }
}
const ContinuityRunner = withSerial(ContinuityRunnerShell, 30); // max samples
const ResistanceRunner = withSerial(ResistanceRunnerShell, 30); // max samples
const NumericRunner = withSerial(NumericRunnerShell, 30); // max samples

// External info testing
// Multiple choice example
class MultipleRunner extends Component {
  verify = () => {
    console.log('verify multiples...');
    const output = this.props.test.output;
    const value = this.state.value;
    this.props.patch(output == value);
  };

  state = {};
  handleChange = (e, {value}) => this.setState({value});

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    const opts = JSON.parse(this.props.test.jsondata);

    return (
      <Form className="full">
        <Form.Field>{this.props.test.description}</Form.Field>
        {opts.map((opt, i) => {
          return (
            <MultipleRunnerField
              onChange={this.handleChange}
              checked={this.state.value === i}
              key={`key-${i}-${opt}`}
              label={opt}
              value={i}
            />
          );
        })}
      </Form>
    );
  }
}
class MultipleRunnerField extends Component {
  render() {
    return (
      <Form.Field className="full">
        <Checkbox {...this.props} radio name="checkboxRadioGroup" />
      </Form.Field>
    );
  }
}
class QuestionRunner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  handleChange = e => {
    this.setState({value: e.target.value});
  };

  // Always set to true. (or toggle?)
  verify = () => {
    console.log('verifying question runner...');
    const output = this.props.test.output;
    const value = this.state.value;
    this.props.patch(value === output);
  };

  render() {
    return (
      <div className="full">
        {this.props.test.description}
        <br />
        <br />
        <Input
          fluid
          value={this.state.inputValue}
          onChange={this.handleChange}
          placeholder="Answer here..."
        />
      </div>
    );
  }
}

class ManualRunner extends Component {
  // Always set to true. (or toggle?)
  verify = () => {
    console.log('verifying manual runner...');
    this.props.patch(true);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    return <div className="full">{this.props.test.description}</div>;
  }
}

// Global Test Helper
//
class TestRunner extends React.Component {
  state = {};

  static propTypes = {
    pdata: PropTypes.object.isRequired,
    test: PropTypes.object.isRequired,
  };

  static defaultProps = {
    pdata: {},
    test: {},
  };

  generateTestRunner = tProps => {
    const form = tProps.test.form;
    if (tProps.button || form === 'info') {
      switch (form) {
        case 'code':
          return <CodeRunner {...tProps} />;
        case 'continuity':
          return <ContinuityRunner {...tProps} />;
        case 'resistance':
          return <ResistanceRunner {...tProps} />;
        case 'compile':
          return <CompileRunner {...tProps} />;
        case 'upload':
          return <UploadRunner {...tProps} />;
        case 'dynamic':
          return <DynamicRunner {...tProps} />;
        case 'numeric':
          return <NumericRunner {...tProps} />;
        case 'multiple':
          return <MultipleRunner {...tProps} />;
        case 'question':
          return <QuestionRunner {...tProps} />;
        case 'manual':
          return <ManualRunner {...tProps} />;
        case 'info':
          return <Message info content={this.props.test.description} />;
        default:
          return <Message error content={`unknown: ${tProps.test.form}`} />;
      }
    } else {
      return <Segment basic loading={true} content="Loading..." />;
    }
  };

  // hacky way to get reference to sibling element and pass in as a prop
  // https://stackoverflow.com/questions/38864033

  render() {
    const button = this.state.button;
    const tProps = {button, ...this.props};
    const render = tProps && !tProps.test.info;
    return (
      <div className="full">
        <Segment attached basic color={tProps.color || 'grey'}>
          {this.generateTestRunner(tProps)}
        </Segment>
        {render && (
          <Button
            basic
            attached="bottom"
            content={tProps.rtext}
            ref={button => !this.state.button && this.setState({button})}
          />
        )}
      </div>
    );
  }
}

export default TestRunner;
