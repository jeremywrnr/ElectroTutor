const Config = {
  rails: 'http://localhost:3001',
  serial: {
    host: 'ws://localhost:8989/ws',
    port: '/dev/cu.usbmodem1421',
    baud: 115200,
  },
};

// TODO change this based on production or development

export default Config;
