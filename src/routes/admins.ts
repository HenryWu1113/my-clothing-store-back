/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/comma-spacing */
import express from 'express'
import * as auth from '../middleware/auth'
import content from '../middleware/content'
import {
  register,
  login,
  logout,
  extend,
  getAdmin
} from '../controllers/admins'

const router = express.Router()

/** 管理者模式 */
const mode = 'admin'

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login(mode), login)
router.delete('/logout', auth.jwt(mode), logout)
router.post('/extend', auth.jwt(mode), extend)
router.get('/', auth.jwt(mode), getAdmin)

export default router
