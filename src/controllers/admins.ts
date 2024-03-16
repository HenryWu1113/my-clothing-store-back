/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import admins from '../models/admins'
import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import validator from 'validator'

export const register = async (req: express.Request, res: express.Response) => {
  const password: string = req.body.password
  if (!password) {
    return res.status(400).send({ success: false, message: '缺少密碼欄位' })
  }
  if (password.length < 6) {
    return res
      .status(400)
      .send({ success: false, message: '密碼必須 6 個字以上' })
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
    await admins.create(req.body)
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
      { _id: req.admin._id },
      process.env.SECRET as string,
      {
        expiresIn: '7 days'
      }
    )
    req.admin.tokens.push(token)
    await req.admin.save()
    res.status(200).send({
      success: true,
      message: '登入成功',
      result: {
        token
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req: any, res: express.Response) => {
  try {
    req.admin.tokens = req.admin.tokens.filter(
      (token: string) => token !== req.token
    )
    await req.admin.save()
    res
      .status(200)
      .send({ success: true, message: '前端自己把 token 移除吧，我根本沒做事' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req: any, res: express.Response) => {
  try {
    const idx = req.admin.tokens.findIndex(
      (token: string) => token === req.token
    )
    const token = jwt.sign(
      { _id: req.admin._id },
      process.env.SECRET as string,
      {
        expiresIn: '1 days'
      }
    )
    req.admin.tokens[idx] = token
    await req.admin.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAdmin = async (req: any, res: express.Response) => {
  try {
    // 因為 jwt 驗證已經在 req.body 傳入 admin
    const deepcopyUser = _.cloneDeep(req.admin).toObject()
    delete deepcopyUser.hashedPassword
    delete deepcopyUser.tokens

    res.status(200).send({
      success: true,
      message: '',
      result: deepcopyUser
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllClerks = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await admins
      .find({ role: 'clerk' })
      .select('-tokens -hashedPassword -cart -favorites')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editAllClerks = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = {
      email: req.body.email,
      address: req.body.address,
      cellphone: req.body.cellphone,
      name: req.body.name,
      sex: req.body.sex,
      birthday: req.body.birthday,
      height: req.body.height,
      weight: req.body.weight
    }

    if (data.email !== undefined && !validator.isEmail(data.email)) {
      return res.status(400).send({ success: false, message: '信箱格式錯誤' })
    }
    if (
      data.cellphone !== undefined &&
      !validator.isMobilePhone(String(data.cellphone), 'zh-TW')
    ) {
      return res.status(400).send({ success: false, message: '不合法手機號碼' })
    }
    if (data.sex !== undefined && !['男', '女'].includes(data.sex)) {
      return res.status(400).send({ success: false, message: '性別錯誤' })
    }
    const result = await admins
      .findByIdAndUpdate(req.params.adminId, { $set: data }, { new: true })
      .select('-tokens -hashedPassword -cart -favorites')
    res
      .status(200)
      .send({ success: true, message: '更新使用者資訊成功', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editAdmin = async (req: any, res: express.Response) => {
  try {
    const data = {
      email: req.body.email,
      address: req.body.address,
      cellphone: req.body.cellphone,
      name: req.body.name,
      sex: req.body.sex,
      birthday: req.body.birthday,
      height: req.body.height,
      weight: req.body.weight
    }

    if (data.email !== undefined && !validator.isEmail(data.email)) {
      return res.status(400).send({ success: false, message: '信箱格式錯誤' })
    }
    if (
      data.cellphone !== undefined &&
      !validator.isMobilePhone(String(data.cellphone), 'zh-TW')
    ) {
      return res.status(400).send({ success: false, message: '不合法手機號碼' })
    }
    if (data.sex !== undefined && !['男', '女'].includes(data.sex)) {
      return res.status(400).send({ success: false, message: '性別錯誤' })
    }

    const result = await admins
      .findOneAndUpdate(
        { _id: req.admin._id },
        {
          $set: data
        },
        {
          new: true
        }
      )
      .select('-tokens -hashedPassword')

    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editAdminImage = (imgType: 'avatar' | 'backgroundImg') => {
  return async (req: any, res: express.Response) => {
    const Image = {
      avatar: '大頭貼',
      backgroundImg: '個人背景圖'
    }
    try {
      if (req.file) {
        const update: any = { $set: {} }
        update.$set[imgType] = req.file.path
        const result = await admins
          .findByIdAndUpdate(req.admin._id, update, {
            new: true
          })
          .select('-tokens -hashedPassword')
        return res
          .status(200)
          .send({ success: true, message: `更新${Image[imgType]}成功`, result })
      }
      res.status(200).send({ success: true, message: '沒有更新任何圖片' })
    } catch (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
