const http = require("http");
const express = require("express");
const app = express();
const socketIo = require("socket.io");
const fs = require("fs");
const { handleConnection } = require("./game");

let io;
const clients = {};

try {
    const server = http.Server(app).listen(8080);
    io = socketIo(server);
    console.log("Server running on port 8080");
} catch (e) {
    console.log(e);
}

// Serve static resources
app.use(express.static(__dirname + "/../client/"));
app.use(express.static(__dirname + "/../node_modules/"));

app.get("/", (req, res) => {
    const stream = fs.createReadStream(__dirname + "/../client/index.html");
    stream.pipe(res);
});

io.on("connection", (socket) => {
    handleConnection(socket, io, clients);
});
