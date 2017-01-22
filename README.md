# socket.io-server-client


1.  Use soket.io as server, and socket.client as client
2.  To ensure the security of connection , after the connection established , the client sends encrypted info to server. If the client doesn't send this info or server can’t decrypte the info ,  the server would release this connection. 
3.  Use socket.io-request to sync the request and response.


Data flow ：

![](http://ok5unqopw.bkt.clouddn.com/socket-io-work-flow.png)