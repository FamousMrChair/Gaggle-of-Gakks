# how-to :: setup socket.io
---
## Overview
socket.io and websockets both allow 2-way communication between client and server, 
but socket.io has some extra features such as rooms

### Estimated Time Cost: .3 hrs

### Prerequisites:

- Node.js installed

1. cd into your working directory and install socket.io
    ```
    npm install socket.io
    ```
2. in your main file, initialize a server. Look through [here](https://socket.io/docs/v4/server-initialization/) for an example that fits you. I've copied some examples below for convenience. 
    socket.io only
    ```javascript
    const { Server } = require("socket.io");

    const io = new Server({ /* options */ });

    io.on("connection", (socket) => {
        // ...
    });

    io.listen(3000);
    ```
    socket.io with an http server
    ```javascript
    const { createServer } = require("http");
    const { Server } = require("socket.io");

    const httpServer = createServer();
    const io = new Server(httpServer, { /* options */ });

    io.on("connection", (socket) => {
        // ...
    });

    httpServer.listen(3000);
    ```
    socket.io with express
    ```javascript
    const express = require("express");
    const { createServer } = require("http");
    const { Server } = require("socket.io");

    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, { /* options */ });

    io.on("connection", (socket) => {
        // ...
    });

    httpServer.listen(3000);
    ```
1. Step, with
    ```
    generic code block or terminal command
    ```
   and/or...
    ```javascript
    var foo = "this that JS tho";
    ```
   and/or...
    ```python
    print("this that Python tho")
    ```
   and/or...
1. Step, with [hyperlink](https://xkcd.com)s...


### Resources
* thing1
* thing2

---

Accurate as of (last update): 2022-mm-dd

#### Contributors:  
Clyde "Thluffy" Sinclair  
Thundercleese, pd2  
Buttercup, pd7  
Blossom, pd7  
Bubbles, pd7  
Fake Grimlock, pd8  

_Note: the two spaces after each name are important! ( <--burn after reading)  _