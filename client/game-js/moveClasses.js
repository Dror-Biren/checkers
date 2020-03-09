let MoveClasses = {};

class IllegalMove {
    constructor(message) {
        this.message = message;
    }

    explainErrorToUser() {
        Title.annonceIllegalMove();
        alert(messages.ERROR.ALERT_START + this.message);
    }

    setTurnToFirstStep = function() {
        imgOnCursor.style.visibility = "hidden";
        prvMovingPiece.display = pieceDisplay.GLOW;
        if (isFirstStepOfTurn)
            return;
     
        document.body.style.cursor = "grab";    
        clicked.prvTile.pieceOnTile = 
            clicked.prvTile.pieceOnTile.copyPieceWithNewDisplay(pieceDisplay.NORMAL);
        RunGame.updateBoardDisplay();
        isFirstStepOfTurn = true;
    }
}

class LegalFirstStepMove {
    executStep() {
        if (prvMovingPiece)
            prvMovingPiece.display = pieceDisplay.NORMAL;
        prvMovingPiece = clicked.tile.pieceOnTile
        clicked.tile.pieceOnTile.display = pieceDisplay.INVISIBLE;
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
        if (!isDoubleCapture || !isClientTurn()) {
            imgOnCursor.style.visibility = "hidden";
            document.body.style.cursor = "grab";
        }
    }

    executeMovementOnBoard() {
        this.crownIfNeeded();
        clicked.tile.pieceOnTile = clicked.prvTile.pieceOnTile.copyPieceWithNewDisplay(pieceDisplay.GLOW);
        clicked.prvTile.pieceOnTile = null;
        if (this.tileOfCapture !== null)
            this.tileOfCapture.pieceOnTile = null;
    }

    setUpForNextTurn() {
        if (this.isTurnOver()) {
            prvMovingPiece = clicked.tile.pieceOnTile;
            isCapturePossible = isDoubleCapture = false;
            isWhiteTurn = !isWhiteTurn;
            if (this.isNoMoreLegalMove())
                RunGame.endTheGame();
            else
                isCapturePossible = MoveClasses.isCapturePossibleNow();
        }
        else {
            isCapturePossible = isDoubleCapture = true;
            if (isClientTurn())
                clicked.tile.pieceOnTile.display = pieceDisplay.INVISIBLE;
            clicked.prvTile = clicked.tile;
            CursorImg.setImgOnCursorToTileContent(clicked.tile);
            //clicked.tile.pieceOnTile.display = pieceDisplay.GLOW;
        }
    }

    crownIfNeeded() {
        let row = clicked.tile.row;
        if (row == 0 || row == boardHeight - 1)
            clicked.prvTile.pieceOnTile.isKing = true;
    }

    isTurnOver() {
        return this.tileOfCapture === null || !MoveClasses.isCapturePossibleNow(clicked.tile);
    }

    isNoMoreLegalMove() {
        return MoveClasses.getAllLegalMoveArr().length === 0;
    }
}

MoveClasses.isCapturePossibleNow = function(tileOfPrvCapturingPiece = null) {
    let allLegalMove = MoveClasses.getAllLegalMoveArr();
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
        let legality1 = CalcMoveLegality.getFirstStepMoveLegality(hypothClicked1);
        if (legality1 instanceof LegalFirstStepMove)
            for (let j = 0; j < flatBoard.length; j++) {
                let hypothClicked2 = Object.create(clicked);
                hypothClicked2.prvTile = hypothClicked1.tile;
                hypothClicked2.tile = flatBoard[j];
                let legality2 = CalcMoveLegality.getSecondStepMoveLegality(hypothClicked2);
                if (legality2 instanceof LegalSecondStepMove)
                {
                    legality2.hypothClicked = hypothClicked2;
                    allLegalMoveArr.push(legality2);
                }
            }
    }
    return allLegalMoveArr;
}