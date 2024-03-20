/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import admin from '../middleware/admin'
import {
  createBrand,
  getBrand,
  getBrands,
  editBrand
} from '../controllers/brands'

const router = express.Router()

/** 使用者模式 */
const mode = 'admin'

router.get('/:id', auth.jwt(mode), admin, getBrand)
router.get('/', getBrands)

router.post(
  '/',
  content('application/json'),
  auth.jwt(mode),
  admin,
  createBrand
)
router.patch(
  '/:id',
  content('application/json'),
  auth.jwt(mode),
  admin,
  editBrand
)

export default router
