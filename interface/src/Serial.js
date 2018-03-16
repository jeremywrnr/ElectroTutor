import React, {Component} from 'react';
import {throttle} from 'lodash';
import {Header, Button, Input, List, Segment} from 'semantic-ui-react';
import Config from './Config.js';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';

//
// GENERAL SERIAL MONITOR
//

class SerialGraph extends Component {
  render() {
    return (
      <LineChart width={820} height={400} data={this.props.data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <XAxis
          domain={['dataMin * 0.9', 'dataMax * 1.1']}
          type="number"
          dataKey="date"
        />
        <Line
          isAnimationActive={false}
          type="monotone"
          stroke=" #17a1a5"
          dataKey="V"
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

//
// UNCONNECTED SERIAL MONITOR COMPONENT
//

class SerialMonitorShell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serial: '',
      spjs: '',
    };
  }

  static defaultProps = {
    data: [],
    log: [],
  };

  handleSerialChange = e => this.setState({serial: e.target.value});
  handleSPJSChange = e => this.setState({spjs: e.target.value});

  openSerial = () => {
    this.props.openPort();
  };

  sendSerial = () => {
    this.props.sendPort(this.state.serial);
    this.setState({serial: ''});
  };

  closeSerial = () => {
    this.props.closePort();
  };

  closeSerial = () => {
    this.props.closePort();
  };

  sendSPJS = () => {
    this.props.sendSPJS(this.state.spjs);
    this.setState({spjs: ''});
  };

  render() {
    const d_length = this.props.data.length;
    const l_length = this.props.log.length;
    return (
      <div className="full">
        {d_length > 0 && <SerialGraph data={this.props.data} />}

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
          data: {d_length}, messages: {l_length}
        </div>
        <Segment inverted>
          <List divided inverted relaxed items={this.props.log} />
        </Segment>
      </div>
    );
  }
}

//
// Higher order component:
// This function takes a component and returns another component.
// Still kind of implies that there will only be one of these running
// .. or does the message get piped out to all of the channels?
//

function withSerial(WrappedComponent, sampleWindowWidth) {
  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  const displayName = `WithSerial(${getDisplayName(WrappedComponent)})`;

  class WithSerial extends React.Component {
    constructor(props) {
      super(props);
      const now = Date.now();
      this.state = {
        ...Config.serial,
        displayName,
        start: now,
        data: [],
        log: [],
      };
    }

    componentWillMount = () => this.openSPJS();
    componentWillUnmount = () => this.closeSPJS();

    // TODO maybe list the actual ports which are available and only open them
    // when it is necessary to do so. calling open on open ports is not good

    openSPJS = () => {
      console.log(`opening spjs - ${this.state.displayName}`);
      this.setState({data: [], log: []});
      let conn = new WebSocket(this.state.host);
      conn.onmessage = evt => this.handleMessage(evt.data);
      conn.onclose = evt => this.handleMessage('Connection closed.');
      this.openPort();
      this.setState({conn});
    };

    handleSendSPJS = msg => {
      console.log('spjs:', msg, ` - [${this.state.displayName}]`);
      const conn = this.state.conn;
      if (msg && conn && conn.readyState === WebSocket.OPEN) {
        conn.send(msg);
      }
    };

    closeSPJS = () => {
      console.log(`closing spjs - ${this.state.displayName}`);
      this.state.conn.close();
    };

    openPort = (port = this.state.device) => {
      console.log(port);
      return this.handleSendSPJS(`open ${port} ${this.state.baud}`);
    };

    sendPort = (msg, port = this.state.device) => {
      console.log(msg, port);
      return this.handleSendSPJS(`send ${port} ${msg}`);
    };

    closePort = (port = this.state.device) => {
      console.log(port);
      return this.handleSendSPJS(`close ${port} ${this.state.baud}`);
    };

    clearPortData = () => {
      this.setState({data: []});
    };

    //
    // two categories of data: log messages from spjs, and data from the serial
    // monitor, which are stored respectively in the component's log or data.
    //

    handleMessage = throttle(msg => {
      try {
        let json_msg = JSON.parse(msg);
        json_msg.date = Date.now() - this.state.start;
        if (json_msg.D) {
          const numbers = json_msg.D.split('\r\n')
            .slice(1, -1)
            .map((d, i) => {
              return {V: Number(d), date: (json_msg.date + i * 3) / 1000.0};
            });

          // TODO: split into different names for device/tester serial data.
          // TODO check any of the number conversion failed, and throw

          //console.log(json_msg);
          const joined = [...this.state.data, ...numbers];
          const start = Math.max(joined.length - sampleWindowWidth, 1);
          const data = joined.slice(start, -1);
          this.setState({data});
        } else {
          json_msg.key = json_msg.date;
          this.setState({log: [JSON.stringify(json_msg), ...this.state.log]});
        }
      } catch (e) {
        const str_msg = `${msg} +${Date.now() - this.state.start}`;
        this.setState({log: [str_msg, ...this.state.log]});
      }
    }, 100);

    render() {
      const wProps = {
        openSPJS: this.openSPJS,
        sendSPJS: this.handleSendSPJS,
        openPort: this.openPort,
        sendPort: this.sendPort,
        closePort: this.closePort,
        clearPort: this.clearPort,
        data: this.state.data,
        log: this.state.log,
      };

      return <WrappedComponent {...wProps} {...this.props} />;
    }
  }

  // #convention-pass-unrelated-props-through-to-the-wrapped-component
  WithSerial.displayName = displayName;
  return WithSerial;
}

//
// HOOK SERIAL MONITOR INTERFACE INTO SPJS WEBSOCKETS
//

const SerialMonitor = withSerial(SerialMonitorShell, 1000);

export {SerialMonitor, withSerial};
