const express = require('express')
const { body } = require('express-validator')
const mongoose = require('mongoose')
const router = express.Router()
const User = mongoose.model("User")
const controllers = require('./controllers.js')
const authMiddleware = require('../../middlewares/auth.js')
const errorCode = require('../../errors/codes.js')
const errorWithMessage = require('../../utils/error_message.js')

const registerationUsernameValidator = body('username').notEmpty().withMessage(errorWithMessage(errorCode.FormError))
    .matches("^[a-zA-Z0-9_]*$").withMessage(errorWithMessage(errorCode.UsernameFormatError))
    .custom(value => {
        return User.findOne({ 'username': value }).then(user => {
            if (user) {
                console.log(errorWithMessage(errorCode.UsernameExists))
                return Promise.reject(errorWithMessage(errorCode.UsernameExists));
            }
        });
    })
const securePasswordValidator = body('password').matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$").withMessage(errorWithMessage(errorCode.PasswordVulnerable))
const authenticationUsernameValidator = body('username').notEmpty().withMessage(errorWithMessage(errorCode.FormError))
const notEmptyPasswordValidator = body('password').notEmpty()
// validators

router.get('/', authMiddleware, controllers.getProfile)
router.patch('/', authMiddleware, controllers.editProfile)
router.post('/register', [registerationUsernameValidator, securePasswordValidator], controllers.register)
router.post('/auth', [authenticationUsernameValidator, notEmptyPasswordValidator], controllers.auth)

module.exports = router