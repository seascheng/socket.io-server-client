var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : '139.129.24.106',
  //host     : 'localhost',
  user     : 'root',
  password : 'root',
  port     : '3306',
  database : 'sandaliceshop'
});

module.exports = pool;
