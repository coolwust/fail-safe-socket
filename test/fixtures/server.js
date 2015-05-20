'use strict';

var net = require('net');

var server = net.createServer();
server.on('listening', function () {
  process.send(server.address().port);
});
process.on('message', function () {
  server.close();
});
server.listen(0);
