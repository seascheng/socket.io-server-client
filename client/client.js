//client.js
var io = require('socket.io-client');
var ioreq = require("socket.io-request");
var socket = io.connect('http://localhost:3000', {reconnect: true});

var rsa = require('./pems/rsa');
var http = require("http");
var url = require("url");
var Log = require('./log');
var communityId = 'client1';

// Add a connect listener
socket.on('connect', function (socket) {
	Log.add('Connected!');
    var data = rsa.encryptString(communityId);
    this.emit('online', {user:data});
});

socket.on('connect_error', function(error){
	Log.add('Connect_error, error:'+error);
});

socket.on('connect_timeout', function(error){
	Log.add('Connect_timeout, error:'+error);
});

socket.on('reconnecting', function(error){
	Log.add('Reconnecting...');
});

socket.on('reconnect_failed', function(error){
	Log.add('Connect_timeout, error:'+error);
});

//异步，正常的监听
socket.on('say', function (data) {
	Log.add('Recevie data from server: '+data);
	var cb = function(resData){
		socket.emit('response', resData.join(""));
	}
	sendRequest(data, cb);
});

//同步，响应同步
ioreq(socket).response("sync", function(req, res){
	Log.add('Recevie data from server: '+req);
	var data = JSON.parse(req);
	var strUrl = "http://210.51.17.150:7530/IntelligentCommunity/api/signInNew/getDaysByMonth.json?user_id="+data.userId;
	var method = "GET";
	var param = '';
	sendRequest(strUrl, method, param, res);
 });

function sendRequest(strUrl, method, param, cb){
    // 目标地址
    var parse = url.parse(strUrl);
    var options = {
        "method" : method,
        "host"   : parse.hostname,
        "path"   : parse.path,
        "port"   : parse.port,
        "headers": {
            "Content-Length" : param.length
        }
    };
    var req = http.request(options, function(res){
        res.setEncoding("utf-8");
        var resData = [];
        res.on("data", function(chunk){
            resData.push(chunk);
        }).on("end", function(){
        	Log.add('Recevie from localhost and response to server: '+resData.join(""));
        	cb(resData);
        });
    });

    req.write(param);
 	// data = {user:"hello",password:"world"};
	// req.write(require('querystring').stringify(data));
    req.end();
}