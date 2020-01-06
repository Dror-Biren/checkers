const beginInPositionNum = 0;
const boardHeight = 8, boardWidth = 8;

let board = [];

let isWhiteTurn;
let isFirstStepOfTurn;
let isGameOver;
let isBoardUpsideDown;

let isCapturePossible;
let isDoubleCapture;

let imgOnCursor;
let imgOnCursorSize = { height: 0, width: 0};

let clicked = { tile: null, prvTile: null };

class Tile {
    constructor(row, column, pieceOnTile) {
        this.row = row;
        this.column = column;
        this.pieceOnTile = pieceOnTile;
    }

    static getTileByElementId(idString) {
        let row = idString.charAt(0);
        let column = idString.charAt(1);
        if (isBoardUpsideDown) {
            row = boardHeight - 1 - row;
            column = boardWidth / 2 - 1 - column;
        }
        return board[row][column];
    }

    enableAllTilesPointEventExceptThis()
    {
        for (let tile of board.flat())
        {
            let pointEventStatus = (tile === this? "none" : "auto");
            tile.htmlElement.style.pointerEvents = pointEventStatus;
        }
    }

    get htmlElement() {
        let displayRow = this.row, displayColumn = this.column;
        if (isBoardUpsideDown) {
            displayRow = boardHeight - 1 - displayRow;
            displayColumn = boardWidth / 2 - 1 - displayColumn;
        }
        return document.getElementById('' + displayRow + displayColumn);
    }

    /*
    get nextEmptyTileHtmlElement() {
        return document.getElementById('empty-' + this.row + this.column);
    }
    */

    get realColumnOfBoard() {
        return 2 * this.column + 1 - this.row % 2;
    }

    get isEmpty() {
        return this.pieceOnTile == null;
    }

    get imageURL() {
        if (this.isEmpty)
            return "Images/dark-tile.jpg";
        return this.pieceOnTile.imageURL;

    }

    setImgOnCursorToTileContent() {
        //console.log("change cursor img");
        if (this.isEmpty)
        {
            imgOnCursor.style.visibility = "hidden";
            return;
        }
        let pieceOnCursor = Piece.copyPieceWithNewDisplay(this.pieceOnTile, pieceDisplay.ON_CURSOR);
        imgOnCursor.src = pieceOnCursor.imageURL;
        imgOnCursor.style.visibility = "visible";
        updateImgOnCursorSize();      
    }
}

const pieceDisplay = {
    NORMAL: "normal",
    //GLOW: "glow",
    INVISIBLE: "invisible",
    ON_CURSOR: "onCursur",
}

class Piece {
    constructor(isWhite, isKing = false, display = pieceDisplay.NORMAL) {
        this.isWhite = isWhite;
        this.isKing = isKing;
        this.display = display;
    }

    static copyPieceWithNewDisplay(otherPiece, newDisplay) {
        return new Piece(otherPiece.isWhite, otherPiece.isKing, newDisplay);
    }

    get imageURL() {
        let url = "Images/";
        switch (this.display) {
            case pieceDisplay.INVISIBLE:
                return "Images/dark-tile.jpg";
            /* case pieceDisplay.GLOW:
                url += "glow-"; */
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
}

resetImgOnCursor();
creatAllImages();
resetGame();
updateImgOnCursorSize();

/*
function updateHtmlElementsSize() {
    
    for (let tile of board.flat())
        tile.htmlElement.style.height = tile.nextEmptyTileHtmlElement.style.height = tile.htmlElement.offsetWidth+"px";
    console.log(board[0][0].htmlElement.offsetWidth);
    imgOnCursor.style.height = imgOnCursor.style.width = board[0][0].htmlElement.offsetWidth+"px";
    ({width: imgOnCursorSize.width, height: imgOnCursorSize.height } = imgOnCursor.getBoundingClientRect());
}
*/

function resetImgOnCursor() {
    //imgOnCursor = document.getElementById("board").querySelector("#imgOnCursor");
    imgOnCursor = document.getElementById("imgOnCursor");
    //console.log(imgOnCursor);
    imgOnCursor.style.position = "absolute";
    imgOnCursor.style.borderRadius = "100%";
    imgOnCursor.style.visibility = "hidden";
    imgOnCursor.style.pointerEvents = "none";
    document.addEventListener("mousemove", setImgPositionToCursor);
    document.addEventListener("mousedown", setImgPositionToCursor);
}

function setImgPositionToCursor(event) {
    imgOnCursor.style.top = (event.clientY - imgOnCursorSize.height / 2) + "px";
    imgOnCursor.style.left = (event.clientX - imgOnCursorSize.width / 2) + "px";
}

function updateImgOnCursorSize()
{
    imgOnCursor.style.height = imgOnCursor.style.width = board[0][0].htmlElement.offsetWidth+"px";
    ({width: imgOnCursorSize.width, height: imgOnCursorSize.height } = imgOnCursor.getBoundingClientRect());
}

function creatAllImages() {
    let htmlCode = "";

    for (let row = 0; row < boardHeight; row++)
        for (let column = 0; column < boardWidth; column++) {
            let lineOfCode = `<img style="float: left" width='' height='' `;

            let columnInDataStruct = Math.floor(column / 2);
            let id = '' + row + columnInDataStruct;
            if ((row + column) % 2 === 0)
                lineOfCode += `id='empty-${id}' src='Images/light-tile.jpg' > `;
            else {
                lineOfCode += `id='${id}' onmousedown='tileWasClicked("${id}")';
                onmouseup='tileWasClicked("${id}");'> `;
            }
            htmlCode += lineOfCode;
        }

    document.getElementById("board").innerHTML += htmlCode;
}

function flipBoard() {
    isBoardUpsideDown = !isBoardUpsideDown;
    updateBoardDisplay();
}

function tileWasClicked(clickedTileString) {
    if (isGameOver)
        return;
   
    clicked.tile = Tile.getTileByElementId(clickedTileString);
    if (!isDoubleCapture)
        clicked.tile.setImgOnCursorToTileContent();
    clicked.tile.enableAllTilesPointEventExceptThis();

    executeClick();
}


function executeClick() {
    let move = isFirstStepOfTurn ?
        getFirstStepMoveLegality() :
        getSecondStepMoveLegality();
    if (move instanceof IllegalMove) {
        if (!isDoubleCapture)
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
        if (isDoubleCapture)
            writeDocSubTitle("Please capture again");
        else
            writeDocSubTitle("Please move to a destination tile");
}

function setTurnToFirstStep() {
    if (isFirstStepOfTurn)
        return;

    clicked.prvTile.pieceOnTile = Piece.copyPieceWithNewDisplay(clicked.prvTile.pieceOnTile, pieceDisplay.NORMAL);
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
        return new IllegalMove("This tile is occupied. \n" +
            "You need to move to an empty tile.");
    return getMovementLegality(hypothClicked)
}

function getMovementLegality(hypothClicked) {
    let deltaColumn = Math.abs(hypothClicked.tile.realColumnOfBoard - hypothClicked.prvTile.realColumnOfBoard);
    var deltaRow;
    setDeltaRow();
    function setDeltaRow() {
        deltaRow = hypothClicked.tile.row - hypothClicked.prvTile.row;
        if (isWhiteTurn)
            deltaRow = -deltaRow;
        if (hypothClicked.prvTile.pieceOnTile.isKing)
            deltaRow = Math.abs(deltaRow);
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


function resetGame() {
    isWhiteTurn = isFirstStepOfTurn = true;
    isGameOver = isBoardUpsideDown = isCapturePossible = isDoubleCapture = false;

    imgOnCursor.style.visibility = "hidden";
    writeDocTitle("White player: you start!");
    writeDocSubTitle("Please select a piece to move with");
    setBoardToStratingPosition();
    updateBoardDisplay();
    //alert("Let's play checkers!");
}

function updateBoardDisplay() {
    for (let tile of board.flat())
        tile.htmlElement.src = tile.imageURL;
}

function setBoardToStratingPosition() {
    let boardInCharsCode = [];
    switch (beginInPositionNum) {
        default:
            boardInCharsCode[0] = ['b', 'b', 'b', 'b'];
            boardInCharsCode[1] = ['b', 'b', 'b', 'b'];
            boardInCharsCode[2] = ['b', 'b', 'b', 'b'];
            boardInCharsCode[3] = [' ', ' ', ' ', ' '];
            boardInCharsCode[4] = [' ', ' ', ' ', ' '];
            boardInCharsCode[5] = ['w', 'w', 'w', 'w'];
            boardInCharsCode[6] = ['w', 'w', 'w', 'w'];
            boardInCharsCode[7] = ['w', 'w', 'w', 'w'];
            break;
        case 1:
            boardInCharsCode[0] = [' ', ' ', ' ', ' '];
            boardInCharsCode[1] = ['w', 'b', 'w', 'w'];
            boardInCharsCode[2] = ['w', ' ', ' ', ' '];
            boardInCharsCode[3] = [' ', ' ', ' ', ' '];
            boardInCharsCode[4] = [' ', ' ', ' ', ' '];
            boardInCharsCode[5] = [' ', 'b', 'b', ' '];
            boardInCharsCode[6] = [' ', 'w', 'w', 'b'];
            boardInCharsCode[7] = [' ', ' ', ' ', ' '];
            break;
        case 2:
            boardInCharsCode[0] = [' ', ' ', ' ', ' '];
            boardInCharsCode[1] = [' ', ' ', ' ', ' '];
            boardInCharsCode[2] = [' ', 'B', ' ', ' '];
            boardInCharsCode[3] = [' ', 'w', ' ', 'b'];
            boardInCharsCode[4] = [' ', ' ', ' ', ' '];
            boardInCharsCode[5] = [' ', ' ', 'b', ' '];
            boardInCharsCode[6] = [' ', 'w', ' ', ' '];
            boardInCharsCode[7] = [' ', ' ', ' ', ' '];
            break;
        case 3:
            boardInCharsCode[0] = [' ', ' ', ' ', 'b'];
            boardInCharsCode[1] = ['W', ' ', ' ', 'w'];
            boardInCharsCode[2] = [' ', ' ', ' ', ' '];
            boardInCharsCode[3] = [' ', ' ', 'w', ' '];
            boardInCharsCode[4] = [' ', ' ', ' ', ' '];
            boardInCharsCode[5] = [' ', 'w', ' ', ' '];
            boardInCharsCode[6] = [' ', ' ', ' ', ' '];
            boardInCharsCode[7] = [' ', ' ', ' ', ' '];
            break;
    }
    for (let row = 0; row < boardHeight; row++) {
        board[row] = [];
        for (let column = 0; column < boardWidth / 2; column++) {
            let curPiece = null;
            switch (boardInCharsCode[row][column]) {
                case 'b':
                    curPiece = new Piece(false);
                    break;
                case 'w':
                    curPiece = new Piece(true);
                    break;
                case 'B':
                    curPiece = new Piece(false, true);
                    break;
                case 'W':
                    curPiece = new Piece(true, true);
                    break;

            }
            board[row][column] = new Tile(row, column, curPiece);
        }
    }

}

function isCapturePossibleNow(tileOfPrvCapturingPiece = null) {
    let allLegalMove = getAllLegalMoveArr();
    for (let move of allLegalMove)
        if (move.tileOfCapture !== null)
            if (!tileOfPrvCapturingPiece || 
                move.hypothClicked.prvTile == tileOfPrvCapturingPiece)
                return true;
    return false;
}

function getAllLegalMoveArr() {
    let allLegalMoveArr = [];
    let flatBoard = board.flat();
    for (let i = 0; i < flatBoard.length; i++) {
        let hypothClicked1 = Object.create(clicked);
        hypothClicked1.tile = flatBoard[i];
        let legality1 = getFirstStepMoveLegality(hypothClicked1);
        if (legality1 instanceof LegalFirstStepMove)
            for (let j = 0; j < flatBoard.length; j++) {
                let hypothClicked2 = Object.create(clicked);
                hypothClicked2.prvTile = hypothClicked1.tile;
                hypothClicked2.tile = flatBoard[j];
                let legality2 = getSecondStepMoveLegality(hypothClicked2);
                if (legality2 instanceof LegalSecondStepMove)
                {
                    legality2.hypothClicked = hypothClicked2;
                    allLegalMoveArr.push(legality2);
                }
            }
    }
    return allLegalMoveArr;
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
        //clicked.tile.enableAllTilesPointEventExceptThis();
        clicked.tile.pieceOnTile.display = pieceDisplay.INVISIBLE;
        clicked.prvTile = Object.assign(clicked.tile);
        clicked.tile.pieceOnTile = clicked.prvTile.pieceOnTile;
    }
}

class LegalSecondStepMove {
    constructor(tileOfCapture) {
        this.tileOfCapture = tileOfCapture;
    }

    executStep() {
        this.executeMovementOnBoard();
        this.setUpForNextTurn();
        if (!isDoubleCapture)
            imgOnCursor.style.visibility = "hidden";
    }

    setUpForNextTurn() {
        if (this.isTurnOver()) {
            isCapturePossible = isDoubleCapture = false;
            isWhiteTurn = !isWhiteTurn;
            if (this.isNoMoreLegalMove())
                this.endTheGame();
            else
                isCapturePossible = isCapturePossibleNow();
        }
        else {
            isCapturePossible = isDoubleCapture = true;
            clicked.tile.pieceOnTile.display = pieceDisplay.INVISIBLE;
            clicked.prvTile = clicked.tile;
            clicked.tile.setImgOnCursorToTileContent();
            //clicked.tile.pieceOnTile.display = pieceDisplay.GLOW;
        }
    }

    executeMovementOnBoard() {
        this.crownIfNeeded();
        clicked.tile.pieceOnTile = clicked.prvTile.pieceOnTile;
        clicked.tile.pieceOnTile.display = pieceDisplay.NORMAL;
        clicked.prvTile.pieceOnTile = null;
        if (this.tileOfCapture !== null)
            this.tileOfCapture.pieceOnTile = null;
    }

    crownIfNeeded() {
        let row = clicked.tile.row;
        if (row == 0 || row == boardHeight - 1)
            clicked.prvTile.pieceOnTile.isKing = true;
    }

    isTurnOver() {
        return this.tileOfCapture === null || !isCapturePossibleNow(clicked.tile);
    }

    isNoMoreLegalMove() {
        return getAllLegalMoveArr().length === 0;
    }

    endTheGame() {
        isGameOver = true;
        let colorWin = isWhiteTurn ? "Black" : "White";
        writeDocTitle(colorWin + " player won!");
        writeDocSubTitle("Congratulations.");
    }
}