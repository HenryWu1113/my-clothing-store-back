/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from 'express'
import ratings from '../models/ratings'
import products from '../models/products'

export const createRating = async (req: any, res: express.Response) => {
  try {
    const result = await ratings.create({
      ...req.body,
      user: req.user._id,
      images:
        req.files?.map((file: any) => {
          return file.path
        }) || []
    })

    const product = await products.findById(req.body.product)
    if (!product) {
      return res.status(404).send({ success: false, message: '找不到評分商品' })
    }

    product.ratings.push(result._id)

    await product.save()

    res.status(200).send({ success: true, message: '', result })
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .send({ success: false, message: '重複的 product & user' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

/** 取得該商品所有評分 */
export const getProductAllRatings = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // 使用者只回傳 avatar 和 name
    const result = await ratings
      .find({ product: req.params.productId })
      .populate('user', 'avatar name')
      .sort({ createdAt: -1 })

    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

/** 取得該使用者所有評分 */
export const getUserAllRatings = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // 使用者只回傳 avatar 和 name
    const result = await ratings
      .find({ user: req.params.userId })
      .populate('user', 'avatar name')
      .sort({ createdAt: -1 })

    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editRating = async (req: any, res: express.Response) => {
  try {
    const data: any = {
      ...req.body,
      user: req.user._id
    }

    if (req?.files?.length > 0) {
      data.images = req.files?.map((file: any) => {
        return file.path
      })
    }

    const result = await ratings.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      {
        new: true
      }
    )
    res.status(200).send({ success: true, message: '', result })
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

export const thumbUpRating = async (req: any, res: express.Response) => {
  try {
    const rating = await ratings.findById(req.params.id)
    if (!rating) {
      return res.status(404).send({ success: false, message: '找不到該筆評分' })
    }

    console.log(rating.thumb)
    console.log(req.user._id)

    if (rating.thumb.includes(req.user._id)) {
      rating.thumb = rating.thumb.filter((item) => !item.equals(req.user._id))
    } else {
      rating.thumb.push(req.user._id)
    }

    await rating.save()

    res.status(200).send({ success: true, message: '', result: rating })
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

/** 刪除評分(目前所有使用者得到這個 rating id 都有權限刪除) */
export const deleteRating = async (req: any, res: express.Response) => {
  try {
    const result = await ratings.findByIdAndDelete(req.params.id)

    const product = await products.findById(result?.product)
    if (!product) {
      return res.status(404).send({ success: false, message: '找不到評分商品' })
    }

    product.ratings = product.ratings.filter(
      (item) => !item.equals(req.params.id)
    )

    await product.save()

    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
