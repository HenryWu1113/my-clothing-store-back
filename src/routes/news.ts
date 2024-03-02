/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import admin from '../middleware/admin'
import { uploadImage } from '../middleware/upload'
import {
  createNews,
  getNews,
  getAllNews,
  getSingleNews,
  editSingleNews
} from '../controllers/news'

const router = express.Router()

/** 使用者模式 */
const mode = 'admin'

router.post(
  '/',
  content('multipart/form-data'),
  auth.jwt(mode),
  admin,
  uploadImage('single', 'image'),
  createNews
)
router.get('/', getNews)
router.get('/all', auth.jwt(mode), admin, getAllNews)
router.get('/:id', getSingleNews)
router.patch(
  '/:id',
  content('multipart/form-data'),
  auth.jwt(mode),
  admin,
  uploadImage('single', 'image'),
  editSingleNews
)

export default router
