//server.js
var app = require('express')();
var http = require('http').Server(app);
var router = require('./router');
var io = require('socket.io')(http);
var rsa = require('./pems/rsa');
var clients = [];

app.use('/', router);

var timeout = 5000; //连接后等待提交验证信息的超时时间
io.on('connection', function (socket){
   console.info('New client connected (id=' + socket.id + ').');

   setTimeout(function() {
      // If the socket didn't authenticate after connection, disconnect it
      if (!socket.auth) {
        console.log('Disconnecting socket '+socket.id+'');
        socket.disconnect('unauthorized');
      }
    }, timeout);

   socket.on('online',function(data){
   	console.log("The client info ："+JSON.stringify(data));
    var userId = rsa.decryptString(data.user);
    console.log('Encrypt info:'+ userId);
    socket.userId = userId;
    if (userId) {
      var client = {
        user:userId,
        socket:socket
      };
      clients.push(client);
      socket.auth = true;
    }else{
      socket.auth = false;
    }
   });
   socket.on('disconnect',function(){
         console.log('connection missing, '+socket.userId);
    });
});

setTimeout(function(){
    console.log("Send message to client1");
    //遍历找到该用户
    clients.forEach(function (client) {
       console.log(client.user);
      if (client.user == "client1") {
        //触发该用户客户端的 say 事件
        client.socket.emit('say', 'Server', 'hello client1');
      }
    });
}, 10000);

http.listen(3000, function () {
  console.log('listening on *:3000');
});
