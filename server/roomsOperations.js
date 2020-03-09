
let gamesAmount = 0
let roomWaitingForMatch = null
let userWaitingForMatch = null

function joinToGameRoom(socket, user) {
    if (roomWaitingForMatch === null)
        return openNewGameRoom(socket, user)

    if (user._id === userWaitingForMatch._id)
        throw new Error('ERROR: opening parallel games')
    
    return joinExistingGameRoom(socket, user)
}

function openNewGameRoom(socket, user) {
    const newGameRoom = gamesAmount
    socket.join(newGameRoom)

    roomWaitingForMatch = newGameRoom
    userWaitingForMatch = user
    return newGameRoom
}

function joinExistingGameRoom(socket, user) {
    const roomToJoin = roomWaitingForMatch
    roomWaitingForMatch = null

    socket.join(roomToJoin) 
    startNewGameInRoom(socket, roomToJoin, user, userWaitingForMatch)
    return roomToJoin
}

async function startNewGameInRoom(socket, room, clientUser, opponentUser) {
    let isThisSocketWhite = Math.random() < 0.5
    socket.emit('initGame', isThisSocketWhite, opponentUser)
    socket.broadcast.to(room).emit('initGame', !isThisSocketWhite, clientUser)
    gamesAmount++
}

module.exports = joinToGameRoom
