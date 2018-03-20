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
