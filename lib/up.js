'use strict';

var arrayStream = require('array-stream');

function UpState(context) {
  this.context = context;
}

function activate() {
  this.socket.on('error', function () {
    this.context.changeState('down');
    this.context.socket.destroy();
  }.bind(this));
  this.daemon();
}

function daemon() {
  var arrayStream = new ArrayStream(this.context.chunks);
  arrayStream.pipe(this.socket, { end: false });
  arrayStream.on('end', function () {
    setTimeout(send.bind(this), 5000);
  });
  this.socket.on('error', function () {
    arrayStream.unpipe();
  });
}

UpState.prototype.activate = activate;
UpState.prototype.daemon = daemon;
module.exports = UpState;

