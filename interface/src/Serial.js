import React, {Component} from 'react';
import {throttle} from 'lodash';
import {Form, List, Segment} from 'semantic-ui-react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';

import Host from './Host.js';
const serial = Host.serial;

// GENERAL SERIAL MONITOR

class SerialGraph extends Component {
  render() {
    return (
      <LineChart width={820} height={400} data={this.props.data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <XAxis
          domain={['dataMin * 0.9', 'dataMax * 1.1']}
          type="linear"
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
          alwaysShow={true}
          stroke="red"
          strokeDasharray="3 3"
        />
      </LineChart>
    );
  }
}

class SerialMonitor extends Component {
  constructor(props) {
    super(props);
    this.start = Date.now();
    this.baud = 115200;
    this.port = '/dev/cu.usbmodem1421';
    this.state = {
      value: '',
      data: [],
      log: [],
    };
  }

  handleSubmit = e => {
    e && e.preventDefault();
    let conn = this.state.conn;
    let msg = this.state.value;
    if (!conn) {
      return false;
    }
    if (!msg) {
      return false;
    }
    conn.send(msg + '\n');
    this.setState({value: ''});
    return false;
  };

  appendLog = throttle(msg => {
    try {
      let json_msg = JSON.parse(msg);
      json_msg.date = Date.now() - this.start;
      if (json_msg.D) {
        const numbers = json_msg.D.split('\r\n')
          .slice(1, -1)
          .map((d, i) => {
            return {V: Number(d), date: (json_msg.date + i * 3) / 1000.0};
          });
        console.log(json_msg);
        const joined = [...this.state.data, ...numbers];
        const start = Math.max(joined.length - 10000, 1);
        const data = joined.slice(start, -1);
        this.setState({data});
      } else {
        json_msg.key = json_msg.date;
        this.setState({log: [JSON.stringify(json_msg), ...this.state.log]});
      }
    } catch (e) {
      const str_msg = `${msg} +${Date.now() - this.start}`;
      this.setState({log: [str_msg, ...this.state.log]});
    }
  }, 100);

  startConnection = e => {
    e && e.preventDefault();
    this.setState({log: []});
    const append = this.appendLog;
    if (this.state.conn) {
      this.state.conn.close(); // reset
    }
    let conn = new WebSocket(serial);
    conn.onclose = function(evt) {
      append('Connection closed.');
    };
    conn.onmessage = function(evt) {
      append(evt.data);
    };
    this.setState({conn});
  };

  closeConnection = e => {
    e && e.preventDefault();
    const conn = this.state.conn;
    if (conn) {
      this.closePort();
      this.setState({conn: undefined});
      conn.close();
    }
  };

  handleChange = event => {
    this.setState({value: event.target.value});
  };

  openPort = e => {
    e && e.preventDefault();
    this.setState({value: `open ${this.port} ${this.baud}`}, this.handleSubmit);
  };

  sendPort = e => {
    e && e.preventDefault();
    this.setState({value: `open ${this.port} ${this.baud}`}, this.handleSubmit);
  };

  closePort = e => {
    e && e.preventDefault();
    this.setState(
      {value: `close ${this.port} ${this.baud}`},
      this.handleSubmit,
    );
  };

  componentDidMount = () => {
    this.startConnection();
  };

  componentWillUnmount = () => {
    this.closeConnection();
  };

  render() {
    return (
      <div className="full">
        {this.state.data.length > 0 && <SerialGraph data={this.state.data} />}
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Button onClick={this.openPort} content="Open" />
            <Form.Button onClick={this.closePort} content="Close" />
            <Form.Input
              action="Send"
              placeholder="serial message"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <Form.Button onClick={this.startConnection} content="Reconnect" />
          </Form.Group>
        </Form>
        <div id="log">
          data: {this.state.data.length}, messages: {this.state.log.length}
        </div>
        <Segment inverted>
          <List divided inverted relaxed items={this.state.log} />
        </Segment>
      </div>
    );
  }
}

class Serial extends Component {}

export {SerialMonitor, Serial};
