/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import { uploadImage } from '../middleware/upload'
import {
  createRating,
  getProductAllRatings,
  getUserAllRatings,
  editRating,
  thumbUpRating,
  deleteRating
} from '../controllers/ratings'

const router = express.Router()

/** 使用者模式 */
const mode = 'user'

// 創建評分
router.post(
  '/',
  content('multipart/form-data'),
  auth.jwt(mode),
  uploadImage('mutiple', 'images'),
  createRating
)

// 取得該商品所有評分
router.get('/product/:productId', getProductAllRatings)
// 取得該使用者所有評分
router.get('/user/:userId', getUserAllRatings)
// 更新評分(id 是該評分的 _id)
router.patch(
  '/edit/:id',
  content('multipart/form-data'),
  auth.jwt(mode),
  uploadImage('mutiple', 'images'),
  editRating
)
// 點讚評分(id 是該評分的 _id)
router.patch('/thumb/:id', auth.jwt(mode), thumbUpRating)
// 刪除評分
router.delete('/:id', auth.jwt(mode), deleteRating)

export default router
