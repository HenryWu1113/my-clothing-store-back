/* eslint-disable @typescript-eslint/space-before-function-paren */
import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validator: {
        validator(email: string) {
          return validator.isEmail(email)
        },
        message: '信箱格式錯誤'
      }
    },
    hashedPassword: {
      type: String,
      required: true
    },
    address: {
      type: String
    },
    cellphone: {
      type: String,
      validator: {
        validator(phoneNumber: string) {
          return validator.isMobilePhone(phoneNumber, 'zh-TW')
        },
        message: '不合法手機號碼'
      }
    },
    tokens: {
      type: [String]
    },
    disabled: {
      type: Boolean,
      required: true,
      default: false
    },
    name: {
      type: String
    },
    sex: {
      type: String,
      enum: {
        values: ['男', '女'],
        message: '性別錯誤'
      }
    },
    birthday: {
      type: String
    },
    avatar: {
      type: String
    },
    backgroundImg: {
      type: String
    },
    favorites: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
          message: '缺少商品欄位'
        }
      ]
    },
    cart: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: [true, '缺少商品欄位']
          },
          quantity: {
            type: Number,
            required: [true, '缺少數量欄位']
          },
          color: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories',
            required: [true, '缺少顏色欄位']
          },
          size: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories',
            required: [true, '缺少尺寸欄位']
          }
        }
      ]
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('users', schema)
