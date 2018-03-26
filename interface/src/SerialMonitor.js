import React, {Component} from 'react';
import Graph from './Graph.js';
import {withSerial} from './Serial.js';
import {Header, Button, Input, List, Segment} from 'semantic-ui-react';
import Config from './Config.js';

class SerialMonitorShell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serial: '',
      spjs: '',
    };
  }

  static defaultProps = {
    stream: [],
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
    const l = this.props.log;
    const s = this.props.stream;
    const d = s.map(x => x.data);
    return (
      <div className="full">
        {s.length > 0 && <Graph data={d} />}
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
          stream: {s.length}, messages: {l.length}
        </div>
        <Segment inverted>
          <List divided inverted relaxed items={l} />
        </Segment>
      </div>
    );
  }
}

const SerialMonitor = withSerial(SerialMonitorShell, {
  port: Config.serial.device,
  delim: `\r\n`,
  samples: 1000,
});

export {SerialMonitor};
