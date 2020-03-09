
let Title = {};

Title.annonceGameStart = function () {
    Title.writeDocTitle(messages.STARTING_WHITE);
    Title.writeDocSubTitle(messages.POLITE_OPEN + messages.FIRST_STEP);
}

Title.annonceRegularGameEnd = function (isClientWon) {
    let status = isClientWon ? "WIN" : "LOSE"
    Title.writeDocTitle(messages[status]);
    Title.writeDocSubTitle(messages[status + "_SUB"]);
}

Title.annonceTechnicalGameEnd = function () {
    Title.writeDocTitle(messages.WIN_TECHNICALY);
    Title.writeDocSubTitle(messages.WIN_TECHNICALY_SUB);
}

Title.annonceIllegalMove = function () {
    Title.writeDocTitle(messages.CLIENT_TURN + messages.ERROR.INSTRUCTION);
    let message = isDoubleCapture ? messages.DOUBLE_CAPTURE : Title.getFirstStepMessage();
    Title.writeDocSubTitle(message);
}

Title.writeInstructionsForNextClick = function () {
    if (isGameOver)
        return;

    Title.writeDocTitle(messages.CLIENT_TURN);
    let message = isFirstStepOfTurn ? Title.getFirstStepMessage() : Title.getSecondStepMessage();
    Title.writeDocSubTitle(messages.POLITE_OPEN + message);
}

Title.getFirstStepMessage = function () {
    return isCapturePossible ? messages.FIRST_STEP_WITH_CAPTURE : messages.FIRST_STEP;
}

Title.getSecondStepMessage = function () {
    return isDoubleCapture ? messages.DOUBLE_CAPTURE : messages.SECOND_STEP;
}

Title.writeDocTitle = function (message) {
    document.getElementById("title").innerHTML = "<h3>" + message + "</h3>";
}

Title.writeDocSubTitle = function (message) {
    document.getElementById("title").innerHTML += message;
}

Title.waitingToOpponent = function (isFirstTurn) {
    //console.log(isClientTurn())

    let amountDots = 0
    recursivAnimate()

    function recursivAnimate() {
        setTimeout(() => {
            if (isGameOver)
                return
            if (isClientTurn())
                return Title.writeInstructionsForNextClick()
            Title.writeDocTitle(messages[isFirstTurn ? "STARTING_BLACK" : "OPPONENT_TURN"])
            Title.writeDocSubTitle(messages.OPPONENT_TURN_SUB(amountDots))
            amountDots = (amountDots + 1) % 5
            recursivAnimate()
        }, 300)
    }
}

Title.waitingToMatch = function () {
    let amountDots = 0
    recursivAnimate()

    function recursivAnimate() {
        setTimeout(() => {
            if (isGameStart)
                return
            Title.writeDocTitle(messages.BEFORE_GAME)
            Title.writeDocSubTitle(messages.BEFORE_GAME_SUB(amountDots))
            amountDots = (amountDots + 1) % 5
            recursivAnimate()
        }, 300)
    }

}