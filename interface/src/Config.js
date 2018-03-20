const Config = {
  rails: 'http://localhost:3001',
  serial: {
    host: 'ws://localhost:8989/ws',
    tester: '/dev/cu.usbmodem14221',
    device: '/dev/cu.usbmodem14211',
    baud: 38400,
  },
};

// TODO change this based on production or development

export default Config;
