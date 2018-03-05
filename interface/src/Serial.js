import React, {Component} from 'react';
import {Form, List, Segment} from 'semantic-ui-react';
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
import Host from './Host.js';

// GENERAL SERIAL MONITOR

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

  appendLog = msg => {
    try {
      let json_msg = JSON.parse(msg);
      json_msg.date = Date.now() - this.start;
      if (json_msg.D && json_msg.D.endsWith('\n')) {
        json_msg.D = Number(json_msg.D);
        this.setState({data: [...this.state.data, json_msg]});
      } else {
        json_msg.key = json_msg.date;
        this.setState({log: [json_msg, ...this.state.log]});
      }
    } catch (e) {
      const str_msg = `${msg} + ${Date.now()} - ${this.start}`;
      this.setState({log: [str_msg, ...this.state.log]});
    }
  };

  startConnection = e => {
    e && e.preventDefault();
    this.setState({log: []});
    const append = this.appendLog;
    if (this.state.conn) {
      this.state.conn.close(); // reset
    }

    let conn = new WebSocket(Host.serial);
    conn.onclose = function(evt) {
      append('Connection closed.');
    };
    conn.onmessage = function(evt) {
      append(evt.data);
    };
    this.setState({conn});
  };

  handleChange = event => {
    this.setState({value: event.target.value});
  };

  openPort = e => {
    e && e.preventDefault();
    this.setState({value: `open ${this.port} ${this.baud}`}, this.handleSubmit);
  };

  componentWillMount() {
    this.startConnection();
  }

  render() {
    return (
      <div className="full">
        <LineChart width={800} height={400} data={this.state.data}>
          <Line type="monotone" dataKey="D" stroke=" #17a1a5" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>

        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Input
              placeholder="serial message"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <Form.Button content="Submit" />
            <Form.Button onClick={this.openPort} content="Open Port" />
            <Form.Button onClick={this.startConnection} content="Reopen WS" />
          </Form.Group>
        </Form>
        <div id="log">messages: {this.state.log.length}</div>
        <Segment inverted>
          <List divided inverted relaxed items={this.state.log} />
        </Segment>
      </div>
    );
  }
}

export default SerialMonitor;
