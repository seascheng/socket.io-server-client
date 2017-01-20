var pool = require('./mysql');

var selectSQL = 'SELECT * FROM sandaliceshop.sandalice_address WHERE id=?';
var insertSQL = 'INSERT INTO VALUES';
var updateSQL = 'UPDATE SET WHERE';


module.exports = {
	queryById: function (id, cb) {
		var id = +id; //转整数
		pool.getConnection(function(err, connection) {
			connection.query(selectSQL, id, function(err, result) {
				cb(result);
				connection.release();
			});
		});
	},
}