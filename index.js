
let Index = {};

Index.flipBoard = function () {
    isBoardUpsideDown = !isBoardUpsideDown;
    Index.updateBoardDisplay();
}

Index.tileWasClicked = function(clickedTileString) {
    if (isGameOver)
        return;
    //updateTilesClassName();

    clicked.tile = Tile.getTileByElementId(clickedTileString);
    if (!isDoubleCapture)
        CursorImg.setImgOnCursorToTileContent(clicked.tile);
    clicked.tile.enableAllTilesPointEventExceptThis();

    Index.executeClick();
}

Index.executeClick = function() {
    let move = isFirstStepOfTurn ?
        CalcMoveLegality.getFirstStepMoveLegality():
        CalcMoveLegality.getSecondStepMoveLegality();
    if (move instanceof IllegalMove) {
        move.explainErrorToUser();
        if (!isDoubleCapture)
            move.setTurnToFirstStep();
    }
    else {
        move.executStep();
        Index.updateBoardDisplay();
        if (!isDoubleCapture)
            isFirstStepOfTurn = !isFirstStepOfTurn;
        Title.writeInstructionsForNextClick();
    }
}


Index.updateBoardDisplay = function() {
    for (let tile of board.flat())
        tile.htmlElement.src = tile.imageURL;
}

PrepareGame.prepareGame();

/*
function updateTilesClassName() {
    for (let tile of board.flat())
        tile.htmlElement.className = getClassNameByContent(tile.pieceOnTile);
    
    function getClassNameByContent(piece)
    {
        if (piece && piece.is)
        switch (piece)
        {
            case null:
                return "un-grabble";
            case
        }
    }
}
*/