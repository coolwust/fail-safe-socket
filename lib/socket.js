'use strict';

var EventEmitter = require('events').EventEmitter;
var Socket = require('net').Socket;
var UpState = require('./up.js');
var DownState = require('./down.js');

function FailSafeSocket(options) {
  this.options = options;
  this.socket = null;
  this.chunks = [];
  this.init = true;
}

function changeState(id) {
  switch (id) {
    case 'up':
      this.state = new UpState(this);
      this.emit('up');
      break;
    case 'down':
      this.state = new DownState(this);
      if (this.init) {
        this.emit('init');
        this.init = false;
      } else {
        this.emit('down');
      }
      break;
  }
  this.state.activate();
}

function activate() {
  this.changeState('down');
}

function send(chunk) {
  this.chunks.push(chunk);
}

var properties = {
  constructor: {
    value: FailSafeSocket,
    writable: true,
    configurable: true,
    enumerable: false
  }
};
FailSafeSocket.prototype = Object.create(EventEmitter.prototype, properties);
FailSafeSocket.prototype.changeState = changeState;
FailSafeSocket.prototype.send = send;
FailSafeSocket.prototype.activate = activate;
module.exports = FailSafeSocket;
