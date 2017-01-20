//client.js
var io = require('socket.io-client');
var rsa = require('./pems/rsa');
var socket = io.connect('http://localhost:3000', {reconnect: true});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
    var data = rsa.encryptString('client1');
    this.emit('online', {user:data});
});

socket.on('connect_error', function(error){
	console.log('connect_error, error:'+error);
});

socket.on('connect_timeout', function(error){
	console.log('connect_timeout, error:'+error);
});

socket.on('reconnecting', function(error){
	console.log('reconnecting...');
});

socket.on('reconnect_failed', function(error){
	console.log('connect_timeout, error:'+error);
});


socket.on('say', function (from, msg) {
	console.log('MSG', from, ' saying ', msg);
});