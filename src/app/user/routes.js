const express = require('express')
const router = express.Router()
const controllers = require('./controllers.js')
const authMiddleware = require('../../middlewares/auth.js')
const mongoose = require('mongoose')
const User = mongoose.model("User")
const { body } = require('express-validator');
const errorCode = require('../../errors/codes.js')
const errorWithMessage = require('../../utils/error_message.js')

router.get('/', authMiddleware, controllers.getProfile)
router.patch('/', authMiddleware, controllers.editProfile)
router.post('/register', [body('username').notEmpty().custom(value => {
    return User.findOne({ 'username': value }).then(user => {
        if (user) {
            return Promise.reject('The username already in use.');
        }
    });
}), body('password').notEmpty()], controllers.register)
router.post('/auth', [body('username').not().isEmpty(), body('password').not().isEmpty()], controllers.auth)


module.exports = router