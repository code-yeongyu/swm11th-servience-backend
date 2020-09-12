const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = require('../user/models.js')

const orderSchema = new wSchema({
    //store: storeSchema,
    //menu: menuSchema,
    orderer: { type: userSchema, required: true },
    menu: { type: integer, required: true },
    table_id: { type: integer, required: true }
})