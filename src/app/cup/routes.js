const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const errorCode = require('../../errors/codes.js')
const errorWithMessage = require('../../utils/error_message.js')
const controllers = require('./controllers.js')

const productIDValidator = body('product_id').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
const cupIDValidator = body('cup_id').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
    .isInt().withMessage(errorWithMessage(errorCode.ParameterError))
    .custom(value => {
        if (value < 0 || value > 3)
            return Promise.reject(errorWithMessage(errorCode.ParameterError))
        return true
    })

router.patch('/', [productIDValidator, cupIDValidator], controllers.updateCupStatus)

module.exports = router