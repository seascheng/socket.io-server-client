var rsa = require('./pems/rsa');
var ioreq = require("socket.io-request");
var Log = require('./log');
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
    Log.add('Connection Established '+socket.id+'');
  }else{
    socket.auth = false;
  }
}

var detectSocketTimer = function(socket){
  setTimeout(function() {
    // If the socket didn't authenticate after connection, disconnect it
    if (!socket.auth) {
      Log.add('Disconnecting socket '+socket.id+'');
      socket.disconnect('unauthorized');
    }
  }, timeout);
};


// socket开始监听
exports.startSocketListen = function(io){
  io.on('connection', function (socket){
    Log.add('New client Connected, ' + socket.id);

    detectSocketTimer(socket);

    socket.on('online',function(data){
      onlineClient(this, data);
    });

    socket.on('disconnect',function(){
      Log.add('Connection missing, '+socket.userId);
    });

    socket.on('response',function(data){
      Log.add('Get client response, '+data);
    });
  });
}


// socket 向客户端发送数据
exports.sendDataToClient = function(clientId, data, cb){
  //遍历找到该用户
  clients.forEach(function (client) {
    Log.add("Send message to " + client.user);
    if (client.user == "client1") {
      //触发该用户客户端的 say 事件
      client.socket.emit('say', JSON.stringify(data));
    }
  });
}

// socket 向客户端发送数据，并等待返回结果
exports.sendDataToClientSync = function(clientId, data, cb){
  //遍历找到该用户
  var isClientExist = false;
  clients.forEach(function (client) {
    Log.add("Send sync message to " + client.user);
    if (client.user == "client1") {
      //同步
      isClientExist = true;
      data = {
        userId:'71812'
      };

      var options = {
        timeout: 10000              // request timeout (msec) 
      };

      ioreq(client.socket, options)
      .request("sync", JSON.stringify(data))
      .then(function(res){
        Log.add("Get client response, " + res);
        cb(JSON.parse(res));
        return;
      })
      .catch(function(err){
        Log.add("Get client response Error, " + err);
        var error = {
          code: 100,
          resutl: '从小区服务器请求信息失败'
        }
        cb(error);
      });

    }
  });

  if (!isClientExist) {
      var error = {
        code: 100,
        resutl: '未找到小区服务器连接'
      }
      cb(error);
  }
}
