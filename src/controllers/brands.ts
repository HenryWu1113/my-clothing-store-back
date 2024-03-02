/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from 'express'
import brands from '../models/brands'

export const createBrand = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log(req.body)
    const result = await brands.create(req.body)
    res.status(200).send({ success: true, message: '', result })
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

export const getBrand = async (req: express.Request, res: express.Response) => {
  try {
    const result = await brands.findById(req.params.id)
    if (!result) {
      return res.status(404).send({ success: false, message: '找不到品牌' })
    }
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getBrands = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await brands.find()
    if (!result) {
      return res.status(404).send({ success: false, message: '沒有任何品牌' })
    }
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editBrand = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await brands.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    )
    res.status(200).send({ success: true, message: '', result })
  } catch (error: any) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
