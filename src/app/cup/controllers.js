const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const Cup = mongoose.model('Cup')
const wsUtil = require('../../utils/websockets.js')
const wsEnum = require('../../utils/websocket_enum.js')
const wsMessageType = wsEnum.messageType
const wsTargetObject = wsEnum.targetObject

exports.resetCupStatus = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const { product_id } = req.body
    /*if (!wsUtil.validateProductID(product_id)) {
        return res.send(400)
    }*/
    const isCupCollectionExists = await Cup.exists({ product_id: product_id })
    if (!isCupCollectionExists) {
        const cup = new Cup({ product_id: product_id })
        await cup.save()
    }

    const cup = await Cup.findOne({ product_id: product_id })
    cup.status = [false, false, false, false]
    cup.markModified('status')
    await cup.save()

    wsUtil.send(wsUtil.display_store, product_id, wsUtil.createMessage(wsMessageType.Reset, wsTargetObject.Cup, cup))
    return res.send(cup)
}

exports.updateCupStatus = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const { product_id, cup_id } = req.body
    /*if (!wsUtil.validateProductID(product_id)) {
        return res.send(400)
    }*/
    const isCupCollectionExists = await Cup.exists({ product_id: product_id })
    if (!isCupCollectionExists) {
        const cup = new Cup({ product_id: product_id })
        await cup.save()
    }

    const cup = await Cup.findOne({ product_id: product_id })
    cup.status[cup_id] = !cup.status[cup_id]
    cup.markModified('status')
    await cup.save()

    wsUtil.send(wsUtil.display_store, product_id, wsUtil.createMessage(wsMessageType.Update, wsTargetObject.Cup, cup))
    return res.send(cup)
}