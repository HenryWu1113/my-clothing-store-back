/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from 'express'
import news from '../models/news'

export const createNews = async (req: any, res: express.Response) => {
  try {
    console.log(req.body)
    console.log(req.file)
    const result = await news.create({
      ...req.body,
      image: req.file.path
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

export const getNews = async (req: express.Request, res: express.Response) => {
  try {
    // 只找上架中
    const query: Record<string, any> = {
      show: true
    }

    const result = await news.find(query).sort({ createdAt: -1 })

    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllNews = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await news.find().sort({ createdAt: -1 })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getSingleNews = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await news.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editSingleNews = async (req: any, res: express.Response) => {
  try {
    const data: any = req.body

    if (req.file) {
      data.image = req.file.path
    }

    const result = await news.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
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
