//client.js
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: true});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
    this.emit('online', {user:'client1'});
});

socket.on('say', function (from, msg) {
	console.log('MSG', from, ' saying ', msg);
});

