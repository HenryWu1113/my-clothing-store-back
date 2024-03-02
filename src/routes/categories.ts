/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import admin from '../middleware/admin'
import {
  createCategory,
  getCategory,
  getCategories,
  editCategory,
  deleteCategory
} from '../controllers/categories'

const router = express.Router()

/** 使用者模式 */
const mode = 'admin'

router.get('/:id', auth.jwt(mode), admin, getCategory)
router.get('/', auth.jwt(mode), admin, getCategories)

router.post(
  '/',
  content('application/json'),
  auth.jwt(mode),
  admin,
  createCategory
)
router.patch(
  '/:id',
  content('application/json'),
  auth.jwt(mode),
  admin,
  editCategory
)
router.delete('/:id', auth.jwt(mode), admin, deleteCategory)

export default router
