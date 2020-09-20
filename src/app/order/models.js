const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = require('../user/models.js')

const orderSchema = new Schema({
    //store: storeSchema,
    //menu: menuSchema,
    orderer: { type: userSchema, required: true },
    menu: { type: integer, required: true },
    table_id: { type: integer, required: true },
    store_id: { type: integer, required: true }
})

module.exports = mongoose.model('Order', orderSchema)