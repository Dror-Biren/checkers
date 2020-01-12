
let Title = {};

Title.getPlayerName = function (whitePlayer) { 
    return whitePlayer? whitePlayerName : blackPlayerName; 
}

Title.annonceGameStart = function() {
    Title.writeDocTitle(Title.getPlayerName(true) + messages.STARTING_PLAYER);
    Title.writeDocSubTitle(messages.POLITE_OPEN + messages.FIRST_STEP);
}

Title.annonceGameEnd = function() {
    Title.writeDocTitle(Title.getPlayerName(!isWhiteTurn)+messages.ANNONCE_WINNING_PLAYER);
    Title.writeDocSubTitle(messages.AFTER_WIN);
}

Title.annonceIllegalMove = function() {
    Title.writeDocTitle(Title.getPlayerName(isWhiteTurn)+messages.ERROR.INSTRUCTION);
    let message = isDoubleCapture? messages.DOUBLE_CAPTURE : Title.getFirstStepMessage();
    Title.writeDocSubTitle(message);
}

Title.writeInstructionsForNextClick = function() {
    if (isGameOver)
        return;
    
    Title.writeDocTitle(Title.getPlayerName(isWhiteTurn)+":");
    let message = isFirstStepOfTurn? Title.getFirstStepMessage() : Title.getSecondStepMessage();
    Title.writeDocSubTitle(messages.POLITE_OPEN + message);
}

Title.getFirstStepMessage = function() {
    return isCapturePossible ? messages.FIRST_STEP_WITH_CAPTURE: messages.FIRST_STEP;
}

Title.getSecondStepMessage = function() {
    return isDoubleCapture? messages.DOUBLE_CAPTURE : messages.SECOND_STEP;
}

Title.writeDocTitle = function(message) {
    document.getElementById("title").innerHTML = "<h3>" + message + "</h3>";
}

Title.writeDocSubTitle = function(message) {
    document.getElementById("title").innerHTML += message;
}