//server.js
var app = require('express')();
var http = require('http').Server(app);
var router = require('./router');
var io = require('socket.io')(http);
var socket = require('./socket');
var Log = require('./log');

app.use('/', router);
socket.startSocketListen(io);

http.listen(3000, function () {
  Log.add('Server listening on *:3000');
});
