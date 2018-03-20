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
// Code Analysis
//

class CodeRunner extends React.Component {
  verify = () => {
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
