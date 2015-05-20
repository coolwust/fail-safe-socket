'use strict';

var ArrayStream = require('array-stream');

function UpState(context) {
  this.context = context;
}

function activate() {

  function onError() {
    this.context.changeState('down');
    this.context.socket.destroy();
  }

  this.context.socket.on('error', onError.bind(this));
  this.daemon();
}

function daemon() {

  function onError() {
    arrayStream.unpipe();
  }

  function onEnd() {
    setTimeout(daemon.bind(this), 5000);
  }

  var arrayStream = new ArrayStream(this.context.chunks);
  arrayStream.pipe(this.context.socket, { end: false });
  arrayStream.on('end', onEnd.bind(this));
  this.context.socket.once('error', onError.bind(this));
}

UpState.prototype.activate = activate;
UpState.prototype.daemon = daemon;
module.exports = UpState;

