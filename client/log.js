var fs = require('fs')

var getLogBaseInfo = function(){
	var time = new Date().toISOString().
			replace(/T/, ' ').      // replace T with a space
  			replace(/\..+/, '');     // delete the dot and everything after
  	var tmpArray = time.split(' ');
  	return {
  		fileName: tmpArray[0]+'.log',
  		logTime : tmpArray[1]
  	}
};

exports.add = function(msg){
	var logBaseInfo = getLogBaseInfo();
	var logFileName = './logs/'+logBaseInfo.fileName;
	var logMsg = logBaseInfo.logTime + '   ' + msg +'\n';
	console.log(logMsg);
	fs.appendFile(logFileName, logMsg, 'utf8', function(err){
		if (err) {
			console.error(err);
		}
	})
}