const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cupValidator = (value) => {
    return value.length === 4
}

const cupSchema = new Schema({
    product_id: { type: String, required: true, unique: true },
    status: { type: Array, required: true, validate: cupValidator, default: [false, false, false, false] }
})

cupSchema.index({ product_id: 1 })

module.exports = mongoose.model('Cup', cupSchema)