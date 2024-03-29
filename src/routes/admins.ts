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
  getAdmin,
  getNormalAdmin,
  getAllClerks,
  editAllClerks,
  editAdmin,
  editAdminImage
} from '../controllers/admins'

const router = express.Router()

/** 管理者模式 */
const mode = 'admin'

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login(mode), login)
router.delete('/logout', auth.jwt(mode), logout)
router.post('/extend', auth.jwt(mode), extend)
router.get('/', auth.jwt(mode), getAdmin)
// 取得店員基本資訊(點擊店員時)
router.get('/clerk/:id', getNormalAdmin)

// 取得所有員工(管理者專用)
router.get('/all', auth.jwt(mode), admin, getAllClerks)
// 管理者編輯其他員工
router.patch(
  '/manager/:adminId',
  content('application/json'),
  auth.jwt(mode),
  admin,
  editAllClerks
)

// 文本系列更新
router.patch('/', content('application/json'), auth.jwt(mode), editAdmin)
// avatar 更新
router.patch(
  '/avatar',
  content('multipart/form-data'),
  auth.jwt(mode),
  uploadImage('single', 'avatar'),
  editAdminImage('avatar')
)
// backgroundImg 更新
router.patch(
  '/backgroundImg',
  content('multipart/form-data'),
  auth.jwt(mode),
  uploadImage('single', 'backgroundImg'),
  editAdminImage('backgroundImg')
)
export default router
