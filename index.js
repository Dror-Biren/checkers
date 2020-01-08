
let Index = {};

Index.beginInPositionNum = 0;
Index.boardHeight = 8;
Index.boardWidth = 8;

Index.board = [];

Index.isWhiteTurn;
Index.isFirstStepOfTurn;
Index.isGameOver;
Index.isBoardUpsideDown;

Index.isCapturePossible;
Index.isDoubleCapture;

Index.clicked = { tile: null, prvTile: null };

PrepareGame.prepareGame();

Index.flipBoard = function () {
    isBoardUpsideDown = !isBoardUpsideDown;
    updateBoardDisplay();
}

Index.tileWasClicked = function(clickedTileString) {
    if (isGameOver)
        return;
    //updateTilesClassName();

    clicked.tile = Tile.getTileByElementId(clickedTileString);
    if (!isDoubleCapture)
        setImgOnCursorToTileContent(clicked.tile);
    clicked.tile.enableAllTilesPointEventExceptThis();

    executeClick();
}

Index.executeClick = function() {
    let move = isFirstStepOfTurn ?
        getFirstStepMoveLegality() :
        getSecondStepMoveLegality();
    if (move instanceof IllegalMove) {
        if (!isDoubleCapture) {
            imgOnCursor.style.visibility = "hidden";
            document.body.style.cursor = "grab";
        }
        move.explainErrorToUser();
        if (!isDoubleCapture)
            setTurnToFirstStep();
    }
    else {
        move.executStep();
        updateBoardDisplay();
        if (!isDoubleCapture)
            isFirstStepOfTurn = !isFirstStepOfTurn;
        writeInstructionsForNextClick();
    }
}

Index.setTurnToFirstStep = function() {
    if (isFirstStepOfTurn)
        return;

    clicked.prvTile.pieceOnTile = clicked.prvTile.pieceOnTile.copyPieceWithNewDisplay(pieceDisplay.NORMAL);
    updateBoardDisplay();
    isFirstStepOfTurn = true;
}

Index.updateBoardDisplay = function() {
    for (let tile of board.flat())
        tile.htmlElement.src = tile.imageURL;
}


/*
function updateHtmlElementsSize() {   
    for (let tile of board.flat())
        tile.htmlElement.style.height = tile.nextEmptyTileHtmlElement.style.height = tile.htmlElement.offsetWidth+"px";
    console.log(board[0][0].htmlElement.offsetWidth);
    imgOnCursor.style.height = imgOnCursor.style.width = board[0][0].htmlElement.offsetWidth+"px";
    ({width: imgOnCursorSize.width, height: imgOnCursorSize.height } = imgOnCursor.getBoundingClientRect());
}

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