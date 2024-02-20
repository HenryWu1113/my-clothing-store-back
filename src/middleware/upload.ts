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
  storage: new CloudinaryStorage({
    cloudinary
  }),
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

/**
 * 上傳圖片到 cloudinary
 * @param {'single'|'mutiple'} type 單張多張
 * @param {string} key 跟前端送過來的 key 要對應到
 * @returns cloudinary Function
 */
export const uploadImage = (type: 'single' | 'mutiple', key: string) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (type === 'single') {
      upload.single(key)(req, res, async (error) => {
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
    } else if (type === 'mutiple') {
      upload.array(key)(req, res, async (error) => {
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
    } else {
      res
        .status(404)
        .send({ success: false, message: '找不到上傳類型(單張或多張)' })
    }
  }
}

// export const singleUpload = async (
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) => {
//   upload.single('singleImage')(req, res, async (error) => {
//     if (error instanceof multer.MulterError) {
//       console.log(error)
//       let message = '上傳失敗'
//       if (error.code === 'LIMIT_FILE_SIZE') {
//         message = '檔案太大'
//       } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
//         message = '檔案格式錯誤'
//       }
//       res.status(400).send({ success: false, message })
//     } else if (error) {
//       res.status(500).send({ success: false, message: '伺服器錯誤' })
//     } else {
//       next()
//     }
//   })
// }

// export const mutiUpload = async (
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) => {
//   upload.array('images')(req, res, async (error) => {
//     if (error instanceof multer.MulterError) {
//       console.log(error)
//       let message = '上傳失敗'
//       if (error.code === 'LIMIT_FILE_SIZE') {
//         message = '檔案太大'
//       } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
//         message = '檔案格式錯誤'
//       }
//       res.status(400).send({ success: false, message })
//     } else if (error) {
//       res.status(500).send({ success: false, message: '伺服器錯誤' })
//     } else {
//       next()
//     }
//   })
// }
