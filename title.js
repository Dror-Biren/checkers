
let Title = {};

Title.writeInstructionsForNextClick = function() {
    if (isGameOver) {
        alert("GAME-OVER");
        return;
    }

    writeDocTitle((isWhiteTurn ? "White" : "Black") + " player:");
    if (isFirstStepOfTurn) {
        let action = isCapturePossible ? "capture" : "move";
        writeDocSubTitle("Please select a piece to " + action + " with");
    }
    else
        if (isDoubleCapture)
            writeDocSubTitle("Please capture again");
        else
            writeDocSubTitle("Please move to a destination tile");
}

Title.writeDocTitle = function(message) {
    document.getElementById("title").innerHTML = "<h3>" + message + "</h3>";
}

Title.writeDocSubTitle = function(message) {
    document.getElementById("title").innerHTML += message;
}