const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const controllers = require('./controllers')
const authMiddleware = require('../../middlewares/auth.js')
const errorCode = require('../../errors/codes.js')
const errorWithMessage = require('../../utils/error_message.js')

const menuNotEmpty = body('menu').notEmpty().withMessage(errorWithMessage(errorCode.FormError))
const tableIDNotEmpty = body('table_id').notEmpty().withMessage(errorWithMessage(errorCode.FormError))
const storeIDNotEmpty = body('store_id').notEmpty().withMessage(errorWithMessage(errorCode.FormError))
const idNotEmpty = body('order_id').notEmpty().withMessage(errorWithMessage(errorCode.FormError))

router.get('/', authMiddleware, controllers.getOrders)
router.post('/', [authMiddleware, menuNotEmpty, tableIDNotEmpty, storeIDNotEmpty], controllers.addOrder)
router.post('/serve', [authMiddleware, idNotEmpty], controllers.serve)

module.exports = router