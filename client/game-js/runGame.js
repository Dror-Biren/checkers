let RunGame = {};

RunGame.flipBoard = function () {
    isBoardUpsideDown = !isBoardUpsideDown;
    RunGame.updateBoardDisplay();
}

RunGame.tileWasClicked = function (row, column) {
    if (isGameOver)
        return;

    if (!isClientTurn())
        return alert(messages.ERROR.NOT_CLIENT_TURN)

    RunGame.tileWasClickedInCorrectTime(row, column)
}

RunGame.tileWasClickedInCorrectTime = function (row, column) {
    clicked.tile = Tile.getTileByPosition(row, column);

    if (!isDoubleCapture)
        CursorImg.setImgOnCursorToTileContent(clicked.tile);
    clicked.tile.enableAllTilesPointEventExceptThis();

    RunGame.executeClick();
}

RunGame.executeClick = function () {
    let move = isFirstStepOfTurn ?
        CalcMoveLegality.getFirstStepMoveLegality() :
        CalcMoveLegality.getSecondStepMoveLegality();
    if (move instanceof IllegalMove) {
        if (isClientTurn())
            move.explainErrorToUser();
        if (!isDoubleCapture)
            move.setTurnToFirstStep();
    }
    else
        RunGame.executeLegalClick(move)
}

RunGame.executeLegalClick = function (move) {
    if (!isFirstStepOfTurn && isClientTurn()) {
        Communication.emitMove();
        Title.waitingToOpponent();
    }

    move.executStep();
    RunGame.updateBoardDisplay();

    if (!isDoubleCapture)
        isFirstStepOfTurn = !isFirstStepOfTurn;
    else
        Title.writeInstructionsForNextClick();
}


RunGame.updateBoardDisplay = function () {
    for (let tile of board.flat())
        tile.htmlElement.src = tile.imageURL;
}

RunGame.endTheGame = function (isTechnical) {
    isGameOver = true

    let isClientWon = isTechnical || !isClientTurn()
    if (isTechnical)
        Title.annonceTechnicalGameEnd()
    else
        Title.annonceRegularGameEnd(isClientWon)

    Communication.emitEndGame(isClientWon)
}

PrepareGame.prepareGame()
identifiedToken((user) => {
    client = user
    Communication.emitEnterGamePage()
})



