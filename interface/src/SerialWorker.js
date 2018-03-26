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
      const dataParser = s => {
        const x = Number(s);
        if (isNaN(x) && s.match(/\^\S+:\S+:\S+\$/)) {
          const pkt = s
            .replace(/^\^/, '')
            .replace(/\$$/, '')
            .split(':')
            .map(Number);
          return {
            name: pkt[0],
            line: pkt[1],
            data: pkt[2],
          };
        } else if (!isNaN(x)) {
          return {data: x};
        } else {
          return null;
        }
      };

      if (fkey === 'SerialPorts') {
        self.postMessage({addPorts: data});
      } else if (fkey === 'P') {
        const stream = json_msg.D.split(delim)
          .map(x => x.trim())
          .filter(s => s.length >= 4)
          .map(dataParser)
          .filter(x => x !== null);
        if (stream.length > 0) {
          //console.log('worker sends:', stream);
          self.postMessage({addData: stream});
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
