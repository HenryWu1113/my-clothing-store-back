/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import admin from '../middleware/admin'
import {
  createStore,
  getStore,
  getStores,
  editStore,
  deleteStore
} from '../controllers/stores'

const router = express.Router()

/** 使用者模式 */
const mode = 'admin'

router.get('/', getStores)
router.get('/:id', getStore)

router.post(
  '/',
  content('application/json'),
  auth.jwt(mode),
  admin,
  createStore
)
router.patch(
  '/:id',
  content('application/json'),
  auth.jwt(mode),
  admin,
  editStore
)
router.delete('/:id', auth.jwt(mode), admin, deleteStore)

export default router
