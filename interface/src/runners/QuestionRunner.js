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

