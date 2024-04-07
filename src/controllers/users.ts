/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import users from '../models/users'
import products from '../models/products'
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
    const deepcopyUser = _.cloneDeep(req.user).toObject()
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

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await users
      .find()
      .select('-tokens -hashedPassword -cart -favorites')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // 不給更新 email 因為他目前當作登入帳號
    const data = {
      // email: req.body.email,
      address: req.body.address,
      cellphone: req.body.cellphone,
      name: req.body.name,
      sex: req.body.sex,
      birthday: req.body.birthday,
      disabled: req.body.disabled
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

    const result = await users
      .findByIdAndUpdate(req.params.userId, { $set: data }, { new: true })
      .select('-tokens -hashedPassword -cart -favorites')
    res
      .status(200)
      .send({ success: true, message: '更新使用者資訊成功', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editUser = async (req: any, res: express.Response) => {
  try {
    // 不給更新 email 因為他目前當作登入帳號
    const data = {
      // email: req.body.email,
      address: req.body.address,
      cellphone: req.body.cellphone,
      name: req.body.name,
      sex: req.body.sex,
      birthday: req.body.birthday
    }

    // if (data.email !== undefined && !validator.isEmail(data.email)) {
    //   return res.status(400).send({ success: false, message: '信箱格式錯誤' })
    // }
    if (
      data.cellphone !== undefined &&
      !validator.isMobilePhone(String(data.cellphone), 'zh-TW')
    ) {
      return res.status(400).send({ success: false, message: '不合法手機號碼' })
    }
    if (data.sex !== undefined && !['男', '女'].includes(data.sex)) {
      return res.status(400).send({ success: false, message: '性別錯誤' })
    }

    const result = await users
      .findOneAndUpdate(
        { _id: req.user._id },
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

export const editUserImage = (imgType: 'avatar' | 'backgroundImg') => {
  return async (req: any, res: express.Response) => {
    const Image = {
      avatar: '大頭貼',
      backgroundImg: '個人背景圖'
    }
    try {
      if (req.file) {
        const update: any = { $set: {} }
        update.$set[imgType] = req.file.path
        const result = await users
          .findByIdAndUpdate(req.user._id, update, {
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

export const addCart = async (req: any, res: express.Response) => {
  try {
    // req.body.product是商品 _id
    const result = await products.findById(req.body.product)
    if (!result || !result.sell) {
      return res.status(404).send({ success: false, message: '商品不存在' })
    }

    const idx = req.user.cart.findIndex(
      (item: {
        product: string
        quantity: number
        color: string
        size: string
      }) =>
        item.product.toString() === req.body.product &&
        item.color === req.body.color &&
        item.size === req.body.size
    )

    console.log(idx)

    if (idx === -1) {
      req.user.cart.push({
        product: req.body.product,
        quantity: req.body.quantity,
        color: req.body.color,
        size: req.body.size
      })
    } else {
      req.user.cart[idx].quantity += req.body.quantity
    }

    await req.user.save()
    res
      .status(200)
      .send({ success: true, message: '', result: req.user.cart.length })
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const editCart = async (req: any, res: express.Response) => {
  // 試一下 mongoose 語法
  try {
    let user: any = 0

    if (req.body.quantity <= 0) {
      user = await users.findOneAndUpdate(
        {
          _id: req.user.id,
          'cart.product': req.body.product,
          'cart.color': req.body.color,
          'cart.size': req.body.size
        },
        {
          $pull: {
            cart: {
              product: req.body.product,
              color: req.body.color,
              size: req.body.size
            }
          }
        },
        { new: true }
      )
    } else {
      user = await users.findOneAndUpdate(
        {
          _id: req.user.id,
          'cart.product': req.body.product,
          'cart.color': req.body.color,
          'cart.size': req.body.size
        },
        {
          $set: {
            'cart.$.quantity': req.body.quantity
          }
        },
        { new: true }
      )
    }

    res
      .status(200)
      .send({ success: true, message: '', result: user.cart.length ?? 0 })
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getCart = async (req: any, res: express.Response) => {
  try {
    const result = await users
      .findById(req.user._id, 'cart')
      .populate('cart.product')

    if (!result) {
      return res.status(404).send({ success: false, message: '找不到使用者' })
    }
    res.status(200).send({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const updateFav = async (req: any, res: express.Response) => {
  try {
    const result = await products.findById(req.body.product)
    if (!result || !result.sell) {
      return res.status(404).send({ success: false, message: '商品不存在' })
    }

    const idx = req.user.favorites.findIndex(
      (item: any) => item.toString() === req.body.product
    )
    let str: string = ''
    if (idx === -1) {
      str = '加入'
      req.user.favorites.push(req.body.product)
    } else {
      str = '移除'
      req.user.favorites = req.user.favorites.filter(
        (item: any) => item.toString() !== req.body.product
      )
    }

    // req.user.favorites.push(req.body.product)
    await req.user.save()
    res.status(200).send({
      success: true,
      message: `${str}收藏成功`,
      result: req.user.favorites
    })
  } catch (error: any) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getFavs = async (req: any, res: express.Response) => {
  try {
    const result: any = await users
      .findById(req.user._id, 'favorites')
      .populate({
        path: 'favorites',
        populate: {
          path: 'ratings',
          select: 'score _id' // 只返回 score 和 _id 字段
        }
      })
    console.log(result)
    res
      .status(200)
      .send({ success: true, message: '', result: result.favorites })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
