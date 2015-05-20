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

  function onConnect() {
    socket.removeAllListeners();
    this.context.socket = socket;
    this.context.changeState('up');
  }

  var socket = new Socket();
  socket.once('connect', onConnect.bind(this));
  socket.once('error', onError.bind(this));
  socket.connect(this.context.options.port, this.context.options.host);
}

DownState.prototype.activate = activate;
DownState.prototype.daemon = daemon;
module.exports = DownState;
