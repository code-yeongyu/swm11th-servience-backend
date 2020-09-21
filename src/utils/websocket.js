const WebSocketServer = require("ws").Server;
const io = new WebSocketServer({ port: 4000 })

let clients_cnt = 0

io.on("connection", (socket) => {
    console.log(`Connection #${clients_cnt} established.`)
    socket.on("message", (msg) => {
        socket.send(`Connection #${clients_cnt} established.`)
    })
    clients_cnt++
})

module.exports = io