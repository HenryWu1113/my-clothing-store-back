import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true,
      enum: {
        values: ['北', '中', '南', '東'],
        message: '錯誤的分區'
      }
    },
    googleMapAddress: {
      type: String,
      required: true
    },
    openingTime: {
      type: String,
      required: true
    },
    sellSeries: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'categories',
          required: true,
          message: '缺少類別欄位'
        }
      ]
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('stores', schema)
