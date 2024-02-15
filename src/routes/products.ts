/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import admin from '../middleware/admin'
import { singleUpload, mutiUpload } from '../middleware/upload'
import {
  createProduct,
  getProducts,
  getAllProducts,
  getProduct,
  editProduct
} from '../controllers/products'

const router = express.Router()

router.post(
  '/',
  content('multipart/form-data'),
  auth.jwt,
  admin,
  mutiUpload,
  createProduct
)
router.get('/', getProducts)
router.get('/all', auth.jwt, admin, getAllProducts)
router.get('/:id', getProduct)
router.patch(
  '/:id',
  content('multipart/form-data'),
  auth.jwt,
  admin,
  mutiUpload,
  editProduct
)

export default router
