/*eslint no-restricted-globals:0*/

// Including a webworker in React
// from: https://stackoverflow.com/questions/47475360

const workercode = () => {
  self.onmessage = function(e) {
    const {start, msg, firstT, firstD, samples, width} = e.data;
    console.log(e.data);
    const time = Date.now() - start;
    const mstime = time / 1000.0;
    try {
      const json_msg = JSON.parse(msg);
      //const isArr = Array.isArray(json_msg);
      const keys = Object.keys(json_msg) || [];
      const data = json_msg[keys[0]];
      const fkey = keys[0];

      if (fkey === 'SerialPorts') {
        self.postMessage({addPorts: data});
      } else if (fkey === 'P') {
        let port_type;
        let d = json_msg.D;
        if (data.match(/.*211$/)) {
          d = (firstT || '_') + d;
          if (d.length < width) {
            port_type = 'addFirstT';
          } else {
            port_type = 'addTest';
            let split = d.split('_');
            const last = split.pop(); // next first
            self.postMessage({addFirstT: last});
            d = split.map(x => {
              return {data: Number(x), time: mstime}; // ms
            });
          }
        } else if (data.match(/.*221$/)) {
          d = (firstD || '_') + d;
          if (d.length < width) {
            port_type = 'addFirstD';
          } else {
            port_type = 'addDev';
            let split = d.split('_');
            const last = split.pop(); // next first
            self.postMessage({setFirstD: last});
            d = split.map(x => {
              return {data: Number(x), time: mstime}; // ms
            });
          }
        }

        let message = {};
        message[port_type] = d;
        self.postMessage(message);
      } else {
        const str_msg = JSON.stringify(json_msg) + ` +${time}`;
        self.postMessage({addLog: str_msg});
      }
    } catch (err) {
      // Non-JSON data
      //console.error(err);
      const str_msg = `${msg} +${time}`;
      self.postMessage({addLog: str_msg});
    }
  };
};

// Exporting code.
let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
const blob = new Blob([code], {type: 'application/javascript'});
const worker_script = URL.createObjectURL(blob);
module.exports = worker_script;
