//client.js
var io = require('socket.io-client');
var rsa = require('./pems/rsa');
var http = require("http");
var url = require("url");
var ioreq = require("socket.io-request");
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

//异步，正常的监听
socket.on('say', function (data) {
	console.log('Recevie data from server: '+data);
	var cb = function(resData){
		socket.emit('response', resData.join(""));
	}
	sendRequest(data, cb);
});

//同步，响应同步
ioreq(socket).response("sync", function(req, res){
	sendRequest("", res);
 });



function sendRequest(data, cb){
    // 目标地址
    strUrl = "http://210.51.17.150:7530/IntelligentCommunity/api/signInNew/getDaysByMonth.json?user_id=71812";
    var parse = url.parse(strUrl);

    // 待发送的数据
    var postStr = "user_id=71812";
    var options = {
        "method" : "GET",
        "host"   : parse.hostname,
        "path"   : parse.path,
        "port"   : parse.port,
        "headers": {
            "Content-Length" : postStr.length
        }
    };
    var req = http.request(options, function(res){
        res.setEncoding("utf-8");
        var resData = [];
        res.on("data", function(chunk){
            resData.push(chunk);
        }).on("end", function(){
        	console.log(resData.join(""));
        	cb(resData);
        });
    });

    req.write(postStr);
 	// data = {user:"hello",password:"world"};
	// req.write(require('querystring').stringify(data));
    req.end();
}