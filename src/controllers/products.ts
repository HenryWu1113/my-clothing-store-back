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
    const result = await products.find({ sell: true })
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
    const result = await products.find()
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
    const result = await products.findById(req.params.id)
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

    const result = await products.findByIdAndUpdate(req.params.id, data, {
      new: true
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
