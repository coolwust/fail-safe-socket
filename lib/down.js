'use strict';

var Socket = require('net').Socket;

function DownState(context) {
  this.context = context;
}

function activate() {
  this.daemon();
}

function daemon() {
  function onError() {
    socket.destroy();
    setTimeout(daemon, 5000);
  }
  var socket = new Socket();
  socket.on('connect', function () {
    socket.removeListener('error', onError);
    this.context.socket = socket;
    this.context.changeState('up');
  });
  socket.on('error', onError);
  this.context.socket.connect(this.context.options);
}

DownState.prototype.activate = activate;
DownState.prototype.daemon = daemon;
module.exports = DownState;
