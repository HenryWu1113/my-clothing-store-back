/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import type express from 'express'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({
  storage: new CloudinaryStorage({ cloudinary }),
  fileFilter(req, file, cb: any) {
    if (!file.mimetype.startsWith('image')) {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false)
    } else {
      cb(null, true)
    }
  },
  limits: {
    fileSize: 1024 * 1024
  }
})

export const singleUpload = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  upload.single('singleImage')(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      console.log(error)
      let message = '上傳失敗'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        message = '檔案格式錯誤'
      }
      res.status(400).send({ success: false, message })
    } else if (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      next()
    }
  })
}

export const mutiUpload = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  upload.single('singleImage')(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      console.log(error)
      let message = '上傳失敗'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        message = '檔案格式錯誤'
      }
      res.status(400).send({ success: false, message })
    } else if (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      next()
    }
  })
}
