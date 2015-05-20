'use strict';

var assert = require('assert');
var net = require('net');
var child_process = require('child_process');
var FailSafeSocket = require('../lib/socket.js');

describe('test init', function () {
  it('the chunks should be cached', function (done) {
    var socket = new FailSafeSocket({ port: 9999, host: 'localhost'});
    socket.activate();
    socket.send('hello world');
    socket.send('foo bar');
    assert(socket.chunks.length === 2);
    done();
  });
});

describe('test up and down', function () {
  var port;
  var child;
  beforeEach(function (done) {
    child = child_process.fork(__dirname + '/fixtures/server.js');
    child.on('message', function (message) {
      port = message;
      done();
    });
  });
  afterEach(function (done) {
    try {
      child.send('close');
    } catch (e) {
    }
    done();
  });
  it('up state should be invoked', function (done) {
    var socket = new FailSafeSocket({ port: port, host: 'localhost' });
    socket.on('up', function () {
      done();
    });
    socket.activate();
  });
  it('down state should be invoked', function (done) {
    var socket = new FailSafeSocket({ port: port, host: 'localhost' });
    var count = 3;
    socket.on('init', function () {
      count--;
    });
    socket.on('up', function () {
      count--;
      child.kill();
    });
    socket.on('down', function() {
      count--;
      assert.equal(count, 0);
      done();
    });
    socket.activate();
  });
});
