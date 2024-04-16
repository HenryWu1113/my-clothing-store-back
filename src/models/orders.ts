/* eslint-disable @typescript-eslint/space-before-function-paren */
import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, '缺少使用者欄位']
    },
    products: {
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
          },
          price: {
            type: Number,
            required: [true, '沒有當前價格']
          }
        }
      ]
    },
    payMethod: {
      type: String,
      required: [true, '缺少付款方式']
    },
    deliveryMethod: {
      type: String,
      required: [true, '缺少取貨方式']
    },
    recipientName: {
      type: String,
      required: [true, '缺少取貨人姓名']
    },
    recipientPhone: {
      type: String,
      validator: {
        validator(phoneNumber: string) {
          return validator.isMobilePhone(phoneNumber, 'zh-TW')
        },
        message: '不合法手機號碼'
      },
      required: [true, '缺少取貨人電話']
    },
    recipientAddress: {
      type: String,
      required: [true, '缺少取貨地址']
    },
    recipientEmail: {
      type: String,
      validator: {
        validator(email: string) {
          return validator.isEmail(email)
        },
        message: '信箱格式錯誤'
      }
    },
    orderStatus: {
      type: String,
      required: true,
      enum: {
        values: ['處理中', '已確認', '已完成', '已取消']
      },
      default: '處理中'
    },
    payStatus: {
      type: String,
      required: true,
      enum: {
        values: ['未付款', '已退款', '已付款']
      },
      default: '未付款'
    },
    sendStatus: {
      type: String,
      required: true,
      enum: {
        values: ['備貨中', '發貨中', '已到達', '已取貨', '退貨中', '已退貨']
      },
      default: '備貨中'
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: [true, '缺少總金額']
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('orders', schema)
