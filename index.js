const beginInPositionNum = 0;
const boardHight = 8, boardWidth = 8;
const amountPiecesForPlayer = 12;

let board = [];
let allClickableTiles = [];

let isWhiteTurn;
let isFirstStepOfTurn;
let isGameOver;
let isBoardUpsideDown;

let isCapturePossible;
let isDoubleCapture;

let imgOnCursor;
let imgOnCursorSize = { height: null, width: null };

let clicked = { tile: null, prvTile: null };

class Tile {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    static getTileByString(tileString) {
        let row = tileString.charAt(0);
        let column = tileString.charAt(1);
        return board[row][column];
    }

    get htmlElementId() {
        return '' + this.row + this.column;
    }

    get realColumnOfBoard() {
        return 2 * this.column + 1 - this.row % 2;
    }

    get pieceOnTile() {
        return board[this.row][this.column];
    }

    get isEmpty() {
        return !this.pieceOnTile ;
    }

    get imageURL() {
        if (this.isEmpty)
            return "Images/dark-tile.jpg";
        return this.pieceOnTile.imageURL;
        
    }
}

const pieceDisplay = {
    NORMAL: "normal",
    GLOW: "glow",
    INVISIBLE: "invisible",
    ON_CURSOR: "onCursur",
}

class Piece {   
    constructor(isWhite, isKing = false, display = pieceDisplay.NORMAL) {
        this.isWhite = isWhite;
        this.isKing = isKing;
        this.display = display;
    }

    static copyPieceWithNewDisplay(otherPiece, newDisplay)
    {
        return new Piece(otherPiece.isWhite, otherPiece.isKing, newDisplay);
    }

    get imageURL() {
        let url = "Images/";
        switch (this.display) {
            case pieceDisplay.INVISIBLE:
                return "Images/dark-tile.jpg";
            case pieceDisplay.GLOW:
                url += "glow-";
            case pieceDisplay.ON_CURSOR:
                url += "cut-";
        }

        let pieceType = this.isWhite ? 'w' : 'b';
        if (this.isKing)
            pieceType = pieceType.toUpperCase() + "King";
        else
            pieceType += "Pawn";

        url += pieceType + ".png";
        return url;
    }


    setImgOnCursorToThis() {
        let pieceOnCursor = copyPieceWithNewDisplay(this, pieceDisplay.ON_CURSOR);
        imgOnCursor.src = pieceOnCursor.imageURL;
        imgOnCursor.style.visibility = "visible";
    }
}


initAllClickableTiles();
resetImgOnCursor();
creatAllImages();
resetGame();
//console.log(clicked);

function initAllClickableTiles() {
    for (let row = 0; row < boardHight; row++)
        for (let column = 0; column < boardHight / 2; column++) {
            allClickableTiles.push(new Tile(row, column));
        }
}

function resetImgOnCursor() {
    imgOnCursor = document.getElementById("imgOnCursor");
    imgOnCursor.style.position = "absolute";
    imgOnCursor.style.borderRadius = "100%";
    imgOnCursor.style.visibility = "hidden";
    imgOnCursor.style.pointerEvents = "none";
    document.addEventListener("mousemove", setImgPositionToCursor);
    ({ width: imgOnCursorSize.width, height: imgOnCursorSize.height } = imgOnCursor.getBoundingClientRect());
}

function setImgPositionToCursor(event) {
    imgOnCursor.style.top = (event.clientY - imgOnCursorSize.height / 2) + "px";
    imgOnCursor.style.left = (event.clientX - imgOnCursorSize.width / 2) + "px";
}


function creatAllImages() {
    let htmlCode = "";

    for (let i = 0; i < boardHight; i++)
        for (let j = 0; j < boardWidth; j++) {
            let lineOfCode;
            if ((i + j) % 2 === 0)
                lineOfCode = "<image src='Images/light-tile.jpg' width='70' height='70'> ";
            else {
                let column = Math.floor(j / 2);
                let id = "" + i + column;
                lineOfCode = `<image id='${id}' width='70' height='70';
                onclick='tileWasClicked("${id}");'> `;
            }
            htmlCode += lineOfCode;
        }

    document.getElementById("board").innerHTML += htmlCode;
}

function flipBoard() {
    isBoardUpsideDown = !isBoardUpsideDown;
    let flipBoard = [];
    for (let i = 0; i < boardHight; i++) {
        flipBoard[i] = [];
        for (let j = 0; j < boardWidth / 2; j++)
            flipBoard[i][j] = board[boardHight - 1 - i][boardWidth - 1 - j];
    }
    board = flipBoard;
    updateBoardDisplay();
}
/*
function mouseWasReleasedOnTile(tile)
{
    //alert(tile);
    //if(!isFirstStepOfTurn)
        tileWasClicked(tile);
}
*/
function tileWasClicked(clickedTileString) {
    if (isGameOver)
        return;

    //alert("yo");   
    clicked.tile = Tile.getTileByString(clickedTileString);
    
    //console.log(clicked.tile.pieceOnTile);
    if (clicked.tile.pieceOnTile) 
    // why not working: if (!clicked.tile.isEmpty) ??????????
        clicked.tile.pieceOnTile.setImgOnCursorToThis();
    executeClick();
}


function executeClick() {
    let move = isFirstStepOfTurn ?
        getFirstStepMoveLegality() :
        getSecondStepMoveLegality();
    if (move instanceof IllegalMove) {
        imgOnCursor.style.visibility = "hidden";
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

function writeInstructionsForNextClick() {
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
        writeDocSubTitle("Please move to a destination tile");
}

function setTurnToFirstStep() {
    if (isFirstStepOfTurn)
        return;
    
    clicked.prvTile.pieceOnTile = Piece.copyPieceWithNewDisplay(clicked.prvPiece, pieceDisplay.NORMAL);
    updateBoardDisplay();
    isFirstStepOfTurn = true;
}

function writeDocTitle(message) {
    document.getElementById("title").innerHTML = "<h3>" + message + "</h3>";
}

function writeDocSubTitle(message) {
    document.getElementById("title").innerHTML += message;
}


function getFirstStepMoveLegality(hypothClicked = clicked) {
    if (!hypothClicked.tile.pieceOnTile)
        return new IllegalMove("This tile is empty." +
            "\nYou need to choose a tile that contain a piece in your color.");
    if (hypothClicked.tile.pieceOnTile.isWhite !== isWhiteTurn)
        return new IllegalMove("You can only move a piece in your color.");
    return new LegalFirstStepMove();
}

function getSecondStepMoveLegality(hypothClicked = clicked) {
    if (hypothClicked.tile.pieceOnTile) 
        return new IllegalMove("This tile is occupied. \n"+
        "You need to move to an empty tile.");
    return getMovementLegality(hypothClicked)
}

function getMovementLegality(hypothClicked) {
    var deltaRow, deltaColumn = Math.abs(hypothClicked.tile.realColumn - hypothClicked.prvTile.realColumn);
    setDeltaRow();
    function setDeltaRow() {
        deltaRow = hypothClicked.tile.row - hypothClicked.prvTile.row;
        if (getTypeOfPiece(hypothClicked.prvPiece) === "king")
            deltaRow = Math.abs(deltaRow);
        else {
            if (isWhiteTurn)
                deltaRow = -deltaRow;
            if (isBoardUpsideDown)
                deltaRow = -deltaRow;
        }
    }
    alert(deltaRow);
    if (deltaRow != deltaColumn)
        return new IllegalMove("You can only move diagonally forward.");
    if (deltaRow !== 1 && deltaRow !== 2)
        return new IllegalMove("You can't move that vertical distance.");
    if (deltaColumn !== 1 && deltaColumn !== 2)
        return new IllegalMove("You can't move that horizontal distance.");

    if (deltaRow === 2)
        return getAttemptCaptureLegality(hypothClicked);

    if (isCapturePossible)
        return new IllegalMove("When you can capture, you must capture.");

    return new LegalSecondStepMove(null);
}

function getAttemptCaptureLegality(hypothClicked) {
    let tileBetween = getTileBetweenTiles(hypothClicked.tile, hypothClicked.prvTile);
    if (tileBetween.isEmpty)
        return new IllegalMove("You can't move a double move unless you capture.");
    if (isWhiteTurn === tileBetween.pieceOnTile.isWhite)
        return new IllegalMove("You can capture only a piece of your color.");

    return new LegalSecondStepMove(tileBetween);
}

function getTileBetweenTiles(tile1, tile2) {
    let row = floorAvrg(tile1.row, tile2.row);
    let column = floorAvrg(tile1.column, tile2.column) + row % 2;
    return board[row][column];
}

const floorAvrg = (a, b) => Math.floor((a + b) / 2);

function setPiece(tile, piece) {
    board[tile.row][tile.column] = piece;
}

function resetGame() {
    isWhiteTurn = isFirstStepOfTurn = true;
    isGameOver = isBoardUpsideDown = isCapturePossible = isDoubleCapture = false;
    amountBlackPieces = amountWhitePieces = amountPiecesForPlayer;

    imgOnCursor.style.visibility = "hidden";
    writeDocTitle("White player: you start!");
    writeDocSubTitle("Please select a piece to move with");
    setBoardToStratingPosition();
    updateBoardDisplay();
    alert("Let's play checkers!");
}

function updateBoardDisplay() {
    for (let tile of allClickableTiles)
        document.getElementById(tile.htmlElementId).src = tile.imageURL;
}

function setBoardToStratingPosition() {
    board[0] = [new Piece(false), new Piece(false), new Piece(false), new Piece(false)];
    board[1] = [new Piece(false), new Piece(false), new Piece(false), new Piece(false)];
    board[2] = [new Piece(false), new Piece(false), new Piece(false), new Piece(false)];
    board[3] = [null, null, null, null];
    board[4] = [null, null, null, null];
    board[5] = [new Piece(true), new Piece(true), new Piece(true), new Piece(true)];
    board[6] = [new Piece(true), new Piece(true), new Piece(true), new Piece(true)];
    board[7] = [new Piece(true), new Piece(true), new Piece(true), new Piece(true)];

    /*
    let boardInString = '';
    switch (beginInPositionNum) {
        default:
            boardInString = " b b b b" +
                            "b b b b " +
                            " b b b b" +
                            "        " +
                            "        " +
                            "w w w w " +
                            " w w w w" +
                            "w w w w ";
            break;
    }
    */
}

function isCapturePossibleNow(prvMovingPiece) {
    for (let i = 0; i < allClickableTiles.length; i++) {
        let hypothClicked1 = Object.create(clicked);
        hypothClicked1.tile = Object.assign(allClickableTiles[i]);
        let legality1 = getFirstStepMoveLegality(hypothClicked1);
        if (legality1 instanceof LegalFirstStepMove)
            for (let j = 0; j < allClickableTiles.length; j++) {
                let hypothClicked2 = Object.create(clicked);
                hypothClicked2.prvTile = Object.assign(hypothClicked1.tile);
                hypothClicked2.tile = Object.assign(allClickableTiles[j]);
                let legality2 = getSecondStepMoveLegality(hypothClicked2);
                if (legality2 instanceof LegalSecondStepMove && legality2.tileOfCapture !== null) {
                    if (prvMovingPiece === null || 
                        ((clicked.tile.row === hypothClicked2.prvTile.row) && 
                        (clicked.tile.column === hypothClicked2.prvTile.column)))
                        return true;
                }
            }
    }
    return false;
}

class IllegalMove {
    constructor(message) {
        this.message = message;
    }

    explainErrorToUser() {
        writeDocTitle((isWhiteTurn ? "White" : "Black") + " player- please try again:");
        if (isDoubleCapture)
            writeDocSubTitle("Select a destination tile");
        else {
            let action = isCapturePossible ? "capture" : "move";
            writeDocSubTitle("Select a piece to " + action + " with");
        }
        alert("Error!\n" + this.message);
    }
}


class LegalFirstStepMove {
    executStep() {
        clicked.prvTile = Object.assign(clicked.tile);
        setPiece(clicked.tile, clicked.prvPiece);
    }
}

class LegalSecondStepMove {
    constructor(tileOfCapture) {
        this.tileOfCapture = Object.assign(tileOfCapture);
    }

    executStep() {
        this.executeMovementOnBoard();
        this.setUpForNextTurn();
    }

    setUpForNextTurn() {
        if (this.isTurnOver()) {
            isCapturePossible = isDoubleCapture = false;
            isWhiteTurn = !isWhiteTurn;
            if (this.isNoMoreLegalMove())
                this.endTheGame();
            else
                isCapturePossible = isCapturePossibleNow(null);
        }
        else {
            isDoubleCapture = true;
            clicked.prvTile = Object.assign(clicked.tile);
            setPiece(clicked.prvTile, clicked.prvPiece);
        }
    }

    executeMovementOnBoard() {
        this.crownIfNeeded(clicked.prvPiece);
        setPiece(clicked.tile, clicked.prvPiece);
        setPiece(clicked.prvTile, null);
        if (this.tileOfCapture !== null)
            setPiece(this.tileOfCapture, null);
    }

    crownIfNeeded(piece) {
        let row = clicked.tile.row;
        piece.isKing = row === '0' || row === '7';
    }

    isTurnOver() {
        return this.tileOfCapture === null || !isCapturePossibleNow(clicked.piece);
    }

    isNoMoreLegalMove() {
        for (let i = 0; i < allClickableTiles.length; i++) {
            let hypothClicked1 = Object.create(clicked);
            hypothClicked1.tile = Object.assign(allClickableTiles[i]);
            let legality1 = getFirstStepMoveLegality(hypothClicked1);
            if (legality1 instanceof LegalFirstStepMove) {
                let hypothClicked2 = Object.create(clicked);
                hypothClicked2.prvTile = Object.assign(hypothClicked1.tile);
                for (let j = 0; j < allClickableTiles.length; j++) {
                    hypothClicked2.tile = Object.assign(allClickableTiles[j]);
                    let legality2 = getSecondStepMoveLegality(hypothClicked2);
                    if (legality2 instanceof LegalSecondStepMove)
                        return false;
                }
            }
        }
        return true;
    }

    endTheGame() {
        isGameOver = true;
        let colorWin = isWhiteTurn ? "Black" : "White";
        writeDocTitle(colorWin + " player won!");
        writeDocSubTitle("Congratulations.");
    }
}