var pool = require('./mysql');
var socket = require('./socket');
var Log = require('./log');

var selectSQL = 'SELECT * FROM sandaliceshop.sandalice_address WHERE id=?';
// var insertSQL = 'INSERT INTO VALUES';
// var updateSQL = 'UPDATE SET WHERE';
var selectUserCar = 'select * from sandalice_user_plate where userId= ? and communityId = ?';
var lockUserCar = 'update sandalice_user_plate set status = 1 where userId= ? and communityId = ?';//锁车
var unlockUserCar = 'update sandalice_user_plate set status = 0 where userId= ? and communityId = ?';//解锁车


var convertResult = function(result){
	if (result.length == 1) {
		var rec = result[0];
		var plate = rec.plate;
		var carCodeArray = plate.split(',');
		var newResult = [];
		carCodeArray.forEach(function(carCode){
			var car = {
				"carcode":carCode
			}
			newResult.push(car);
		})
		return newResult;
		// console.log(JSON.stringify(newResult));
	}
}

module.exports = {
	queryById: function (id, cb) {
		var id = +id; //转整数
		pool.getConnection(function(err, connection) {
			connection.query(selectSQL, id, function(err, result) {
				// socket.sendDataToClient('clientId', {data:'123'}, cb); //向客户端发送数据
				socket.sendDataToClientSync('client'+id, {userId:'71812'}, cb); //向客户端发送数据
				connection.release();
			});
		});
	},
    lockcar: function (user_id, room_id, community_id, cb) {
        var userId = +user_id; //转整数
		var roomId = +room_id; //转整数
        var communityId = +community_id; //转整数
        pool.getConnection(function(err, connection) {
            connection.query(selectUserCar, [userId,communityId], function(err, result) {
				var data = convertResult(result);
                socket.sendDataToClientSync('lockcar', communityId, data, cb); //向客户端发送数据
                connection.release();
            });
        });
    },
    unlockcar: function (user_id,room_id,community_id, cb) {
        var user_id = +user_id; //转整数
        var room_id = +room_id; //转整数
        var community_id = +community_id; //转整数
        pool.getConnection(function(err, connection) {
            connection.query(selectUserCar, [userId,communityId], function(err, result) {
                console.log(result);
                var data = convertResult(result);
                socket.sendDataToClientSync('unlockcar', communityId, data, cb); //向客户端发送数据
                connection.release();
            });
        });
    }
}