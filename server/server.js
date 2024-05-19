const http = require("http")
const express = require("express");
const app = express();
const socketIo = require("socket.io");
const fs = require("fs");

try {
    const server = http.Server(app).listen(8080);
    const io = socketIo(server);
    const clients = {};
    console.log("Server running on port 8080");
}
catch (e) {
    console.log(e);
}

