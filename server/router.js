var express = require('express');
var app = express();
var router = express.Router();
var door = require('./door');

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};

router.all('*', function (req, res, next) {
  console.log('Accessing the site ...');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

router.get('/user', function(req, res){
	console.log(JSON.stringify(req.params));
	door.queryById(req.query.id, function(result){
		jsonWrite(res, result);
	});
})

module.exports = router;