/**
 * @swagger
 *  tags:
 *      name: Order
 *      description: Order와 관련한 라우트
 * definitions:
 *      order_collection:
 *          type: object
 *          required:
 *              - orderer
 *              - store_id
 *              - table_id
 *              - menu
 *          properties:
 *              orderer:
 *                  type: string
 *                  description: 주문자 username
 *              store_id:
 *                  type: string
 *                  description: store의 id, websocket에 사용되는 product_id 와 동일
 *              table_id:
 *                  type: integer
 *              menu:
 *                  type: integer
 *                  descriptipn: 주문한 menu 의 id
 *              serving_status:
 *                  type: integer
 *                  minimum: 0
 *                  maximum: 2
 *                  description: "서빙 상태\n\n0: 대기중, 1: 서빙중, 2: 서빙 완료"
 *      get_orders_response:
 *          type: object
 *          properties:
 *              orders:
 *                  type: object
 *                  properties:
 *                      serving_status:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      description: 주문 ID
 *                                  orderer:
 *                                      type: string
 *                                      description: 주문자 username
 *                                  store_id:
 *                                      type: string
 *                                      description: store의 id, websocket에 사용되는 product_id 와 동일
 *                                  table_id:
 *                                      type: integer
 *                                      description: table의 id
 *                                  menu:
 *                                      type: integer
 *                                      descriptipn: 주문한 menu 의 id
 *                                  serving_status:
 *                                      type: integer
 *                                      minimum: 0
 *                                      maximum: 2
 *                                      description: "서빙 상태\n\n0: 대기중, 1: 서빙중, 2: 서빙 완료"
 *      create_order_request:
 *          type: object
 *          required:
 *              - store_id
 *              - table_id
 *              - menu
 *          properties:
 *              store_id:
 *                  type: string
 *                  description: store의 id, websocket에 사용되는 product_id 와 동일
 *              table_id:
 *                  type: integer
 *                  description: table의 id
 *              menu:
 *                  type: array
 *                  items:
 *                      type: string
 *                  descriptipn: 주문한 menu 들
 * 
 *      serve_order_request:
 *          type: object
 *          required:
 *              - order_ids
 *          properties:
 *              order_ids:
 *                  type: array
 *                  items:
 *                      type: string
 */

/**
 * @swagger
 * /order:
 *      get:
 *          tags:
 *              - order
 *          description: 서빙 완료되지 않은 모든 주문 정보 조회
 *          produces:
 *              - applicaion/json
 *          responses:
 *              200:
 *                  description: OK
 *                  schema:
 *                      $ref: "#/definitions/get_orders_response"
 *              400:
 *                  description: ParameterError
 *      post:
 *          tags:
 *              - order
 *          description: 새 주문 추가
 *          produces:
 *              - applicaion/json
 *          parameters:
 *              - in: "body"
 *                required: true
 *                schema:
 *                    $ref: "#/definitions/create_order_request"
 *          responses:
 *              200:
 *                  description: successfully added order and broadcasted to all connected displays
 *              400:
 *                  description: ParameterError
 *              401:
 *                  description: Unauthorized
 * /order/{order_id}:
 *      patch:
 *          tags:
 *              - order
 *          description: "order_id 의 파라미터 값에 해당되는 id의 서빙 상태를 완료로 바꿉니다."
 *          produces:
 *              - applicaion/json
 *          parameters:
 *              - in: "body"
 *                required: true
 *                schema:
 *                    $ref: "#/definitions/create_order_request"
 *          responses:
 *              200:
 *                  description: successfully updated status to 2
 *              400:
 *                  description: the serving status is already 2
 *              404:
 *                  description: No such ID
 * /order/serve:
 *      post:
 *          tags:
 *              - order
 *          description: 주문들을 일괄적으로 서빙 처리 하고, 웹소켓을 통해 연결된 로봇들에게 브로드 캐스트
 *          produces:
 *              - applicaion/json
 *          parameters:
 *              - in: "body"
 *                required: true
 *                schema:
 *                    $ref: "#/definitions/serve_order_request"
 *          responses:
 *              200:
 *                  description: successfull updated status to next level
 *              400:
 *                  description: the serving status is already at highest level
 *              404:
 *                  description: No such ID
 */

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
const idValidator = body('order_ids').notEmpty().withMessage(errorWithMessage(errorCode.ParameterError))

router.get('/', controllers.getOrders)
router.post('/', [authMiddleware, menuNotEmptyValidator, tableIDNotEmptyValidator, storeIDNotEmptyValidator], controllers.addOrder)
router.patch('/:order_id', controllers.updateStatusDone)
router.post('/serve', idValidator, controllers.serve)

module.exports = router