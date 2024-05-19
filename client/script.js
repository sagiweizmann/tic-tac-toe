const url = window.location.origin;
let socket = io.connect(url);

let myTurn = true;
let symbol;

function renderTurnMessage() {
    if (!myTurn) {
        $("#message").text("Your opponent's turn");
        $(".board button").attr("disabled", true);
    } else {
        $("#message").text("Your turn.");
        $(".board button").removeAttr("disabled");
    }
}

function makeMove(e) {
    if (!myTurn || $(this).text().length) {
        return;
    }

    const position = $(this).data("position");

    socket.emit("make.move", {
        symbol: symbol,
        position: position
    });
}

socket.on("move.made", function(data) {
    $(".board button[data-position='" + data.position + "']").text(data.symbol);
    if(data.symbol == 'X'){
        $(".board button[data-position='" + data.position + "']").css("color", "#0abab1");
    } else {
        $(".board button[data-position='" + data.position + "']").css("color", "#DAA821");
    }
    myTurn = data.symbol !== symbol;
    renderTurnMessage();
});

socket.on("game.begin", function(data) {
    symbol = data.symbol;
    myTurn = symbol === "X";
    $("#player").text("You are:" + symbol);
    renderTurnMessage();
});

socket.on("game.over", function(data) {
    if (data.result === "win") {
        $("#message").text("You won!");
        $("#message").css("color", "green");
    } else if (data.result === "lose") {
        $("#message").text("You lost.");
        $("#message").css("color", "red");
    } else {
        $("#message").text("It's a draw.");
        $("#message").css("color", "yellow");
    }
    $(".board button").attr("disabled", true);
});

socket.on("opponent.left", function() {
    $("#message").css("color", "white");
    $("#message").text("Your opponent left the game.");
    $(".board button").attr("disabled", true);
});

$(function() {
    $(".board button").attr("disabled", true); // Disable board at the beginning
    $(".board button").each(function(index) {
        $(this).data("position", index);
    });
    $(".board button").on("click", makeMove);
});
