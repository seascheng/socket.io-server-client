var crypto = require("crypto");

var privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
'MIICXAIBAAKBgQC3pMvzQsO21IiLK/cBBp9BqSG77/mS0SnyPciGXn8rA5ND5MP4\n' +
'5kE9EMXeJgMFG7S7LvBAuosMDzuaSKhHoENRH3InbhCzctDNVM5tSsU7UBp8gVVE\n' +
'i4U8+fkttdwsR8oE86nNmn7LTPIoLSds0cv8xPWySgktR54Xt9VdQ6fjSQIDAQAB\n' +
'AoGAYKa/IFx3HPZmlrig201c6/XT51G5jGfBJ9kUfIOnckADdawk6A5nL3hwayae\n' +
'WEXorMtbbvW+0K4DtIOg7XGPe3JH0wQiwAzcHLTF5Tg44qLeinmd2yQ5rd/eIzGk\n' +
'C1pO2SuCbvfltsl2y8yUFoylq06Ud+xefnRpFA5a957s38ECQQDc6Wlz2czcW5V6\n' +
'rMT69dTxDWFq4IqoxmH8iY2JweP7LS0p+haxeeaEPn+leDQhDfvcAdbBzioBbIdO\n' +
'rpiuyBDdAkEA1NADcp21hCs5VHTjUN0BZ3G1Z64T6gNUhXdwyrOsVJyyx27bf4/n\n' +
'IqysGOO3ZL07ZMDdVj9iurj/W/KPyDsfXQJALYTq9bQrQjyc0GpJLGz7M7BOInei\n' +
'GqTGDANL5tbM4zSr2bpucqNrnFREeRQLqcP34Z1/Yu/YN/Lk7pGLZHhVAQJAWK9C\n' +
'8I22ahjVMFPxsu4WurQRI97QX7H5lBEdSOutQil2+1NAV51xdeq9YTXsZCfTy33v\n' +
'/xQ1IZkcmYWw04GH5QJBAK0IAbc8Ceh31Y8VVndxGqFokJNMtsF6PsoQyUHfd2VI\n' +
'jruliTbh7qz3Tcc1G4fWs+QFfomML8js1M4MgKhH7xU=\n' +
'-----END RSA PRIVATE KEY-----';

var publicKey = '-----BEGIN PUBLIC KEY-----\n' +
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3pMvzQsO21IiLK/cBBp9BqSG7\n' +
'7/mS0SnyPciGXn8rA5ND5MP45kE9EMXeJgMFG7S7LvBAuosMDzuaSKhHoENRH3In\n' +
'bhCzctDNVM5tSsU7UBp8gVVEi4U8+fkttdwsR8oE86nNmn7LTPIoLSds0cv8xPWy\n' +
'SgktR54Xt9VdQ6fjSQIDAQAB\n' +
'-----END PUBLIC KEY-----';


var encryptString = function(toEncrypt) {
    var buffer = new Buffer(toEncrypt);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

var decryptString = function(toDecrypt) {
    // console.log('需要解析的字符串：'+toDecrypt);
    try{
        var buffer = new Buffer(toDecrypt, "base64");
        var decrypted = crypto.privateDecrypt(privateKey, buffer);
        return decrypted.toString("utf8");
    }catch(err){
        return false;
    }
};

module.exports = {
    encryptString: encryptString,
    decryptString: decryptString
}