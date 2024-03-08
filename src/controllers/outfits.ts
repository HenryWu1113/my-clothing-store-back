/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from 'mongoose'
import express from 'express'
import outfits from '../models/outfits'
import admins from '../models/admins'
import admin from 'middleware/admin'

export const createOutfit = async (req: any, res: express.Response) => {
  try {
    const result = await outfits.create({
      outfitName: req.body.outfitName,
      description: req.body.description,
      clerk: req.body.clerk,
      products: req.body.products,
      show: req.body.show,
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

/** 取得穿搭(有上架的) */
export const getOutfits = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // 只找上架中
    const query: Record<string, any> = {
      show: true
    }

    const result = await outfits.find(query).sort({ createdAt: -1 })

    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

/** 取得所有穿搭(管理者用) */
export const getAllOutfits = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await outfits.find().sort({ createdAt: -1 })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

/** 取得該店員所有穿搭(店員所有自己新增的) */
export const getClerkOutfits = async (req: any, res: express.Response) => {
  try {
    const result = await outfits
      .find({ clerk: req.params.id })
      .sort({ createdAt: -1 })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getRelatedOutfits = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // $unwind 是 MongoDB 的聚合操作符之一，用於拆分陣列欄位中的每個元素為獨立的文檔，每個文檔都包含原始文檔的其餘欄位的副本。這樣做有助於處理包含陣列的文檔。
    const result = await outfits
      .aggregate([
        { $match: { show: true } },
        { $unwind: '$products' },
        {
          $match: {
            'products.product': new mongoose.Types.ObjectId(
              req.params.productId
            )
          }
        }
      ])
      .sort({ createdAt: -1 })

    // const clerks = await admins.find({ role: 'clerk' })
    const clerks = await admins.find()
    // console.log(clerks)

    const resultRefAdmins = result.map((item) => {
      const idx = clerks.findIndex((clerk) => clerk._id.equals(item.clerk))

      return {
        ...item,
        clerk: {
          name: clerks[idx].name,
          avatar: clerks[idx].avatar,
          height: clerks[idx].height,
          weight: clerks[idx].weight,
          _id: clerks[idx]._id,
          sex: clerks[idx].sex
        }
      }
    })

    res
      .status(200)
      .send({ success: true, message: '', result: resultRefAdmins })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getOutfit = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await outfits
      .findById(req.params.id)
      .populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editOutfit = async (req: any, res: express.Response) => {
  try {
    const data: any = {
      outfitName: req.body.outfitName,
      description: req.body.description,
      clerk: req.body.clerk,
      products: req.body.products,
      show: req.body.show
    }

    if (req?.files?.length > 0) {
      data.images = req.files?.map((file: any) => {
        return file.path
      })
    }

    const result = await outfits.findByIdAndUpdate(
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

export const deleteOutfit = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await outfits.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
