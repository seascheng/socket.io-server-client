var express = require('express');
var app = express();
var router = express.Router();
var service = require('./service');
var Log = require('./log');

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'-1',
			msg: '操作失败'
		});
	} else {
		var result = {
    			code:'1',
				msg: '操作成功',
				result:ret
    		}
		res.json(result);
	}
};

router.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

router.get('/user', function(req, res){
	Log.add('Recive request, '+ JSON.stringify(req.params));
	service.queryById(req.query.id, function(result){
		jsonWrite(res, result);
	});
})

router.get('/lockcar', function(req, res){
    Log.add('Recive request, /lockcar');
    service.lockcar(req.query.user_id,req.query.room_id,req.query.community_id, function(result){
        jsonWrite(res, result);
    });
})

router.get('/unlockcar', function(req, res){
    Log.add('Recive request, /unlockcar');
    service.unlockcar(req.query.user_id,req.query.room_id,req.query.community_id, function(result){
        jsonWrite(res, result);
    });
})

router.get('/querycar', function(req, res){
    Log.add('Recive request, /querycar');
    service.querycar(req.query.user_id, req.query.room_id, req.query.community_id, function(result){
        jsonWrite(res, result);
    });
})

module.exports = router;