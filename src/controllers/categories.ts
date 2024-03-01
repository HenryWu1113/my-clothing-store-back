/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from 'express'
import categories from '../models/categories'

export const createCategory = async (req: express.Request, res: express.Response) => {
  try {
    console.log(req.body)
    const result = await categories.create(req.body)
    res.status(200).send({ success: true, message: '', result })
  } catch (error: any) {
    console.log(error)
    if (error.code === 11000) {
      return res.status(400).send({ success: false, message: '重複的 categoryType & key' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const editCategory = async (req: express.Request, res: express.Response) => {
  try {
    console.log(req.body)
    const result = await categories.findByIdAndUpdate(req.body._id, {
      $set: req.body
    }, { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error: any) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
