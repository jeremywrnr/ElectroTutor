import React, {Component} from 'react';
import {Browser} from 'react-window-ui';
import {Button, Icon} from 'semantic-ui-react';
import Code from './Code.js';

// TODO add some progress information for the user

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
    const output = this.props.compile;
    const compile = this.props.handleCompile;
    const upload = this.props.handleUpload;
    const monitor = this.props.handleMonitor;
    const change = this.props.handleCodeChange;

    let compile_value, compile_success;
    if (this.props.loading) {
      compile_value = this.props.loading;
    } else {
      const compile_finished = output;
      compile_success = compile_finished && output.code === 0;
      compile_value = (compile_success ? output.output : output.error) || '';
    }

    return (
      <div id="arduino" className="arduino full">
        <Browser id="browser">
          <Button.Group widths="3">
            <ArduinoButton onClick={compile} text="Verify" icon="check" />
            <ArduinoButton onClick={upload} text="Upload" icon="arrow right" />
            <ArduinoButton onClick={monitor} text="Monitor" icon="search" />
          </Button.Group>

          <div className="full flex-container">
            <div id="code_editor">
              <Code
                name="code"
                readOnly={false}
                showLines={true}
                showGutter={true}
                onChange={change}
                highlightActiveLine={true}
                value={this.props.progress.code}
              />
            </div>

            <div id="status_container">
              <Code
                name={'compile'}
                value={compile_value}
                theme={compile_success ? 'gob' : 'terminal'}
              />
            </div>
          </div>
        </Browser>
      </div>
    );
  }
}

export default ArduinoWindow;
