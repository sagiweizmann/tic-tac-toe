import path from 'path';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import { handleConnection } from './game.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Set up server
const server = http.createServer(app);
const io = new Server(server);
const clients = {};

// Serve static resources
const clientPath = path.resolve(new URL('../client/', import.meta.url).pathname);
app.use(express.static(clientPath));

// Serve index.html on root request
app.get("/", (req, res) => {
    const indexPath = path.resolve(new URL('../client/index.html', import.meta.url).pathname);
    const stream = fs.createReadStream(indexPath);
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
