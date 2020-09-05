const express = require('express')
const router = express.Router()
const controllers = require('./controllers.js')
const authMiddleware = require('../../middlewares/auth.js')

router.get('/', authMiddleware, controllers.getProfile)
router.patch('/', authMiddleware, controllers.editProfile)
router.post('/register', controllers.register)
router.post('/auth', controllers.auth)


module.exports = router