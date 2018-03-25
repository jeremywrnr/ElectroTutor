import React, {Component} from 'react';
import Graph from './Graph.js';
import {withSerial} from './Serial.js';
import {Header, Button, Input, List, Segment} from 'semantic-ui-react';

class SerialMonitorShell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serial: '',
      spjs: '',
    };
  }

  static defaultProps = {
    t_stream: [],
    d_stream: [],
    log: [],
  };

  componentDidMount = () => {
    this.props.openSPJS();
  };

  handleSerialChange = e => this.setState({serial: e.target.value});
  handleSPJSChange = e => this.setState({spjs: e.target.value});

  openSerial = () => this.props.openPort();
  closeSerial = () => this.props.closePort();
  clearSerial = () => this.props.clearPort();

  sendSerial = () => {
    this.props.sendPort(this.state.serial);
    this.setState({serial: ''});
  };

  sendSPJS = () => {
    this.props.sendSPJS(this.state.spjs);
    this.setState({spjs: ''});
  };

  render() {
    const t_length = this.props.t_stream.length;
    const d_length = this.props.d_stream.length;
    const l_length = this.props.log.length;
    return (
      <div className="full">
        <Header as="h5">Serial Port</Header>
        <Segment basic>
          <Button onClick={this.openSerial} content="Open" />
          <Button onClick={this.closeSerial} content="Close" />
          <Button onClick={this.clearSerial} content="Clear" />
          <Input
            action={{
              onClick: this.sendSerial,
              content: 'Send',
            }}
            placeholder="serial message"
            onChange={this.handleSerialChange}
            value={this.state.serial}
          />
        </Segment>
        <Header as="h5">Websockets Connection</Header>
        <Segment basic>
          {t_length > 0 && <Graph data={this.state.data} />}
          <Button onClick={this.props.openSPJS} content="Reconnect" />
          <Input
            action={{
              onClick: this.sendSPJS,
              content: 'Send',
            }}
            placeholder="websocket command"
            onChange={this.handleSPJSChange}
            value={this.state.spjs}
          />
        </Segment>

        <div id="log">
          test: {t_length}, device: {d_length} messages: {l_length}
        </div>
        <Segment inverted>
          <List divided inverted relaxed items={this.props.log} />
        </Segment>
      </div>
    );
  }
}

const SerialMonitor = withSerial(SerialMonitorShell, {
  samples: 1000,
});

export {SerialMonitor};
