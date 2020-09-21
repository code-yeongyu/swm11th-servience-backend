const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('combined'))
//DEFAULT MIDDLEWARES

require('./app/user/models.js')
require('./app/order/models.js')
const userRoutes = require('./app/user/routes.js')
const orderRoutes = require('./app/order/routes.js')
app.use('/user', userRoutes)
app.use('/order', orderRoutes)
//APP SETUPS

const mongoose = require('mongoose')
const db = mongoose.connection;
db.on('error', console.error)
db.once('open', () => {
    console.log("Connected to mongoDB server")
})

if (process.env.NODE_ENV === "test") {
    mongoose.connect("mongodb://localhost/servience_test", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
} else {
    mongoose.connect("mongodb://localhost/servience", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
}


//DB CONNECTION

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Express server has started listening on port " + PORT)
})
