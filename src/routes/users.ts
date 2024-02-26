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
  getUser,
  editUser,
  addCart,
  editCart,
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
router.patch('/', content('application/json'), auth.jwt(mode), editUser)
router.post('/cart', content('application/json'), auth.jwt(mode), addCart)
router.patch('/cart', content('application/json'), auth.jwt(mode), editCart)
router.get('/cart', auth.jwt(mode), getCart)
router.post('/favorite', content('application/json'), auth.jwt(mode), updateFav)
router.get('/favorite', auth.jwt(mode), getFavs)

export default router
