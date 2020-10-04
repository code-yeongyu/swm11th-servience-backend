const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const controllers = require('./controllers')
const authMiddleware = require('../../middlewares/auth.js')
const errorCode = require('../../errors/codes.js')
const errorWithMessage = require('../../utils/error_message.js')

const menuNotValidator = body('menu').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
const tableIDNotValidator = body('table_id').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
const storeIDNotValidator = body('store_id').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
const idNotValidator = body('order_id').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))

router.get('/', authMiddleware, controllers.getOrders)
router.post('/', [authMiddleware, menuNotValidator, tableIDNotValidator, storeIDNotValidator], controllers.addOrder)
router.patch('/:order_id', authMiddleware, controllers.updateStatus)
router.post('/serve', [authMiddleware, idNotValidator], controllers.serve)

module.exports = router