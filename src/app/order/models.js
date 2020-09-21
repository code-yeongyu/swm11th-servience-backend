const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    orderer: { type: String, required: true, unique: false },
    store_id: { type: Number, get: (value) => Math.round(value), set: (value) => Math.round(value), required: true },
    table_id: { type: Number, get: (value) => Math.round(value), set: (value) => Math.round(value), required: true },
    menu: { type: Number, get: (value) => Math.round(value), set: (value) => Math.round(value), required: true },
    isPending: { type: Boolean, default: true }
})
orderSchema.index({});

module.exports = mongoose.model('Order', orderSchema)