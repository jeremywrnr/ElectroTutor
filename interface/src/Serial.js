import React, {Component} from 'react';
import worker_script from './SerialWorker.js';
import Config from './Config.js';
import {takeRight} from 'lodash';

// Serial Monitor Base Wrapper
// This function takes a component and returns another component.
// Higher order component.

function withSerial(WrappedComponent, options = {}) {
  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  // Option initialization
  options.samples = options.samples || 4000;
  options.width = options.width || 400;
  options.delim = options.width || '_';

  const displayName = `WithSerial(${getDisplayName(WrappedComponent)})`;

  class WithSerial extends Component {
    constructor(props) {
      super(props);
      const now = Date.now();
      this.state = {
        ...Config.serial,
        displayName,
        start: now,
        firstT: '',
        firstD: '',
        last: '',
        t_stream: [],
        d_stream: [],
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
      this.setState({test: [], log: [], firstT: '', firstD: ''});
      console.log(`opening spjs - ${this.state.displayName}`);
      let conn = new WebSocket(this.state.host);
      conn.onopen = () => {
        this.listPort();
        this.openPort();
      };
      conn.onmessage = e =>
        this.postWorker({
          msg: e.data,
          delim: options.delim,
        });
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
      console.log('Clearing port data...');
      this.setState({test: [], dev: []});
    };

    // handle web-worker

    openWorker = () => {
      const worker = new Worker(worker_script);
      worker.onmessage = this.handleWorker;
      this.worker = worker;
    };

    postWorker = msg => {
      this.worker.postMessage(msg);
    };

    handleWorker = msg => {
      const fkey = Object.keys(msg.data)[0];
      const data = msg.data[fkey];
      console.log('from worker:', msg.data);
      if (data) {
        if (fkey === 'addLog') {
          this.setState({log: [data, ...this.state.log]});
        } else if (fkey === 'addPorts') {
          const ports = data;
          const log = ['ports: ' + JSON.stringify(data), ...this.state.log];
          this.setState({ports, log});
        } else if (fkey === 'addData') {
          const prev =
            msg.data_type === 'test' ? this.state.test : this.state.dev;
          this.setState({
            test: takeRight([...prev, ...data], options.samples),
          });
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
        t_stream: this.state.test,
        d_stream: this.state.dev,
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
