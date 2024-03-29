import React, {Component} from 'react';
import {Browser} from 'react-window-ui';
import {Segment, Dimmer, Loader, Button, Icon} from 'semantic-ui-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {irBlack, dark} from 'react-syntax-highlighter/styles/hljs';
import Code from './Code.js';

class ArduinoButton extends Component {
  render() {
    return (
      <Button
        as={'div'}
        icon
        fluid
        animated
        className="fade"
        onClick={this.props.onClick}>
        <Button.Content hidden>{this.props.text}</Button.Content>
        <Button.Content visible>
          <Icon name={this.props.icon} />
        </Button.Content>
      </Button>
    );
  }
}

class ArduinoWindow extends Component {
  static defaultProps = {
    output: false,
  };

  render() {
    const ctrl = this.props.control;
    const output = this.props.compile;
    const compile = this.props.handleCompile;
    const upload = this.props.handleUpload;
    const monitor = this.props.handleMonitor;
    const change = this.props.handleCodeChange;
    const select = this.props.handleSelectionChange;

    let compile_value, compile_success;
    if (this.props.loading) {
      compile_value = this.props.loading;
    } else {
      const compile_finished = output;
      compile_success = compile_finished && output.code === 0;
      compile_value = (compile_success ? output.output : output.error) || '';
    }

    //<ArduinoButton onClick={monitor} text="Monitor" icon="search" />

    return (
      <div id="arduino" className="arduino full">
        <Browser id="browser">
          <Button.Group widths="3">
            <ArduinoButton onClick={compile} text="Verify" icon="check" />
            <ArduinoButton onClick={upload} text="Upload" icon="arrow right" />
            {false &&
              ctrl && (
                <ArduinoButton onClick={monitor} text="Monitor" icon="search" />
              )}
          </Button.Group>

          <div className="full flex-container">
            <div id="code_editor">
              <Code
                name="code"
                readOnly={false}
                showLines={true}
                showGutter={true}
                onChange={change}
                onSelectionChange={select}
                highlightActiveLine={true}
                value={this.props.progress.code}
              />
            </div>

            <Segment className="no-pad no-margin" id="status_container">
              <Dimmer active={!!this.props.loading}>
                <Loader size="large">{this.props.loading}</Loader>
              </Dimmer>
              <SyntaxHighlighter
                id={'compile'}
                style={compile_success ? irBlack : dark}>
                {compile_value}
              </SyntaxHighlighter>
            </Segment>
          </div>
        </Browser>
      </div>
    );
  }
}

export default ArduinoWindow;
