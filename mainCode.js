const beginInPositionNum = 0;

var board = [];
var allClickableTiles = [];
for (var i = 0; i < 8; i++)
    for (var j = 0; j < 4; j++)
        allClickableTiles.push('' + i + j);

var isWhiteTurn;
var isFirstStepOfTurn;
var isGameOver;
var isBoardUpsideDown;
var isCapturePossible;
var isDoubleCapture;
var imgOnCursorSize = { height: null, width: null };

var clicked = {
    tile: null, get piece() { return getPieceByTile(this.tile); },
    prvTile: null, get prvPiece() { return getPieceByTile(this.prvTile); }
};
var imgOnCursor;

resetImgOnCursor();
creatAllImages();
resetGame();

function resetImgOnCursor() {
    imgOnCursor = document.getElementById("imgOnCursor");
    imgOnCursor.style.position = "absolute";
    imgOnCursor.style.borderRadius = "100%";
    imgOnCursor.style.visibility = "hidden";
    imgOnCursor.style.pointerEvents = "none";
    document.addEventListener("mousemove", setImgPositionOnCursor);
    ({ width: imgOnCursorSize.width, height: imgOnCursorSize.height } = imgOnCursor.getBoundingClientRect());

}

function setImgPositionOnCursor(event) {
    imgOnCursor.style.top = (event.clientY - imgOnCursorSize.height / 2) + "px";
    imgOnCursor.style.left = (event.clientX - imgOnCursorSize.width / 2) + "px";
}

function setImgOnCursorSrc(url) {
    if (url === null) {
        imgOnCursor.style.visibility = "hidden";
        return;
    }
    imgOnCursor.src = url;
    imgOnCursor.style.visibility = "visible";
}


function creatAllImages() {
    var htmlCode = "";

    for (var i = 0; i < 8; i++)
        for (var j = 0; j < 8; j++) {
            var lineOfCode;
            if ((i + j) % 2 === 0)
                lineOfCode = "<image src='Images/light-tile.jpg' width='70' height='70'> ";
            else {
                var column = Math.floor(j / 2);
                var id = "" + i + column;
                lineOfCode = `<image id='${id}' width='70' height='70';
                onmouseup='alert("yo! ${id}");'> `;
            }
            htmlCode += lineOfCode;
        }

    document.getElementById("board").innerHTML += htmlCode;
}

function flipBoard() {
    isBoardUpsideDown = !isBoardUpsideDown;
    var flipBoard = [];
    for (var i = 0; i < 8; i++) {
        flipBoard[i] = [];
        for (var j = 0; j < 4; j++)
            flipBoard[i][j] = board[7 - i][3 - j];
    }
    board = flipBoard;
    updateBoardToScreen();
}

function mouseWasReleasedOnTile(tile)
{
    //alert(tile);
    //if(!isFirstStepOfTurn)
        tileWasClicked(tile);
}

function tileWasClicked(clickedTile) {
    if (isGameOver)
        return;

    clicked.tile = clickedTile;
    var pieceOnCursor = setPieceDisplay(clicked.piece, "cut");
    var imgURL = getPieceImgSrc(pieceOnCursor, false)
    setImgOnCursorSrc(imgURL);
    executeClick();
}

function setPieceDisplay(piece, display)
{
    return piece.charAt(0)+display;
}

function getPieceImgSrc(piece, isEmptyTileValid) {
    var url = "Images/";
    var display = piece.substring(1);
    if (display === "invisible")
        return "Images/dark-tile.jpg";
    url += display + "-";

    switch (piece.charAt(0)) {
        case 'b':
            return url + "bPawn.png";
        case 'w':
            return url + "wPawn.png";
        case 'B':
            return url + "bKing.png";
        case 'W':
            return url + "wKing.png";
        default:
            if (isEmptyTileValid)
                return "Images/dark-tile.jpg";
            return null;
    }
}

function executeClick() {
    var move = isFirstStepOfTurn ?
        getFirstStepMoveLegality() :
        getSecondStepMoveLegality();
    if (move instanceof IllegalMove) {
        setImgOnCursorSrc(null);
        move.explainErrorToUser();
        if (!isDoubleCapture)
            setTurnToFirstStep();
    }
    else {
        move.executStep();
        updateBoardToScreen();
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
        var action = isCapturePossible ? "capture" : "move";
        writeDocSubTitle("Please select a piece to " + action + " with");
    }
    else
        writeDocSubTitle("Please move to a destination tile");
}

function setTurnToFirstStep() {
    if (isFirstStepOfTurn)
        return;
    setPiece(clicked.prvTile, clicked.prvPiece[0]);
    updateBoardToScreen();
    isFirstStepOfTurn = true;
}

function writeDocTitle(message) {
    document.getElementById("title").innerHTML = "<h3>" + message + "</h3>";
}

function writeDocSubTitle(message) {
    document.getElementById("title").innerHTML += message;
}


function isPieceWhite(piece) {
    var pieceColor = piece.charAt(0).toUpperCase();
    if (pieceColor === 'W')
        return true;
    if (pieceColor === 'B')
        return false;
    return "empty tile";
}

function getTypeOfPiece(piece) {
    piece = piece.charAt(0);
    if (piece === ' ')
        return "empty tile";
    return (piece === piece.toUpperCase() ? "king" : "pawn");
}

function getFirstStepMoveLegality(hypothClicked = clicked) {
    var isWhitePiece = isPieceWhite(hypothClicked.piece);
    if (isWhitePiece === "empty tile")
        return new IllegalMove("This tile is empty." +
            "\nYou need to choose a tile that contain a piece in your color.");
    if (isWhitePiece !== isWhiteTurn)
        return new IllegalMove("You can only move a piece in your color.");
    return new LegalFirstStepMove();
}

function getSecondStepMoveLegality(hypothClicked = clicked) {
    var isWhitePiece = isPieceWhite(hypothClicked.piece);
    if (isWhitePiece !== "empty tile") {
        var message = "This tile is occupied. \n";
        message += "You need to move to an empty tile.";
        return new IllegalMove(message);
    }
    return getMovementLegality(hypothClicked)
}

function getMovementLegality(hypothClicked) {
    var deltaRow, deltaColumn = Math.abs(getTileColumn(hypothClicked.tile) - getTileColumn(hypothClicked.prvTile));
    setDeltaRow();
    function setDeltaRow() {
        deltaRow = hypothClicked.tile.charAt(0) - hypothClicked.prvTile.charAt(0);
        if (getTypeOfPiece(hypothClicked.prvPiece) === "king")
            deltaRow = Math.abs(deltaRow);
        else {
            if (isWhiteTurn)
                deltaRow = -deltaRow;
            if (isBoardUpsideDown)
                deltaRow = -deltaRow;
        }
    }

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
    var tileBetween = getTileBetweenTiles(hypothClicked.tile, hypothClicked.prvTile);
    var pieceToCapture = getPieceByTile(tileBetween);
    if (pieceToCapture === ' ')
        return new IllegalMove("You can't move a double move unless you capture.");
    if (isWhiteTurn === isPieceWhite(pieceToCapture))
        return new IllegalMove("You can capture only a piece of your color.");

    return new LegalSecondStepMove(tileBetween);
}

function getTileBetweenTiles(tile1, tile2) {
    var row = avrg(tile1.charAt(0), tile2.charAt(0));
    var column = avrg(tile1.charAt(1), tile2.charAt(1)) + row % 2;

    return "" + row + column;
}

function avrg(a, b) {
    return Math.floor((parseInt(a) + parseInt(b)) / 2);
}

function getTileColumn(tile) {
    return 2 * tile.charAt(1) + 1 - tile.charAt(0) % 2;
}

function getPieceByTile(tile) {
    return board[tile.charAt(0)][tile.charAt(1)];
}

function setPiece(tile, piece) {
    board[tile.charAt(0)][tile.charAt(1)] = piece;
}

function resetGame() {
    isWhiteTurn = isFirstStepOfTurn = true;
    isGameOver = isBoardUpsideDown = isCapturePossible = isDoubleCapture = false;
    amountBlackPieces = amountWhitePieces = 12;

    setImgOnCursorSrc(null);
    writeDocTitle("White player: you start!");
    writeDocSubTitle("Please select a piece to move with");
    setBoardToStratingPosition();
    updateBoardToScreen();
    alert("Let's play checkers!");
}

function updateBoardToScreen() {
    for (let tile of allClickableTiles) {
        var piece = getPieceByTile(tile);
        var imageURL = getPieceImgSrc(piece, true);
        document.getElementById(tile).src = imageURL;
    }
}

function setBoardToStratingPosition() {
    switch (beginInPositionNum) {
        default:
            board[0] = ['b', 'b', 'b', 'b'];
            board[1] = ['b', 'b', 'b', 'b'];
            board[2] = ['b', 'b', 'b', 'b'];
            board[3] = [' ', ' ', ' ', ' '];
            board[4] = [' ', ' ', ' ', ' '];
            board[5] = ['w', 'w', 'w', 'w'];
            board[6] = ['w', 'w', 'w', 'w'];
            board[7] = ['w', 'w', 'w', 'w'];
            break;
        case 1:
            board[0] = [' ', ' ', ' ', ' '];
            board[1] = [' ', ' ', ' ', ' '];
            board[2] = ['b', ' ', ' ', ' '];
            board[3] = [' ', 'b', ' ', 'b'];
            board[4] = [' ', 'w', ' ', ' '];
            board[5] = [' ', ' ', 'w', ' '];
            board[6] = [' ', ' ', 'w', ' '];
            board[7] = [' ', ' ', ' ', ' '];
            break;
        case 2:
            board[0] = ['W', ' ', ' ', 'W'];
            board[1] = [' ', ' ', ' ', ' '];
            board[2] = [' ', 'b', ' ', ' '];
            board[3] = [' ', ' ', ' ', ' '];
            board[4] = [' ', 'w', ' ', ' '];
            board[5] = [' ', ' ', ' ', ' '];
            board[6] = [' ', ' ', ' ', ' '];
            board[7] = [' ', ' ', ' ', ' '];
            break;
    }
}

function isCapturePossibleNow(prvMovingPiece) {
    for (var i = 0; i < allClickableTiles.length; i++) {
        var hypothClicked1 = Object.create(clicked);
        hypothClicked1.tile = allClickableTiles[i];
        var legality1 = getFirstStepMoveLegality(hypothClicked1);
        if (legality1 instanceof LegalFirstStepMove)
            for (var j = 0; j < allClickableTiles.length; j++) {
                var hypothClicked2 = Object.create(clicked);
                hypothClicked2.prvTile = hypothClicked1.tile;
                hypothClicked2.tile = allClickableTiles[j];
                var legality2 = getSecondStepMoveLegality(hypothClicked2);
                if (legality2 instanceof LegalSecondStepMove && legality2.tileOfCapture !== null) {
                    //console.log(hypothClicked2);
                    //console.log(clicked);
                    if (prvMovingPiece === null || clicked.tile === hypothClicked2.prvTile)
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
            var action = isCapturePossible ? "capture" : "move";
            writeDocSubTitle("Select a piece to " + action + " with");
        }
        alert("Error!\n" + this.message);
    }
}


class LegalFirstStepMove {
    executStep() {
        clicked.prvTile = clicked.tile;
        setPiece(clicked.tile, clicked.prvPiece + "invisible");
    }
}

class LegalSecondStepMove {
    constructor(tileOfCapture) {
        this.tileOfCapture = tileOfCapture;
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
            clicked.prvTile = clicked.tile;
            setPiece(clicked.prvTile, clicked.prvPiece + "glow");
        }
    }

    executeMovementOnBoard() {
        setPiece(clicked.tile, this.crownIfNeeded(clicked.prvPiece)[0]);
        setPiece(clicked.prvTile, ' ');
        if (this.tileOfCapture !== null)
            setPiece(this.tileOfCapture, ' ');
    }

    crownIfNeeded(piece) {
        var row = clicked.tile.charAt(0);
        if (row === '0' || row === '7')
            return piece.toUpperCase();
        return piece;
    }

    isTurnOver() {
        return this.tileOfCapture === null || !isCapturePossibleNow(clicked.piece);
    }

    isNoMoreLegalMove() {
        for (var i = 0; i < allClickableTiles.length; i++) {
            var hypothClicked1 = Object.create(clicked);
            hypothClicked1.tile = allClickableTiles[i];
            var legality1 = getFirstStepMoveLegality(hypothClicked1);
            if (legality1 instanceof LegalFirstStepMove) {
                var hypothClicked2 = Object.create(clicked);
                hypothClicked2.prvTile = hypothClicked1.tile;
                for (var j = 0; j < allClickableTiles.length; j++) {
                    hypothClicked2.tile = allClickableTiles[j];
                    var legality2 = getSecondStepMoveLegality(hypothClicked2);
                    if (legality2 instanceof LegalSecondStepMove)
                        return false;
                }
            }
        }
        return true;
    }

    endTheGame() {
        isGameOver = true;
        var colorWin = isWhiteTurn ? "Black" : "White";
        writeDocTitle(colorWin + " player won!");
        writeDocSubTitle("Congratulations.");
    }
}