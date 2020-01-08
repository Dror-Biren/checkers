let MoveClasses = {};

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
        clicked.tile.pieceOnTile.display = pieceDisplay.INVISIBLE;
       // console.log(imgOnCursor.style.cursor);
        //imgOnCursor.style.cursor = "grabbing";
        document.body.style.cursor = "grabbing";
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
        {
            imgOnCursor.style.visibility = "hidden";
            document.body.style.cursor = "grab";
        }
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
            setImgOnCursorToTileContent(clicked.tile);
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

MoveClasses.isCapturePossibleNow = function(tileOfPrvCapturingPiece = null) {
    let allLegalMove = getAllLegalMoveArr();
    for (let move of allLegalMove)
        if (move.tileOfCapture !== null)
            if (!tileOfPrvCapturingPiece || 
                move.hypothClicked.prvTile == tileOfPrvCapturingPiece)
                return true;
    return false;
}

MoveClasses.getAllLegalMoveArr = function() {
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