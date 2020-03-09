
const io = require('./boringConfig/appInit')
const startSiteEventsListening = require('./socketEventListner')

io.on('connection', (socket) => {
    console.log(`New connection  (id: ${socket.id})`)
    startSiteEventsListening(socket)
})


/*
io.on('connection', (socket) => {
    console.log('New WebSocket connection with id:', socket.id)
    const isSocketOnGamePage = socket.handshake.headers.referer.endsWith("game.html")

    if (isSocketOnGamePage) {
        let thisGameRoom = joinToGameRoom(socket)
        startGameEventsListening(socket, thisGameRoom)
    }
    else
        startSiteEventsListening(socket)
})
*/