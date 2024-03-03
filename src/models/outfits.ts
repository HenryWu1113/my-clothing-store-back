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
            type: String,
            required: [true, '缺少商品顏色']
          },
          size: {
            type: String,
            required: [true, '缺少商品尺寸']
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
