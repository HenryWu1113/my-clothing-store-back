import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    categoryType: {
      type: String,
      required: true,
      enum: {
        values: ['color', 'clothingPart', 'size'],
        message: '錯誤的分類類型'
      }
    },
    key: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ['男', '女', '全部'],
        message: '錯誤的性別分類'
      }
    }
  },
  { timestamps: true, versionKey: false }
).index({ categoryType: 1, key: 1 }, { unique: true })

export default mongoose.model('categories', schema)
