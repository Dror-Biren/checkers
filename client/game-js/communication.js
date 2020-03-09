let Communication = {};
const socket = io()

Communication.emitEnterGamePage = function() {
    socket.emit('enterGamePage', getToken(), (error) => {
        if (error) {
            shiftPageAndPreserveToken('mainPage')
            alert(error) 
        }
        else
            console.log('"Enter to game page" message received successfully!')
    })
}

Communication.emitMove = function () {
    let clicks = {
        row1: clicked.prvTile.row,
        column1: clicked.prvTile.column,
        row2: clicked.tile.row,
        column2: clicked.tile.column
    }

    console.log('about to emit the move:', clicks)
    socket.emit('clientPlayedMove', getToken(), clicks, (error) => {
        console.log(error? error : `move received successfully!`)
    })
}


Communication.emitEndGame = function (isClientWon) {
    let ratingChange = RatingChange.calcChange(isClientWon)
    
    socket.emit('gameEnd', getToken(), ratingChange, (error) => {
        console.log(error? error : '"End of game" message received successfully!')
    })
}


socket.on('initGame', (isPlayerWhite, opponentUser) => {
    isGameStart = true
    opponent = opponentUser

    if (isPlayerWhite)
        Title.annonceGameStart()
    else
        Title.waitingToOpponent(true)

    if (isBoardUpsideDown === isPlayerWhite)
        RunGame.flipBoard()

    isClientWhite = isPlayerWhite
})

socket.on('opponentPlayedMove', (clicks) => {       
    console.log('opponent Played Move-', clicks)

    if (isBoardUpsideDown) {
        clicks.row1 = boardHeight - 1 - clicks.row1;
        clicks.column1 = boardWidth / 2 - 1 - clicks.column1;
        clicks.row2 = boardHeight - 1 - clicks.row2;
        clicks.column2 = boardWidth / 2 - 1 - clicks.column2;
    }

    RunGame.tileWasClickedInCorrectTime(clicks.row1, clicks.column1)
    RunGame.tileWasClickedInCorrectTime(clicks.row2, clicks.column2)
})

socket.on('opponentDisconnect', () => {
    if(isGameOver)
        return
    console.log('opponent disconnect')
    RunGame.endTheGame(true)
})

socket.on('errorOpeningParallelGames', () => {
    alert(messages.ERROR.ALERT_START + messages.ERROR.OPENING_PARALLEL_GAMES)
    shiftPageAndPreserveToken('mainPage')
})