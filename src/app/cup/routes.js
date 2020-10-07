/**
 * @swagger
 *  tags:
 *      name: Cup
 *      description: Cup과 관련한 라우트
 * definitions:
 *      cup_collection:
 *          type: object
 *          required:
 *              - product_id
 *              - status
 *          properties:
 *              product_id:
 *                  type: string
 *                  description: robot, display 웹소켓에 사용되었던 서빙 로봇 제품 ID
 *              status:
 *                  type: array
 *                  items:
 *                      type: boolean
 *                  minItems: 4
 *                  maxItems: 4
 *                  description: 각 인덱스별 컵이 채워졌는지 여부
 *      update_cup_request:
 *          type: object
 *          required:
 *              - product_id
 *              - cup_id
 *          properties:
 *              product_id:
 *                  type: string
 *                  description: robot, display 웹소켓에 사용되었던 서빙 로봇 제품 ID
 *              cup_id:
 *                  type: integer
 *                  minimum: 0
 *                  maximum: 3
 *                  description: 상태를 변경(true -> false, false -> true) 하고자 하는 컵의 index
 */

/**
 * @swagger
 *  /cup:
 *      patch:
 *          tags:
 *              - cup
 *          description: 받은 product_id 와 cup_id 를 바탕으로 cup_status 를 업데이트
 *          produces:
 *              - applicaion/json
 *          parameters:
 *              - in: "body"
 *                required: true
 *                schema:
 *                    $ref: "#/definitions/update_cup_request"
 *          responses:
 *              200:
 *                  description: successfully updated and sent to display app via websockets
 *              400:
 *                  description: parameter error or wrong product_id
 */

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