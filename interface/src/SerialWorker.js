/*eslint no-restricted-globals:0*/

// from: https://stackoverflow.com/questions/47475360

const workercode = () => {
  self.onmessage = function(e) {
    const now = Date.now();
    let data = JSON.parse(e.data);
    console.log('got', data.D);
    self.postMessage('hello');
  };
};

// Exporting code.
let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
const blob = new Blob([code], {type: 'application/javascript'});
const worker_script = URL.createObjectURL(blob);

//let split = json_msg.D.split('\r\n');
//const last = split.pop(); // next first
//split[0] = this.state.first + split[0];
//const numbers = split.map((d, i) => {
//return {V: Number(d), date: (json_msg.date + i) / 1000.0};
//});

module.exports = worker_script;
