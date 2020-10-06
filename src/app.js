const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const errorCode = require('./errors/codes.js')
const errorWithMessage = require('./utils/error_message.js')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('combined'))
//DEFAULT MIDDLEWARES



require('express-ws')(app)
const websockets_util = require('./utils/websockets.js')
app.ws('/display', function (ws, req) {
    ws.on("message", function (msg) {
        try {
            let content = JSON.parse(msg)
            if (!(content.flag && content.id)) {
                return ws.send(JSON.stringify({
                    'status': 400,
                    'error': errorWithMessage(errorCode.ParameterError)
                }))
            }
            if (content.flag === 'auth') {
                this.is_authenticated = true
                websockets_util.display_store.push(ws)
                this.product_id = content.id // the id is built in to the robot
                return ws.send(JSON.stringify({
                    'status': 200,
                    'product_id': this.product_id,
                    'is_authenticated': this.is_authenticated
                }))
            }
        } catch (err) {
            return ws.send(JSON.stringify({
                'status': 400,
                'error': errorWithMessage(errorCode.FormError)
            }))
        }
    })
})
app.ws('/robot', function (ws, req) {
    ws.on("message", function (msg) {
        try {
            let content = JSON.parse(msg)
            if (!(content.flag && content.id)) {
                return ws.send(JSON.stringify({
                    'status': 400,
                    'error': errorWithMessage(errorCode.ParameterError)
                }))
            }
            if (content.flag === 'auth') {
                this.is_authenticated = true
                websockets_util.robot_store.push(ws)
                this.product_id = content.id // the id is built in to the robot
                return ws.send(JSON.stringify({
                    'status': 200,
                    'product_id': this.product_id,
                    'is_authenticated': this.is_authenticated
                }))
            }
        } catch (err) {
            return ws.send(JSON.stringify({
                'status': 400,
                'error': errorWithMessage(errorCode.FormError)
            }))
        }
    })
})
//WEBSOCKETS

require('./app/user/models.js')
require('./app/order/models.js')
require('./app/cup/models.js')
const userRoutes = require('./app/user/routes.js')
const orderRoutes = require('./app/order/routes.js')
const cupRoutes = require('./app/cup/routes.js')
app.use('/user', userRoutes)
app.use('/order', orderRoutes)
app.use('/cup', cupRoutes)
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
