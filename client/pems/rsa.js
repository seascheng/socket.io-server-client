var crypto = require("crypto");

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

module.exports = {
    encryptString: encryptString
}