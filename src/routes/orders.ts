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

router.post('/', content('application/json'), auth.jwt('user'), createOrder)
router.get('/', auth.jwt('user'), getOrders)
router.get('/all', auth.jwt('admin'), admin, getAllOrders)
router.get('/:id', auth.jwt('user'), getOrder)
router.patch(
  '/:id',
  content('application/json'),
  auth.jwt('admin'),
  admin,
  editOrder
)
router.delete('/:id', auth.jwt('admin'), admin, deleteOrder)

export default router
