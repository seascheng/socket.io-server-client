///////////////////////////
// 签名验证算法
// openssl genrsa  -out server.pem 1024
// openssl req -key server.pem -new -x509 -out cert.pem
///////////////////////////

var crypto = require('crypto')
    ,fs = require('fs');

function signer(algorithm,key,data){
    var sign = crypto.createSign(algorithm);
    sign.update(data);
    sig = sign.sign(key, 'hex');
    return sig;
}

function verify(algorithm,pub,sig,data){
    var verify = crypto.createVerify(algorithm);
    verify.update(data);
    return verify.verify(pub, sig, 'hex')
}

var algorithm = 'RSA-SHA256';
var data = "abcdef";   //传输的数据
var privatePem = fs.readFileSync('./pems/rsa_private_key.pem');
var key = privatePem.toString();
var publicPem = fs.readFileSync('./pems/rsa_public_key.pem');
var pubkey = publicPem.toString();
var sig = signer(algorithm,pubkey,data); //数字签名


// exports.signer = function(data){
// 	var algorithm = 'RSA-SHA256';
// 	var key = privatePem.toString();
// 	return signer(algorithm,key,data);
// }

console.log('数据：'+data+'  签名：'+sig+'  \n结果：'+verify(algorithm,key,sig,data));         //验证数据，通过公钥、数字签名 =》是原始数据
console.log('数据：'+data+'  签名：'+sig+'  \n结果：'+verify(algorithm,key,sig,data+"2"));    //验证数据，通过公钥、数字签名  =》不是原始数据