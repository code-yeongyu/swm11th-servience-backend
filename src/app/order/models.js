const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    orderer: { type: String, required: true, unique: false },
    store_id: { type: String, required: true },
    table_id: { type: Number, get: (value) => Math.round(value), set: (value) => Math.round(value), required: true },
    menu: { type: String, required: true },
    serving_status: { type: Number, default: 0 } // 0 for waiting, 1 for serving, 2 for done
})
orderSchema.index({});

module.exports = mongoose.model('Order', orderSchema)