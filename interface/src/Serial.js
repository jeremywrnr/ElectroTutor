import React, {Component} from 'react';
import worker_script from './SerialWorker.js';
import Config from './Config.js';
import {throttle, takeRight} from 'lodash';

// Serial Monitor Base Wrapper
// This function takes a component and returns another component.
// Higher order component.

function withSerial(WrappedComponent, options = {}) {
  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  // Option initialization
  options.port = options.port || Config.serial.tester;
  options.samples = options.samples || 1000;
  options.delim = options.delim || '_';

  const displayName = `WithSerial(${getDisplayName(WrappedComponent)})`;

  class WithSerial extends Component {
    constructor(props) {
      super(props);
      const now = Date.now();
      this.state = {
        displayName,
        start: now,
        stream: [],
        log: [],
      };
    }

    componentWillUnmount = () => {
      this.closeWorker();
      this.closeSPJS();
    };

    openSPJS = () => {
      this.closeSPJS();
      this.closePort();
      this.openWorker();
      this.setState({stream: [], log: []});
      console.log(`opening spjs - ${this.state.displayName}`);
      let conn = new WebSocket(Config.serial.host);
      conn.onopen = () => {
        this.listPort();
        this.openPort();
      };
      conn.onmessage = throttle(this.postWorker, 50);
      conn.onclose = e => console.info('Connection closed.');
      this.conn = conn;
    };

    // two categories of data: log messages from spjs, and data from the serial
    // monitor, which are stored respectively in the component's log or data.

    handleSendSPJS = msg => {
      const conn = this.conn || {};
      console.log(`spjs - ${this.state.displayName} - ${msg}`);
      if (msg && conn.readyState === WebSocket.OPEN) {
        conn.send(msg);
      }
    };

    closeSPJS = () => {
      console.log(`closing spjs - ${this.state.displayName}`);
      if (this.conn) {
        this.conn.close();
        delete this.conn;
      }
    };

    listPort = () => {
      return this.handleSendSPJS(`list`);
    };

    openPort = (port = options.port) => {
      return this.handleSendSPJS(`open ${port} ${Config.serial.baud}`);
    };

    sendPort = (msg, port = options.port) => {
      return this.handleSendSPJS(`send ${port} ${msg}`);
    };

    closePort = (port = options.port) => {
      return this.handleSendSPJS(`close ${port} ${Config.serial.baud}`);
    };

    clearPort = () => {
      console.log('Clearing port data...');
      this.setState({stream: []});
    };

    // handle web-worker

    openWorker = () => {
      const worker = new Worker(worker_script);
      worker.onmessage = this.handleWorker;
      this.worker = worker;
    };

    postWorker = msg => {
      console.log(msg);
      if (this.worker) {
        this.worker.postMessage({
          msg: msg.data,
          delim: options.delim,
          port: options.port,
        });
      }
    };

    handleWorker = msg => {
      const fkey = Object.keys(msg.data)[0];
      const data = msg.data[fkey];
      if (data) {
        if (fkey === 'addLog') {
          this.setState({log: [data, ...this.state.log]});
        } else if (fkey === 'addPorts') {
          const ports = data;
          const log = ['ports: ' + JSON.stringify(data), ...this.state.log];
          this.setState({ports, log});
        } else if (fkey === 'addData') {
          const {stream} = this.state;
          const new_data = takeRight([...stream, ...data], options.samples);
          this.setState({stream: new_data});
        }
      }
    };

    closeWorker = () => {
      if (this.worker) {
        this.worker.terminate();
      }
    };

    render() {
      const wProps = {
        openSPJS: this.openSPJS,
        sendSPJS: this.handleSendSPJS,
        openPort: this.openPort,
        sendPort: this.sendPort,
        closePort: this.closePort,
        clearPort: this.clearPort,
        stream: this.state.stream,
        log: this.state.log,
      };

      return <WrappedComponent {...wProps} {...this.props} />;
    }
  }

  // #convention-pass-unrelated-props-through-to-the-wrapped-component
  WithSerial.displayName = displayName;
  return WithSerial;
}

export {withSerial};
