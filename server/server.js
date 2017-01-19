//server.js
var app = require('express')();
var http = require('http').Server(app);
var router = require('./router');
var io = require('socket.io')(http);
var clients = [];

app.use('/', router);

io.on('connection', function (socket){
   console.info('New client connected (id=' + socket.id + ').');
   socket.on('online',function(data){
   	console.log("上线信息："+JSON.stringify(data));
   	var client = {
   		user:data.user,
   		socket:this
   	};
   	clients.push(client);
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
