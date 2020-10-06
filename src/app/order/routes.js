const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const controllers = require('./controllers.js')
const authMiddleware = require('../../middlewares/auth.js')
const errorCode = require('../../errors/codes.js')
const errorWithMessage = require('../../utils/error_message.js')

const menuNotEmptyValidator = body('menu').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
const tableIDNotEmptyValidator = body('table_id').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
const storeIDNotEmptyValidator = body('store_id').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
const idValidator = body('order_ids').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError)).isArray().withMessage(errorWithMessage(errorCode.ParameterError))

router.get('/', authMiddleware, controllers.getOrders)
router.post('/', [authMiddleware, menuNotEmptyValidator, tableIDNotEmptyValidator, storeIDNotEmptyValidator], controllers.addOrder)
router.patch('/:order_id', authMiddleware, controllers.updateStatus)
router.post('/serve', [authMiddleware, idValidator], controllers.serve)

module.exports = router