import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    outfitName: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    clerk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admins',
      required: true
    },
    images: {
      type: [String]
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: [true, '缺少商品欄位']
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
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('outfits', schema)
