/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import admin from '../middleware/admin'
import {
  createOrder,
  getOrders,
  getOrder,
  getAllOrders,
  editOrder,
  deleteOrder
} from '../controllers/orders'

const router = express.Router()

// 創建訂單
router.post('/', content('application/json'), auth.jwt('user'), createOrder)
// 取得我的所有訂單
router.get('/', auth.jwt('user'), getOrders)
// 取得所有使用者訂單
router.get('/all', auth.jwt('admin'), admin, getAllOrders)
// 取得我的其中一筆訂單(使用者)
router.get('/user/:id', auth.jwt('user'), getOrder)
// 取得其中一筆訂單(管理者)
router.get('/admin/:id', auth.jwt('admin'), getOrder)
// 更新訂單
router.patch(
  '/:id',
  content('application/json'),
  auth.jwt('admin'),
  admin,
  editOrder
)
router.delete('/:id', auth.jwt('admin'), admin, deleteOrder)

export default router
