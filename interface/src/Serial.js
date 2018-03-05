import React, {Component} from 'react';
import {Form, Input, Button, List, Segment} from 'semantic-ui-react';
import {throttle} from 'lodash';
import Host from './Host.js';

// GENERAL SERIAL MONITOR

class SerialMonitor extends Component {
  constructor(props) {
    super(props);
    this.baud = 115200;
    this.port = '/dev/cu.usbmodem1421';
    this.state = {
      value: '',
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
    //msg.key = Date.now();
    this.setState({log: [msg, ...this.state.log]});
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
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Input
              placeholder="serial message"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <Form.Button content="Submit" />
            <Button onClick={this.openPort} content="Open Port" />
            <Button onClick={this.startConnection} content="Reopen WS" />
          </Form.Group>
        </Form>
        <div id="log">messages: {this.state.log.length}</div>
        <Segment inverted>
          //<List divided inverted relaxed items={this.state.log} />
        </Segment>
      </div>
    );
  }
}

export default SerialMonitor;
