import mongoose from 'mongoose'

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
            type: String,
            required: [true, '缺少數量欄位']
          },
          size: {
            type: String,
            required: [true, '缺少數量欄位']
          }
        }
      ]
    },
    deliveryMethod: {
      type: String,
      require: [true, '缺少取貨方式']
    },
    recipientName: {
      type: String,
      require: [true, '缺少取貨人姓名']
    },
    recipientPhone: {
      type: String,
      require: [true, '缺少取貨人電話']
    },
    recipientAddress: {
      type: String,
      require: [true, '缺少取貨地址']
    },
    recipientEmail: {
      type: String
    },
    orderStatus: {
      type: String,
      require: true,
      enum: {
        values: ['處理中', '已確認', '已完成', '已取消']
      },
      default: '處理中'
    },
    payStatus: {
      type: String,
      require: true,
      enum: {
        values: ['未付款', '已退款', '已付款']
      },
      default: '未付款'
    },
    sendStatus: {
      type: String,
      require: true,
      enum: {
        values: ['備貨中', '發貨中', '已到達', '已取貨', '退貨中', '已退貨']
      },
      default: '備貨中'
    },
    totalAmount: {
      type: Number,
      require: [true, '缺少總金額']
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('orders', schema)
