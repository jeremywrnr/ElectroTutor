import React, {Component} from 'react';
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

// GENERAL SERIAL MONITOR
//<Label value="time [ms]" />
//import {throttle} from 'lodash';
//import worker_script from './SerialWorker.js';

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
      data: [],
      log: [],
      serial: '',
      spjs: '',
    };
  }

  static defaultProps = {
    data: [],
    log: [],
  };

  pullProps = () => {
    this.setState({data: this.props.data, log: this.props.log});
  };

  componentDidMount = () => {
    console.log('starting...');
    this.interval = setInterval(this.pullProps, 500);
  };

  componentWillUnmount = () => {
    console.log('ending...');
    clearInterval(this.interval);
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
    const d_length = this.state.data.length;
    const l_length = this.state.log.length;
    return (
      <div className="full">
        {d_length > 0 && <SerialGraph data={this.state.data} />}
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
          <List divided inverted relaxed items={this.state.log} />
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

function withSerial(WrappedComponent, options = {}) {
  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  // Option initialization
  options.samples = options.samples || 4000;
  options.width = options.width || 400;

  const displayName = `WithSerial(${getDisplayName(WrappedComponent)})`;

  class WithSerial extends React.Component {
    constructor(props) {
      super(props);
      const now = Date.now();
      this.state = {
        ...Config.serial,
        displayName,
        start: now,
        first: '',
        last: '',
        data: [],
        log: [],
      };
    }

    componentWillMount = () => {
      //this.worker = new Worker(worker_script);
      this.conn = new WebSocket(this.state.host);
    };

    componentDidMount = () => {
      this.openSPJS();
    };

    componentWillUnmount = () => {
      //this.worker.terminate();
      this.closeSPJS();
    };

    // TODO maybe list the actual ports which are available and only open them
    // when it is necessary to do so. calling open on open ports is not good

    openSPJS = () => {
      if (!this.conn) {
        console.log(`opening spjs - ${this.state.displayName}`);
        this.conn = new WebSocket(this.state.host);
      }

      this.setState({data: [], log: []});
      const conn = this.conn;
      conn.onmessage = e => this.handleMessage(e.data); // lower
      conn.onclose = e => console.info('Connection closed.');
      //this.openPort();
    };

    maxIndex = len => Math.max(len - options.samples, 1);

    // two categories of data: log messages from spjs, and data from the serial
    // monitor, which are stored respectively in the component's log or data.
    handleMessage = msg => {
      let json_msg;
      try {
        json_msg = JSON.parse(msg);
        json_msg.date = Date.now() - this.state.start;
      } catch (e) {
        const str_msg = `${msg} +${Date.now() - this.state.start}`;
        this.setState({log: [str_msg, ...this.state.log]});
        return;
      }

      if (json_msg.D) {
        const d = (this.first || '_') + json_msg.D;
        if (d.length < options.width) {
          //console.log(d, options);
          this.first = d;
        } else {
          let split = d.split('_');
          const last = split.pop(); // next first
          const numbers = split.map((d, i) => {
            return {V: Number(d), date: (json_msg.date + i) / 1000.0};
          });
          const joined = [].concat.apply([], [this.state.data, numbers]);
          const data = joined.slice(this.maxIndex(joined.length), -1);
          this.setState({data});
          this.first = last;
        }
      } else {
        json_msg.key = json_msg.date;
        this.setState({log: [JSON.stringify(json_msg), ...this.state.log]});
      }
    };

    handleSendSPJS = msg => {
      const conn = this.conn;
      console.log(`spjs - ${this.state.displayName} - ${msg}`);
      if (msg && conn && conn.readyState === WebSocket.OPEN) {
        conn.send(msg);
      }
    };

    closeSPJS = () => {
      console.log(`closing spjs - ${this.state.displayName}`);
      const conn = this.conn;
      conn.close();
      delete this.conn;
    };

    openPort = (port = this.state.device) => {
      return this.handleSendSPJS(`open ${port} ${this.state.baud}`);
    };

    sendPort = (msg, port = this.state.device) => {
      return this.handleSendSPJS(`send ${port} ${msg}`);
    };

    closePort = (port = this.state.device) => {
      return this.handleSendSPJS(`close ${port} ${this.state.baud}`);
    };

    clearPort = () => {
      console.log('clearing...');
      this.setState({data: []});
    };

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

const SerialMonitor = withSerial(SerialMonitorShell, {samples: 1000});

export {SerialMonitor, withSerial};
