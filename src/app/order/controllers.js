const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const Order = mongoose.model('Order')
const wsUtil = require('../../utils/websockets.js')
const wsEnum = require('../../utils/websocket_enum.js')
const wsMessageType = wsEnum.messageType
const wsTargetObject = wsEnum.targetObject

exports.getOrders = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    // place below check user's attached store 
    /**/
    try {
        let unfinished_orders = await Order.find({ 'serving_status': { $eq: 0 } })
        return res.json({
            "orders": unfinished_orders
        })
    } catch (err) {
        console.error(err)
        return res.sendStatus(500) // never can be happened unless server error has occured
    }
}

exports.addOrder = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    req.body.serving_status = undefined
    try {
        const order = new Order(req.body)
        order.orderer = req.username
        await order.save()
        wsUtil.broadcast(wsUtil.display_store, wsUtil.createMessage(wsMessageType.Add, wsTargetObject.Order, order))
        return res.sendStatus(200)
    } catch (err) {
        console.error(err)
        return res.sendStatus(500) // never can be happened unless server error has occured
    }
}

exports.updateStatusDone = async (req, res) => {
    const order_id = req.param("order_id")
    if (order_id) {
        try {
            const order = await Order.findOne({ '_id': order_id })
            if (order.serving_status === 2) {
                return res.sendStatus(400)
            }
            order.serving_status = 2
            await order.save()
            wsUtil.broadcast(wsUtil.display_store, wsUtil.createMessage(wsMessageType.Update, wsMessageType.Order, order))
            // codes for notifying to display should be placed here.
            return res.sendStatus(200)
        } catch (err) {
            return res.sendStatus(404)
        }
    } else {
        return res.sendStatus(400)
    }
}

exports.serve = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const { order_ids } = req.body
    const waiting_orders = []

    for (let i = 0; i < order_ids.length; i++) {
        const order_id = order_ids[i]
        try {
            const order = await Order.findById(order_id)
            if (order.serving_status !== 0) {
                continue
            } // validating serving status
            order.serving_status = 1
            await order.save()
            waiting_orders.push(order)
        } catch (err) {
            console.error(err)
            continue // never can be happened unless server error has occured
        }
    }
    if (waiting_orders.length === 0) {
        return res.sendStatus(200)
    }
    const result_orders = {
        "orders": waiting_orders
    }

    wsUtil.broadcast(wsUtil.robot_store, wsUtil.createMessage(wsMessageType.Add, wsMessageType.Robot, result_orders))

    return res.sendStatus(200)
}