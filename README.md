# socket.io-server-client



1.  使用soket.io作server端，使用socket.client作client端
2.  未保证连接的安全性，在建立连接后，使用rsa加密的信息作验证，超时未验证或验证失败，删除连接
3.  使用socket.io-request同步socket 请求和响应。



整体流程图：

![](http://ok5unqopw.bkt.clouddn.com/socket-io-work-flow.png)