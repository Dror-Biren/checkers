const { signUpUser, logInUser, getAllUsers } = require('./usersCode/userOperations')
const joinToGameRoom = require('./roomsOperations')
const findUserByToken = require('./usersCode/authentication')

function startSiteEventsListening(socket) {

    socket.on('logIn', async (userData, callback) => {
        console.log("try to log in with data:", userData)
        try {
            let {token} = await logInUser(userData)
            callback(undefined, token)
        }
        catch (error) {
            callback(error.message)
        }
    })

    socket.on('signUp', async (userData, callback) => {
        console.log("try to sign up with data:", userData)
        try {
            let {token} = await signUpUser(userData)
            callback(undefined, token)
        }
        catch (error) {
            callback(error.message)
        }
    })

    socket.on('getAllUsers', async (callback) => {
        console.log('get all users (request)')
        try {
            let users = await getAllUsers()
            callback(undefined, users)
        }
        catch (error) {
            callback(error.message)
        }
    })

    socket.on('enterGamePage', async (token, callback) => {
        try {
            let user = await findUserByToken(token)
            console.log(`user "${user.username}" request to start new game`)
            const room = joinToGameRoom(socket, user)
            startGameEventsListening(socket, room)
            callback()
        }
        catch (error) {
            callback(error.message)
        }
    })

    socket.on('findUserByToken' , async (token, callback) => {
        try {
            let user = await findUserByToken(token)
            callback(undefined, user)
        }
        catch (error) {
            callback(error.message)
        }
    })
}


function startGameEventsListening(socket, room) {

    socket.on('clientPlayedMove', async (token, move, callback) => {
        try {
            let user = await findUserByToken(token)
            console.log(`user "${user.username}" in room ${room} played:`, move)
            await socket.broadcast.to(room).emit('opponentPlayedMove', move)
            callback()
        }
        catch(error) {
            callback(error.message)
        }
    })

    socket.on('disconnect', () => {
        socket.broadcast.to(room).emit('opponentDisconnect')
    })

    socket.on('gameEnd', async (token, ratingChange, callback) => {
        try {
            let user = await findUserByToken(token)

            const status = ratingChange > 0? "win":"lose"
            console.log(`user "${user.username}" in room ${room} has ${status}`)

            user.rating += ratingChange
            await user.save()
            callback()
        }
        catch(error) {
            callback(error.message)
        }
    })


}

module.exports = startSiteEventsListening