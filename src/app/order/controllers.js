const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const Order = mongoose.model('Order')
const io = require('../../utils/websocket.js')
const wsUtil = require('../../utils/websockets.js')
const wsMessageType = require('../../utils/websocket_enum.js')


exports.getOrders = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    // place below check user's attached store 
    /**/
    try {
        let unfinished_orders = await Order.find({ 'serving_status': { $ne: 2 } })
        return res.json({
            "orders": unfinished_orders
        })
    } catch (err) {
        return res.sendStatus(500) // never can be happened unless server error has occured
    }
}

exports.addOrder = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    try {
        let order = new Order(req.body)
        order.orderer = req.username
        await order.save()
        wsUtil.broadcast(wsUtil.store, wsUtil.createMessage(wsMessageType.Add, wsMessageType.Order, order))
        return res.sendStatus(200)
    } catch (err) {
        return res.sendStatus(500) // never can be happened unless server error has occured
    }
}

exports.updateStatus = async (req, res) => {
    const order_id = req.param("order_id")
    if (order_id) {
        const order = await Order.findOne({ '_id': order_id })
        if (order.servingStatus == 2) {
            return res.sendStatus(400)
        }
        await order.save()
        wsUtil.broadcast(wsUtil.store, wsUtil.createMessage(wsMessageType.Update, wsMessageType.Order, order))
        // codes for notifying to display should be placed here.
        return res.sendStatus(200)
    } else {
        return res.sendStatus(400)
    }
}

exports.serve = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    try {
        const order = await Order.findById(req.body.order_id)
        order.isPending = false
        order.save()
    } catch (err) {
        return res.sendStatus(500) // never can be happened unless server error has occured
    }
    io.clients.forEach((client) => {
        client.send(JSON.stringify(req.body))
    })
    return res.sendStatus(200)
}