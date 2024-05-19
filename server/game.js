let players = {};
let unmatched;

class Game {
    constructor() {
        this.board = Array(9).fill(null); // Board represented as a 1D array
        this.turn = "X";
    }

    makeMove(position, symbol) {
        if (this.board[position] || this.turn !== symbol) {
            return false;
        }
        this.board[position] = symbol;
        this.turn = symbol === "X" ? "O" : "X";
        return true;
    }

    checkWin() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return true;
            }
        }
        return false;
    }

    isBoardFull() {
        return this.board.every(cell => cell);
    }
}

function join(socket) {
    const newPlayer = {
        opponent: unmatched,
        symbol: "X",
        socket: socket,
        game: unmatched ? players[unmatched].game : new Game()
    };

    players[socket.id] = newPlayer;

    if (unmatched) {
        players[socket.id].symbol = "O";
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}

function getOpponent(socket) {
    if (!players[socket.id].opponent) {
        return null;
    }
    return players[players[socket.id].opponent].socket;
}

function handleDisconnect(socket,clients) {
    delete clients[socket.id];
    socket.broadcast.emit("clientdisconnect", socket.id);
}

function handleConnection(socket, io, clients) {
    console.log("New client connected. ID: ", socket.id);
    clients[socket.id] = socket;

    socket.on("disconnect", () => {
        console.log("Client disconnected. ID: ", socket.id);
        handleDisconnect(socket,clients);
    });

    join(socket);

    if (getOpponent(socket)) {
        socket.emit("game.begin", { symbol: players[socket.id].symbol });
        getOpponent(socket).emit("game.begin", { symbol: players[getOpponent(socket).id].symbol });
    }

    socket.on("make.move", (data) => {
        const game = players[socket.id].game;
        if (game.makeMove(data.position, data.symbol)) {
            socket.emit("move.made", data);
            getOpponent(socket).emit("move.made", data);

            if (game.checkWin()) {
                socket.emit("game.over", { result: "win" });
                getOpponent(socket).emit("game.over", { result: "lose" });
            } else if (game.isBoardFull()) {
                socket.emit("game.over", { result: "draw" });
                getOpponent(socket).emit("game.over", { result: "draw" });
            }
        }
    });

    socket.on("disconnect", function() {
        if (getOpponent(socket)) {
            getOpponent(socket).emit("opponent.left");
        }
    });
}

module.exports = { handleConnection };
