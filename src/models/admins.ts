/* eslint-disable @typescript-eslint/space-before-function-paren */
import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema(
  {
    account: {
      type: String,
      required: [true, '缺少帳號欄位'],
      minlength: [4, '帳號必須 4 個字以上'],
      maxlength: [20, '帳號必須 20 個字以下'],
      unique: true,
      match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
    },
    hashedPassword: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: [true, '缺少信箱欄位'],
      unique: true,
      validator: {
        validator(email: string) {
          return validator.isEmail(email)
        },
        message: '信箱格式錯誤'
      }
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
    role: {
      type: String,
      required: true,
      enum: {
        values: ['manager', 'clerk'],
        message: '權限設定錯誤'
      }
    },
    disabled: {
      type: Boolean,
      required: true,
      default: false
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stores',
      required: true
    },
    name: {
      type: String
    },
    sex: {
      type: String,
      enum: {
        values: ['男', '女'],
        message: '性別錯誤'
      },
      required: true
    },
    birthday: {
      type: String
    },
    height: {
      type: Number
    },
    weight: {
      type: Number
    },
    avatar: {
      type: String
    },
    backgroundImg: {
      type: String
    },
    introduce: {
      type: String
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('admins', schema)
