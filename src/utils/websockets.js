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
    clients.forEach((client) => {
        client.send(message)
    })
}