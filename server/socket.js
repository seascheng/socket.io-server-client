var rsa = require('./pems/rsa');
var ioreq = require("socket.io-request");
var Log = require('./log');
var communitySocketDic = {};  //存放小区id和socket的对应关系
var apiLinks = [];

var timeout = 5000; //连接后等待提交验证信息的超时时间
var socket_io;

var onlineClient = function(socket, data){
  var userId = rsa.decryptString(data.user);
  socket.communityId = userId;
  if (userId) {
    communitySocketDic[userId] = socket;
    socket.auth = true;
    Log.add(socket.communityId + ': Authentication success ,connection Established.');
  }else{
    socket.auth = false;
  }
}

var detectSocketTimer = function(socket){
  setTimeout(function() {
    // If the socket didn't authenticate after connection, disconnect it
    if (!socket.auth) {
      Log.add('Authentication failed, disconnect socket '+socket.id+'');
      socket.disconnect('authentication');
    }
  }, timeout);
};


// socket开始监听
exports.startSocketListen = function(io){
  io.on('connection', function (socket){
    Log.add('Connection online, '+socket.id +' waiting for authentication');

    detectSocketTimer(socket);

    socket.on('online',function(data){
      onlineClient(this, data);
    });

    socket.on('disconnect',function(){
      delete communitySocketDic[socket.communityId];
      Log.add(socket.communityId + ': Connection offline');
    });

    socket.on('response',function(data){
      Log.add(socket.communityId + ': Get client response.');
    });
  });
}

// socket 向客户端发送数据
exports.sendDataToClient = function(clientId, data, cb){
  var client = communitySocketDic[communityId];
  if (client) {
    //触发该用户客户端的 say 事件
      client.socket.emit('say', data);
  }
}

// socket 向客户端发送数据，并等待返回结果
exports.sendDataToClientSync = function(event, communityId, data, cb){
  //遍历找到该用户
  var isClientExist = false;
  var client = communitySocketDic[communityId];
  if (client) {
    Log.add(client.communityId + ': Send sync message, '+JSON.stringify(data));
    //同步
    isClientExist = true;
    var options = {
      timeout: 10000              // request timeout (msec) 
    };

    ioreq(client, options)
    .request(event, data)
    .then(function(res){
      Log.add(client.communityId + ': Get client response, ' + res);
      cb(JSON.parse(res));
      return;
    })
    .catch(function(err){
      Log.add(client.communityId + ': Get client response Error, ' + err);
      var error = {
        code: 100,
        resutl: '从小区服务器请求信息失败'
      }
      cb(error);
    });
  }
  

  if (!isClientExist) {
      var error = {
        code: 100,
        resutl: '未找到小区服务器连接'
      }
      cb(error);
  }
}
