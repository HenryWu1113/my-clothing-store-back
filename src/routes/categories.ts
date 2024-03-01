/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import admin from '../middleware/admin'
import {
  createCategory,
  editCategory
} from '../controllers/categories'

const router = express.Router()

/** 使用者模式 */
const mode = 'admin'

router.post('/', content('application/json'), auth.jwt(mode), admin, createCategory)
router.patch('/', content('application/json'), auth.jwt(mode), admin, editCategory)

export default router
