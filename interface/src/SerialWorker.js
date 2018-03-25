/*eslint no-restricted-globals:0*/

// Including a webworker in React
// from: https://stackoverflow.com/questions/47475360

const workercode = () => {
  self.onmessage = function(e) {
    //console.log('worker got:', e.data);
    const {msg, delim} = e.data;
    try {
      const json_msg = JSON.parse(msg);
      const keys = Object.keys(json_msg) || [];
      const data = json_msg[keys[0]];
      const fkey = keys[0];
      if (fkey === 'SerialPorts') {
        self.postMessage({addPorts: data});
      } else if (fkey === 'P') {
        const data_port = data.match(/.*211$/) ? 'test' : 'dev';
        const stream = json_msg.D.split(delim)
          .filter(s => s.length >= 4)
          .map(Number)
          .filter(x => !isNaN(x));
        if (stream.length > 0) {
          //console.log('worker sends:', stream);
          self.postMessage({addData: stream, data_port});
        }
      } else {
        const str_msg = JSON.stringify(json_msg);
        self.postMessage({addLog: str_msg});
      }
    } catch (err) {
      // Non-JSON data
      //console.error(err);
      self.postMessage({addLog: msg});
    }
  };
};

// Exporting code.
let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
const blob = new Blob([code], {type: 'application/javascript'});
const worker_script = URL.createObjectURL(blob);
module.exports = worker_script;
