# socket.io-server-client


1.  Use soket.io as server, and socket.client as client
2.  To ensure the security of connection , after the connection established , client sends encrypted info to server. If client doesn't send or server can’t decrypte this info, server would release this connection. 
3.  Use socket.io-request to sync the request and response.


Data flow ：

![](http://ok5unqopw.bkt.clouddn.com/socket-io-data-flow.png)