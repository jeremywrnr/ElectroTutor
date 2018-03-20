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
