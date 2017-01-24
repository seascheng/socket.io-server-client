//client.js
var io = require('socket.io-client');
var ioreq = require("socket.io-request");
var config = require("./config");

var socket = io.connect(config.socketUrl, {reconnect: true});
var communityId = config.communityId;
var httpUrl = config.httpUrl;

var rsa = require('./pems/rsa');
var http = require("http");
var url = require("url");
var Log = require('./log');


// Add a connect listener
socket.on('connect', function (socket) {
	Log.add('Connected!');
	Log.add(communityId);
    var encryptCommunityId = rsa.encryptString(communityId);
    // Log.add(data);
    var data = {
    	user:encryptCommunityId
    };
    Log.add('Authentication with info, ' + JSON.stringify(data));
    this.userId = encryptCommunityId;
    this.emit('online', data);
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

 //锁车
 ioreq(socket).response("lockcar", function(req, res){
	Log.add('Recevie data from server: '+JSON.stringify(req));
	var strUrl = httpUrl+"/parking/api/lockcar";
	var method = "POST";
	var param = req;
	sendRequest(strUrl, method, param, res);
 });

//开锁
ioreq(socket).response("unlockcar", function(req, res){
	Log.add('Recevie data from server: '+JSON.stringify(req));
	var strUrl = httpUrl+"/parking/api/unlockcar";
	var method = "POST";
	var param = req;
	sendRequest(strUrl, method, param, res);
 });

//查询车辆
ioreq(socket).response("querycar", function(req, res){
	Log.add('Recevie data from server: '+JSON.stringify(req));
	var strUrl = httpUrl+"/parking/api/querycar";
	var method = "POST";
	var param = req;
	sendRequest(strUrl, method, param, res);
 });



function sendRequest(strUrl, method, param, cb){
	cb(JSON.stringify([{"carcode":"鲁FP8888","status":0},{"carcode":"鲁HP8888","status":0},{"carcode":"鲁BP8888","status":1}]));
	// try{
	// 	// 目标地址
	//     var parse = url.parse(strUrl);
	//     var options = {
	//         "method" : method,
	//         "host"   : parse.hostname,
	//         "path"   : parse.path,
	//         "port"   : parse.port,
	//         "headers": {
	//             'Content-Type': 'application/json; charset=UTF-8'
	//         }
	//     };
	//     var req = http.request(options, function(res){
	//         res.setEncoding("utf-8");
	//         var resData = [];
	//         res.on("data", function(chunk){
	//             resData.push(chunk);
	//         }).on("end", function(){
	//         	Log.add('Recevie from localhost and response to server: '+resData.join(""));
	//         	cb(resData);
	//         });
	//     });

	//     // req.write(param);
	// 	req.write(JSON.stringify(param));
	//     req.end();

	// }catch(error){

	// }
   
}