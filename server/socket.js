var rsa = require('./pems/rsa');
var ioreq = require("socket.io-request");
var clients = [];
var apiLinks = [];

var timeout = 5000; //连接后等待提交验证信息的超时时间

var onlineClient = function(socket, data){
  var userId = rsa.decryptString(data.user);
  socket.userId = userId;
  if (userId) {
    var client = {
      user:userId,
      socket:socket
    };
    clients.push(client); //TODO::使用Redis保存连接，记得释放
    socket.auth = true;
    console.log('Connection Established '+socket.id+'');
  }else{
    socket.auth = false;
  }
}

var detectSocketTimer = function(socket){
  setTimeout(function() {
    // If the socket didn't authenticate after connection, disconnect it
    if (!socket.auth) {
      console.log('Disconnecting socket '+socket.id+'');
      socket.disconnect('unauthorized');
    }
  }, timeout);
};


// socket开始监听
exports.startSocketListen = function(io){
  io.on('connection', function (socket){
    console.info('New client Connected, ' + socket.id);

    detectSocketTimer(socket);

    socket.on('online',function(data){
      onlineClient(this, data);
    });

    socket.on('disconnect',function(){
         console.log('Connection missing, '+socket.userId);
    });


    socket.on('response',function(data){
        console.log('Get client response, '+data);
    });
  });
}


// socket 像客户端发送数据
exports.sendDataToClient = function(clientId, data, cb){
  //遍历找到该用户
  clients.forEach(function (client) {
    console.log("Send message to " + client.user);
    if (client.user == "client1") {
      //触发该用户客户端的 say 事件
      client.socket.emit('say', JSON.stringify(data));
    }
  });
}

// socket 像客户端发送数据，并等待返回结果
exports.sendDataToClientSync = function(clientId, data, cb){
  //遍历找到该用户
  clients.forEach(function (client) {
    console.log("Send sync message to " + client.user);
    if (client.user == "client1") {
      //同步
      ioreq(client.socket).request("sync")
        .then(function(res){
          cb(JSON.parse(res));
      });
    }
  });
}



// module.exports = {
//   startSocketListen:socketListen,
//   sendDataToClient:sendDataToClient
// }