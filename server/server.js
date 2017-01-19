//server.js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = [];

io.on('connection', function (socket){
    console.info('New client connected (id=' + socket.id + ').');
 //    clients.push(socket);
 //     // When socket disconnects, remove it from the list:
	// socket.on('disconnect', function() {
	//     var index = clients.indexOf(socket);
	//     if (index != -1) {
	//         clients.splice(index, 1);
	//         console.info('Client gone (id=' + socket.id + ').');
	//     }
	// });

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
