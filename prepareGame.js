let PrepareGame = {};



PrepareGame.prepareGame = function() {
    CursorImg.resetImgOnCursor();
    PrepareGame.creatAllImages();
    PrepareGame.resetGame();
    CursorImg.updateImgOnCursorSize();
}

PrepareGame.creatAllImages = function() {
    let htmlCode = "";

    for (let row = 0; row < boardHeight; row++)
        for (let column = 0; column < boardWidth; column++) {
            let lineOfCode = `<img style="float: left" width='' height='' `;

            let columnInDataStruct = Math.floor(column / 2);
            let id = '' + row + columnInDataStruct;
            if ((row + column) % 2 === 0)
                //id='empty-${id}'
                 lineOfCode += `src='Images/light-tile.jpg' > `;
            else {
                lineOfCode += `id='${id}' class='darkTile' onmousedown='Index.tileWasClicked("${id}")';
                onmouseup='Index.tileWasClicked("${id}");'> `;
            }
            htmlCode += lineOfCode;
        }

    document.getElementById("board").innerHTML += htmlCode;
}

PrepareGame.resetGame = function() {
    isWhiteTurn = isFirstStepOfTurn = true;
    isGameOver = isBoardUpsideDown = isCapturePossible = isDoubleCapture = false;

    imgOnCursor.style.visibility = "hidden";
    document.body.style.cursor = "grab";
    new Tile(null, null, null).enableAllTilesPointEventExceptThis();
    Title.writeDocTitle("White player: you start!");
    Title.writeDocSubTitle("Please select a piece to move with");
    PrepareGame.setBoardToStartingPosition();
    //console.log(Index);
    Index.updateBoardDisplay();
    //alert("Let's play checkers!");
}

PrepareGame.setBoardToStartingPosition = function() {
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
    PrepareGame.setRealBoardByCodeBoard(boardInCharsCode);
    
}

PrepareGame.setRealBoardByCodeBoard = function(codeBoard) {
    for (let row = 0; row < boardHeight; row++) {
        board[row] = [];
        for (let column = 0; column < boardWidth / 2; column++) {
            let curPiece = null;
            switch (codeBoard[row][column]) {
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