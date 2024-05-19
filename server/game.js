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
export default Game;
