const { PORT_WEBSOCKET } = require('../utils/constants');

module.exports = (app) => {
  // WEBSOCKET FOR NOTIFICATIONS
  const http2 = require('http').Server(app);
  const io = require('socket.io')(http2);

  io.on('connection', (socket) => {
    console.log('a user connected');
  });

  http2.listen(PORT_WEBSOCKET, () => {
    console.log(`listening on *:${PORT_WEBSOCKET}`);
  });
};
