const socket = io()

function printAllUsers() {
    socket.emit('getAllUsers', (error,users) => {
        if (error)
            alert(error)
        else
            console.log("all users:",users)
    })
}

let client
identifiedToken((user) => {
    client = user
})