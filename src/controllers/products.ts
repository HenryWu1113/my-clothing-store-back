/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from 'express'
import products from '../models/products'

export const createProduct = async (req: any, res: express.Response) => {
  try {
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      stockQuantity: req.body.stockQuantity,
      soldQuantity: req.body.soldQuantity,
      discountRate: req.body.discountRate,
      clothingGender: req.body.clothingGender,
      clothingPart: req.body.clothingPart,
      tags: req.body.tags ?? [],
      colors: req.body.colors ?? [],
      sizes: req.body.sizes ?? [],
      ratings: req.body.ratings ?? [],
      sell: req.body.sell,
      images:
        req.files?.map((file: any) => {
          return file.path
        }) || []
    })
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

export const getProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // 只找上架中
    const query: Record<string, any> = {
      sell: true
    }

    // 取 query string
    /** 分類(男裝、女裝) */
    const clothingGender = req.query.clothingGender

    // 有此值就加入 query 條件
    if (clothingGender) {
      query.clothingGender = clothingGender
    }

    const result = await products.find(query).populate('ratings', 'score')

    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await products.find().populate('ratings', 'score')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await products
      .findById(req.params.id)
      .populate('ratings', 'score')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editProduct = async (req: any, res: express.Response) => {
  try {
    const data: any = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      stockQuantity: req.body.stockQuantity,
      soldQuantity: req.body.soldQuantity,
      discountRate: req.body.discountRate,
      clothingGender: req.body.clothingGender,
      clothingPart: req.body.clothingPart,
      tags: req.body.tags ?? [],
      colors: req.body.colors ?? [],
      sizes: req.body.sizes ?? [],
      ratings: req.body.ratings ?? [],
      sell: req.body.sell
    }

    if (req?.files?.length > 0) {
      data.images = req.files?.map((file: any) => {
        return file.path
      })
    }

    const result = await products
      .findByIdAndUpdate(req.params.id, data, {
        new: true
      })
      .populate('ratings', 'score')
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
