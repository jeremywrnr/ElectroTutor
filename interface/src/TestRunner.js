/*eslint eqeqeq:0*/

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withSerial} from './Serial.js';
import {Button, Segment} from 'semantic-ui-react';
import {
  Form,
  Checkbox,
  Statistic,
  Container,
  Message,
  Input,
} from 'semantic-ui-react';

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

class NumericRunnerShell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '-',
    };
  }

  static defaultProps = {
    data: [],
    log: [],
  };

  verify = () => {
    console.log('verify numeric runner...');
    setTimeout(() => {
      this.generateAverage();
      const val = this.state.value;
      const out = Number(this.props.test.output);
      // Potentially add in a test option here to have it be exact
      const pass = 0.9 * out < val && val < 1.1 * out;
      this.props.patch(pass);
    });
  };

  componentDidMount = () => {
    this.props.button.handleClick = this.verify;
  };

  // Compute running average of last n frames to help with noise.
  generateAverage = () => {
    let sum = 0;
    const d = this.props.data;
    d.map(x => (sum += x.V));
    const value = d.length > 0 ? sum / d.length : '-';
    this.setState({value});
  };

  render() {
    const val = this.state.value;
    const output = this.props.test.output;
    const input = val === '-' ? val : +this.state.value.toFixed(2);

    return (
      <div className="full">
        {this.props.test.description}
        <br />
        <br />
        <Container textAlign="center">
          <Statistic color="grey">
            <Statistic.Value>{input}</Statistic.Value>
            <Statistic.Label>measured</Statistic.Label>
          </Statistic>
          <Statistic color="green">
            <Statistic.Value>{output}</Statistic.Value>
            <Statistic.Label>expected</Statistic.Label>
          </Statistic>
        </Container>
      </div>
    );
  }
}
const NumericRunner = withSerial(NumericRunnerShell, 30); // max samples

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

// TODO cache the users last output to save their answers.

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
    //const output = this.props.test.output;
    //const value = this.state.value;
    this.props.patch(true);
  };

  componentWillMount = () => {
    this.props.button.handleClick = this.verify;
  };

  render() {
    return <div className="full">{this.props.test.description}</div>;
  }
}

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
    if (tProps.button) {
      switch (tProps.test.form) {
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
          return <Message error content={`info is not accepted`} />;
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
        <Segment attached basic color={tProps.color}>
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
