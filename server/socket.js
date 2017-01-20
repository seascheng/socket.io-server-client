var rsa = require('./pems/rsa');
var clients = [];
var apiLinks = [];

var timeout = 5000; //连接后等待提交验证信息的超时时间

var onlineClient = function(socket, data){
  console.log("The client info ："+JSON.stringify(data));
  var userId = rsa.decryptString(data.user);
  console.log('Encrypt info:'+ userId);
  socket.userId = userId;
  if (userId) {
    var client = {
      user:userId,
      socket:socket
    };
    clients.push(client); //TODO::使用Redis保存连接，记得释放
    socket.auth = true;
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

exports.startSocketListen = function(io){
  io.on('connection', function (socket){
    console.info('New client connected (id=' + socket.id + ').');

    detectSocketTimer(socket);

    socket.on('online',function(data){
      onlineClient(this, data);
    });

    socket.on('disconnect',function(){
         console.log('connection missing, '+socket.userId);
    });

    socket.on('response',function(data){
        console.log('get client response, '+data);
    });
  });
}

exports.sendDataToClient = function(clientId, data, cb){
  console.log("Send message to client1");
  //遍历找到该用户
  clients.forEach(function (client) {
     console.log(client.user);
    if (client.user == "client1") {
      //触发该用户客户端的 say 事件
      // // 保存与app请求的关系
      // var apiLink = {
      //   id:'123',
      //   cb:cb
      // }
      // apiLinks.push(apiLink); //TODO::释放内存
      // data.id = '123';
      client.socket.emit('say', JSON.stringify(data));
    }
  });
}



// module.exports = {
//   startSocketListen:socketListen,
//   sendDataToClient:sendDataToClient
// }