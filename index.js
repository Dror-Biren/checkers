
let Index = {};

const beginInPositionNum = 0;
const boardHeight = 8 , boardWidth = 8;
const imgsFolderName = "Images";
const darkTileUrl = "Images/dark-tile.jpg";
const pieceImgsUrlSuffix = ".png";

let board = [];
let clicked = { tile: null, prvTile: null };

let isWhiteTurn;
let isFirstStepOfTurn;
let isGameOver;
let isBoardUpsideDown;
let isCapturePossible;
let isDoubleCapture;

let imgOnCursor;
let imgOnCursorSize = { height: 0, width: 0};



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
        CalcMoveLegality.getFirstStepMoveLegality() :
        CalcMoveLegality.getSecondStepMoveLegality();
    if (move instanceof IllegalMove) {
        if (!isDoubleCapture) {
            imgOnCursor.style.visibility = "hidden";
            document.body.style.cursor = "grab";
        }
        move.explainErrorToUser();
        if (!isDoubleCapture)
            Index.setTurnToFirstStep();
    }
    else {
        move.executStep();
        Index.updateBoardDisplay();
        if (!isDoubleCapture)
            isFirstStepOfTurn = !isFirstStepOfTurn;
        Title.writeInstructionsForNextClick();
    }
}

Index.setTurnToFirstStep = function() {
    if (isFirstStepOfTurn)
        return;

    clicked.prvTile.pieceOnTile = clicked.prvTile.pieceOnTile.copyPieceWithNewDisplay(pieceDisplay.NORMAL);
    Index.updateBoardDisplay();
    isFirstStepOfTurn = true;
}

Index.updateBoardDisplay = function() {
    for (let tile of board.flat())
        tile.htmlElement.src = tile.imageURL;
}

PrepareGame.prepareGame();

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