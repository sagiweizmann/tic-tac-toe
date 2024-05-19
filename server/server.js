const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const fs = require("fs");
const { handleConnection } = require("./game");

const app = express();
const PORT = 8080;

// Set up server
const server = http.createServer(app);
const io = socketIo(server);
const clients = {};

// Serve static resources
app.use(express.static(__dirname + "/../client/"));
app.use(express.static(__dirname + "/../node_modules/"));

// Serve index.html on root request
app.get("/", (req, res) => {
    const stream = fs.createReadStream(__dirname + "/../client/index.html");
    stream.pipe(res);
});

// Handle socket connections
io.on("connection", (socket) => {
    handleConnection(socket, io, clients);
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
