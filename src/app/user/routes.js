/**
 * @swagger
 *  tags:
 *      name: User
 *      description: User와 관련한 라우트
 * definitions:
 *      user_collection:
 *          type: object
 *          required:
 *              - username
 *              - password
 *          properties:
 *              username:
 *                  type: string
 *              password:
 *                  type: string
 *              nickname:
 *                  type: string
 *      get_user_response:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *              nickname:
 *                  type: string
 *      update_user_request:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *              password:
 *                  type: string
 *              nickname:
 *                  type: string
 *      auth_user_request:
 *          type: object
 *          required:
 *              - username
 *              - password
 *          properties:
 *              username:
 *                  type: string
 *              password:
 *                  type: string
 */

/**
 * @swagger
 *  /user:
 *      get:
 *          tags:
 *              - user
 *          description: 요청자의 유저정보 조회
 *          produces:
 *              - applicaion/json
 *          responses:
 *              200:
 *                  description: OK
 *                  schema:
 *                      $ref: "#/definitions/get_user_response"
 *              401:
 *                  description: Unauthorized
 *      patch:
 *          tags:
 *              - user
 *          description: 요청자의 유저정보 수정
 *          produces:
 *              - applicaion/json
 *          parameters:
 *              - in: "body"
 *                required: true
 *                schema:
 *                    $ref: "#/definitions/update_user_request"
 *          responses:
 *              200:
 *                  description: OK
 *                  schema:
 *                      $ref: "#/definitions/get_user_response"
 *              400:
 *                  description: ParameterError
 *              401:
 *                  description: Unauthorized
 * /user/register:
 *      post:
 *          tags:
 *              - user
 *          description: 주어진 정보로 유저 생성
 *          produces:
 *              - applicaion/json
 *          parameters:
 *              - in: "body"
 *                required: true
 *                schema:
 *                      $ref: "#/definitions/user_collection"
 *          responses:
 *              200:
 *                  description: OK
 *              400:
 *                  description: ParameterError
 * /user/auth:
 *      post:
 *          tags:
 *              - user
 *          description: 주어진 정보로 유저 정보 조회 후 JWT 토큰 발급
 *          produces:
 *              - applicaion/json
 *          parameters:
 *              - in: "body"
 *                required: true
 *                schema:
 *                      $ref: "#/definitions/auth_user_request"
 *          responses:
 *              200:
 *                  description: OK
 *              400:
 *                  description: Login Failed
 */

const express = require('express')
const { body } = require('express-validator')
const mongoose = require('mongoose')
const router = express.Router()
const User = mongoose.model("User")
const controllers = require('./controllers.js')
const authMiddleware = require('../../middlewares/auth.js')
const errorCode = require('../../errors/codes.js')
const errorWithMessage = require('../../utils/error_message.js')

const registerationUsernameValidator = body('username').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
    .matches("^[a-zA-Z0-9_]*$").withMessage(errorWithMessage(errorCode.UsernameFormatError))
    .custom(value => {
        return User.findOne({ 'username': value }).then(user => {
            if (user) {
                console.log(errorWithMessage(errorCode.UsernameExists))
                return Promise.reject(errorWithMessage(errorCode.UsernameExists));
            }
        });
    })
const securePasswordValidator = body('password').isLength({ min: 8 }).withMessage(errorWithMessage(errorCode.PasswordVulnerable))
const authenticationUsernameValidator = body('username').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
const notEmptyPasswordValidator = body('password').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))
// validators

router.get('/', authMiddleware, controllers.getProfile)
router.patch('/', authMiddleware, controllers.editProfile)
router.post('/register', [registerationUsernameValidator, securePasswordValidator], controllers.register)
router.post('/auth', [authenticationUsernameValidator, notEmptyPasswordValidator], controllers.auth)

module.exports = router