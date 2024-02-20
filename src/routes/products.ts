/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import admin from '../middleware/admin'
import { uploadImage } from '../middleware/upload'
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
  auth.jwt('admin'),
  admin,
  uploadImage('mutiple', 'images'),
  createProduct
)
router.get('/', getProducts)
router.get('/all', auth.jwt('admin'), admin, getAllProducts)
router.get('/:id', getProduct)
router.patch(
  '/:id',
  content('multipart/form-data'),
  auth.jwt('admin'),
  admin,
  uploadImage('mutiple', 'images'),
  editProduct
)

export default router
