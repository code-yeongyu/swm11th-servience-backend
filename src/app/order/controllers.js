const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const User = mongoose.model('User')
const Order = mongoose.model('Order')
const io = require('../../utils/websocket.js')

exports.getOrders = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    // check user's attached store
    try {
        let pendingOrders = await Order.find({ 'isPending': true })
        return res.json({
            "orders": pendingOrders
        })
    } catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
}

exports.addOrder = async (req, res) => {
    const errors = validationResult(req)
    let isSuccess = false
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    try {
        let order = new Order(req.body)
        order.orderer = req.username
        await order.save()
        isSuccess = true
    } catch (err) {
        console.error(err)
    }
    return res.sendStatus(isSuccess ? 200 : 400)
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
        return res.sendStatus(400)
    }
    io.clients.forEach((client) => {
        client.send(JSON.stringify(req.body))
    })
    return res.sendStatus(200)
}