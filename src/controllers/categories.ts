/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from 'express'
import categories from '../models/categories'

export const createCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log(req.body)
    const result = await categories.create(req.body)
    res.status(200).send({ success: true, message: '', result })
  } catch (error: any) {
    console.log(error)
    if (error.code === 11000) {
      return res
        .status(400)
        .send({ success: false, message: '重複的 categoryType & key' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await categories.findById(req.params.id)
    if (!result) {
      return res.status(404).send({ success: false, message: '找不到分類' })
    }
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getCategories = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { gender, categoryType, key } = req.query
    console.log(gender, categoryType)
    const query: Record<string, any> = {}
    // 前端不會傳 all, all 代表這分類是男女共用，而不是查找用，查找 gender 不用傳
    if (gender !== undefined && gender !== 'all') {
      query.$or = [{ gender }, { gender: 'all' }]
    }
    if (categoryType !== undefined) {
      query.categoryType = categoryType
    }
    if (key !== undefined) {
      query.key = key
    }
    const result = await categories.find(query)
    if (!result) {
      return res.status(404).send({ success: false, message: '沒有任何分類' })
    }
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await categories.findByIdAndUpdate(
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

export const deleteCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await categories.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '刪除成功', result })
  } catch (error: any) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
