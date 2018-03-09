import React, {Component} from 'react';
import {throttle} from 'lodash';
import {Form, List, Segment} from 'semantic-ui-react';
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

  sendSerial = () => {
    this.props.sendPort(this.state.serial);
    this.setState({serial: ''});
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

        <Form onSubmit={this.sendSerial}>
          <label>Serial Port</label>
          <Form.Group>
            <Form.Button onClick={this.props.openPort} content="Open" />
            <Form.Button onClick={this.props.closePort} content="Close" />
            <Form.Input
              action="Send"
              placeholder="serial message"
              value={this.state.serial}
              onChange={this.handleSerialChange}
            />
          </Form.Group>
        </Form>

        <Form onSubmit={this.sendSPJS}>
          <label> Websockets Connection </label>
          <Form.Group>
            <Form.Button onClick={this.props.openSPJS} content="Reconnect" />
            <Form.Input
              action="Send"
              placeholder="websocket command"
              onChange={this.handleSPJSChange}
              value={this.state.spjs}
            />
          </Form.Group>
        </Form>

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
  class WithSerial extends React.Component {
    constructor(props) {
      super(props);
      const now = Date.now();
      this.state = {
        ...Config.serial,
        start: now,
        data: [],
        log: [],
      };
    }

    componentDidMount = () => this.openSPJS();
    componentWillUnmount = () => this.closeSPJS();

    // TODO maybe list the actual ports which are available and only open them
    // when it is necessary to do so. calling open on open ports is not good

    openSPJS = () => {
      this.closeSPJS();
      const append = this.appendLog;
      let conn = new WebSocket(this.state.host);
      conn.onclose = function(evt) {
        append('Connection closed.');
      };
      conn.onmessage = function(evt) {
        append(evt.data);
      };
      this.setState({conn});
    };

    handleSendSPJS = msg => {
      console.log('spjs:', msg);
      const conn = this.state.conn;
      if (msg && conn && conn.readyState === WebSocket.OPEN) {
        conn.send(msg);
      }
    };

    closeSPJS = () => {
      this.setState({data: [], log: []});
      const conn = this.state.conn;
      if (conn) {
        this.closePort();
        conn.close();
        this.setState({conn: undefined});
      }
    };

    openPort = () => {
      return this.handleSendSPJS(`open ${this.state.port} ${this.state.baud}`);
    };

    sendPort = msg => {
      return this.handleSendSPJS(`send ${this.state.port} ${msg}`);
    };

    closePort = () => {
      return this.handleSendSPJS(`close ${this.state.port} ${this.state.baud}`);
    };

    //
    // two categories of data: log messages from spjs, and data from the serial
    // monitor, which are stored respectively in the component's log or data.
    //

    appendLog = throttle(msg => {
      try {
        let json_msg = JSON.parse(msg);
        json_msg.date = Date.now() - this.state.start;
        if (json_msg.D) {
          const numbers = json_msg.D.split('\r\n')
            .slice(1, -1)
            .map((d, i) => {
              return {V: Number(d), date: (json_msg.date + i * 3) / 1000.0};
            });
          console.log(json_msg);
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
        data: this.state.data,
        log: this.state.log,
      };

      return <WrappedComponent {...wProps} {...this.props} />;
    }
  }

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  // #convention-pass-unrelated-props-through-to-the-wrapped-component
  WithSerial.displayName = `WithSerial(${getDisplayName(WrappedComponent)})`;
  return WithSerial;
}

//
// HOOK SERIAL MONITOR INTERFACE INTO SPJS WEBSOCKETS
//

const SerialMonitor = withSerial(SerialMonitorShell, 10000);

export {SerialMonitor, withSerial};
