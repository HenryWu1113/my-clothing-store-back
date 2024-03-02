/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from 'express'
import stores from '../models/stores'

export const createStore = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log(req.body)
    const result = await stores.create(req.body)
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

export const getStore = async (req: express.Request, res: express.Response) => {
  try {
    const result = await stores.findById(req.params.id).populate('sellSeries')
    if (!result) {
      return res.status(404).send({ success: false, message: '找不到店鋪' })
    }
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getStores = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await stores.find().populate('sellSeries')
    if (!result) {
      return res.status(404).send({ success: false, message: '沒有任何店鋪' })
    }
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editStore = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await stores.findByIdAndUpdate(
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

export const deleteStore = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await stores.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '刪除成功', result })
  } catch (error: any) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
