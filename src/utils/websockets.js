const WebSocket = require('ws');

exports.robot_store = []
exports.display_store = []

exports.createMessage = (message_type, target_object, content) => {
    return JSON.stringify({
        "type": message_type, // ADD, UPDATE, SERVE
        "target_object": target_object, // ORDER, CUP, ROBOT
        "content": content
    })
}

exports.broadcast = (clients, message) => {
    for (let i = 0; i < clients.length; i++) {
        const client = clients[i]
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
    console.log("Sent to all.")
}

exports.send = (clients, client_id, message) => {
    for (let i = 0; i < clients.length; i++) {
        const client = clients[i]
        if (client.readyState === WebSocket.OPEN) {
            if (client.product_id === client_id) {
                client.send(message)
                console.log("Sent to "+client_id+".")
                return
            }
        }
    }
}


exports.validateProductID = (product_id) => {
    const products = new Array(new Set(this.robot_store + this.display_store))
    for (let i = 0; i < products.length; i++) {
        const product = products[i]
        if (product.product_id === product_id) {
            return true
        }
    }
    return false
}