'use strict';

var Socket = require('net').Socket;
var UpState = require('./up.js');

function FailSafeSocket(options) {
  this.options = options;
  this.socket = null;
  this.chunks = [];
  this.changeState('down');
}

function changeState(id) {
  switch (id) {
    case 'up':
      this.state = new UpState(this);
      break;
    case 'down':
      this.state = new DownState(this);
      break;
  }
}

function send(chunk) {
  this.chunks.push(chunk);
}

FailSafeSocket.prototype.changeState = changeState;
FailSafeSocket.prototype.send = send;
module.exports = FailSafeSocket;
