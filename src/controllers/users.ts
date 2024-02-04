/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import users from '../models/users'
import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'

export const register = async (req: express.Request, res: express.Response) => {
  const password: string = req.body.password
  if (!password) {
    return res.status(400).send({ success: false, message: '缺少密碼欄位' })
  }
  if (password.length < 4) {
    return res
      .status(400)
      .send({ success: false, message: '密碼必須 4 個字以上' })
  }
  if (password.length > 20) {
    return res
      .status(400)
      .send({ success: false, message: '密碼必須 20 個字以下' })
  }
  if (!/^[A-Za-z0-9]+$/.test(password)) {
    return res.status(400).send({ success: false, message: '密碼格式錯誤' })
  }
  req.body.hashedPassword = bcrypt.hashSync(password, 10)
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '註冊成功' })
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req: any, res: express.Response) => {
  try {
    const token = jwt.sign(
      { _id: req.user._id },
      process.env.SECRET as string,
      {
        expiresIn: '7 days'
      }
    )
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).send({
      success: true,
      message: '登入成功',
      result: {
        token
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req: any, res: express.Response) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token: string) => token !== req.token
    )
    await req.user.save()
    res
      .status(200)
      .send({ success: true, message: '前端自己把 token 移除吧，我根本沒做事' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req: any, res: express.Response) => {
  try {
    const idx = req.user.tokens.findIndex(
      (token: string) => token === req.token
    )
    const token = jwt.sign(
      { _id: req.user._id },
      process.env.SECRET as string,
      {
        expiresIn: '7 days'
      }
    )
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getUser = async (req: any, res: express.Response) => {
  try {
    // 因為 jwt 驗證已經在 req.body 傳入 user
    const { hashedPassword, ...returnInfo } = req.user

    res.status(200).send({
      success: true,
      message: '',
      result: { ...returnInfo }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
