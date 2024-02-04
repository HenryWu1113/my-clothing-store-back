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
      require: true
    },
    email: {
      type: String,
      require: true,
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
      require: true,
      enum: {
        values: ['manager', 'clerk']
      }
    },
    disabled: {
      type: Boolean,
      require: true,
      default: false
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stores',
      require: true
    },
    name: {
      type: String
    },
    sex: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: '性別錯誤'
      },
      require: true
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
    theme: {
      type: String,
      enum: {
        values: ['theme', 'light', 'dark'],
        message: '主題色錯誤'
      },
      default: 'theme'
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('admins', schema)
