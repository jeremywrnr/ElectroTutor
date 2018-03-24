import React, {Component} from 'react';
import {withSerial} from './Serial.js';
import {Header, Button, Input, List, Segment} from 'semantic-ui-react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';

// GENERAL SERIAL MONITOR
//Tooltip, <Tooltip />

class SerialGraph extends Component {
  render() {
    return (
      <LineChart width={820} height={400} data={this.props.data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <YAxis domain={[0, 5]} />
        <XAxis
          domain={['dataMin * 0.9', 'dataMax * 1.1']}
          type="number"
          dataKey="time"
        />
        <Line
          isAnimationActive={false}
          type="step"
          stroke=" #17a1a5"
          dataKey="data"
          dot={false}
        />
        <ReferenceLine
          y={5}
          stroke="grey"
          alwaysShow={true}
          strokeWidth="1"
          strokeDasharray="5 15"
        />
      </LineChart>
    );
  }
}

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

  //{d_length > 0 && <SerialGraph data={this.state.data} />}
  render() {
    const t_length = this.props.t_stream.length;
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
          data: {t_length}, messages: {l_length}
        </div>
        <Segment inverted>
          <List divided inverted relaxed items={this.props.log} />
        </Segment>
      </div>
    );
  }
}

const SerialMonitor = withSerial(SerialMonitorShell, {
  samples: 500,
  width: 100,
});

export {SerialMonitor};