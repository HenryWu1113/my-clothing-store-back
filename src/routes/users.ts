/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import admin from '../middleware/admin'
import { uploadImage } from '../middleware/upload'

import {
  register,
  login,
  logout,
  extend,
  getUser,
  getAllUsers,
  editAllUsers,
  editUser,
  addCart,
  editCart,
  editUserImage,
  getCart,
  updateFav,
  getFavs
} from '../controllers/users'

const router = express.Router()

/** 使用者模式 */
const mode = 'user'

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login(mode), login)
router.delete('/logout', auth.jwt(mode), logout)
router.post('/extend', auth.jwt(mode), extend)
router.get('/', auth.jwt(mode), getUser)

// 取得所有使用者(管理者專用)
router.get('/all', auth.jwt('admin'), admin, getAllUsers)
// 管理者編輯使用者
router.patch(
  '/manager/:userId',
  content('application/json'),
  auth.jwt('admin'),
  admin,
  editAllUsers
)

// 文本系列更新
router.patch('/', content('application/json'), auth.jwt(mode), editUser)
// avatar 更新
router.patch(
  '/avatar',
  content('multipart/form-data'),
  auth.jwt(mode),
  uploadImage('single', 'avatar'),
  editUserImage('avatar')
)
// backgroundImg 更新
router.patch(
  '/backgroundImg',
  content('multipart/form-data'),
  auth.jwt(mode),
  uploadImage('single', 'backgroundImg'),
  editUserImage('backgroundImg')
)
router.post('/cart', content('application/json'), auth.jwt(mode), addCart)
router.patch('/cart', content('application/json'), auth.jwt(mode), editCart)
router.get('/cart', auth.jwt(mode), getCart)
router.post('/favorite', content('application/json'), auth.jwt(mode), updateFav)
router.get('/favorite', auth.jwt(mode), getFavs)

export default router
