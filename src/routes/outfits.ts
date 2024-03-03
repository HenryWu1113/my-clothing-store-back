/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import admin from '../middleware/admin'
import { uploadImage } from '../middleware/upload'
import {
  createOutfit,
  getOutfits,
  getAllOutfits,
  getClerkOutfits,
  getOutfit,
  editOutfit,
  deleteOutfit
} from '../controllers/outfits'

const router = express.Router()

/** 使用者模式 */
const mode = 'admin'

// 創建穿搭
router.post(
  '/',
  content('multipart/form-data'),
  auth.jwt(mode),
  uploadImage('mutiple', 'images'),
  createOutfit
)
// 取得穿搭(有上架的)
router.get('/', getOutfits)
// 取得該店員所有穿搭(店員所有自己新增的)
router.get('/clerk/:id', getClerkOutfits)
// 取得所有穿搭(管理者)
router.get('/all', auth.jwt(mode), admin, getAllOutfits)
// 取得單筆穿搭
router.get('/:id', getOutfit)
// 更新穿搭
router.patch(
  '/:id',
  content('multipart/form-data'),
  auth.jwt(mode),
  uploadImage('mutiple', 'images'),
  editOutfit
)
// 刪除穿搭
router.delete('/:id', auth.jwt('admin'), deleteOutfit)

export default router
