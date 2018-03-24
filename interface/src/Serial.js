import React, {Component} from 'react';
import worker_script from './SerialWorker.js';
import Config from './Config.js';

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
        test: [],
        dev: [],
        log: [],
      };
    }

    maxIndex = len => Math.max(len - options.samples, 1);

    componentWillMount = () => {
      this.openWorker();
    };

    componentDidMount = () => {
      this.openSPJS();
    };

    componentWillUnmount = () => {
      this.closeWorker();
      this.closeSPJS();
    };

    // TODO maybe list the actual ports which are available and only open them
    // when it is necessary to do so. calling open on open ports is not good

    openSPJS = () => {
      this.closeSPJS();
      this.setState({data: [], log: [], firstT: '', firstD: ''});
      console.log(`opening spjs - ${this.state.displayName}`);
      let conn = new WebSocket(this.state.host);
      conn.onopen = () => this.listPort();
      conn.onclose = e => console.info('Connection closed.');
      conn.onmessage = e =>
        this.postWorker({
          ...options,
          msg: e.data,
          start: this.state.start,
          firstT: this.state.firstT,
          firstD: this.state.firstD,
        });
      this.conn = conn;
    };

    // two categories of data: log messages from spjs, and data from the serial
    // monitor, which are stored respectively in the component's log or data.
    handleSPJSMessage = msg => {
      console.log(msg);
    };

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
      console.log('from worker:', msg.data);
      const fkey = Object.keys(msg.data)[0];
      const data = msg.data[fkey];
      if (data) {
        if (fkey === 'addLog') {
          this.setState({log: [data, ...this.state.log]});
        } else if (fkey === 'addTest') {
          const join = [...this.state.test, ...data];
          const test = join.slice(this.maxIndex(join.length), -1);
          this.setState({test});
        } else if (fkey === 'addDev') {
          const join = [...this.state.dev, ...data];
          const dev = join.slice(this.maxIndex(join.length), -1);
          this.setState({dev});
        } else if (fkey === 'addFirstT') {
          this.setState({firstT: data});
        } else if (fkey === 'addFirstD') {
          this.setState({firstD: data});
        }
      }
    };

    closeWorker = () => {
      this.worker.terminate();
    };

    render() {
      const wProps = {
        openSPJS: this.openSPJS,
        sendSPJS: this.handleSendSPJS,
        openPort: this.openPort,
        sendPort: this.sendPort,
        closePort: this.closePort,
        clearPort: this.clearPort,
        test: this.state.test,
        dev: this.state.dev,
        log: this.state.log,
      };

      return <WrappedComponent {...wProps} {...this.props} />;
    }
  }

  // #convention-pass-unrelated-props-through-to-the-wrapped-component
  WithSerial.displayName = displayName;
  return WithSerial;
}

// HOOK SERIAL MONITOR INTERFACE INTO SPJS WEBSOCKETS

export {withSerial};
