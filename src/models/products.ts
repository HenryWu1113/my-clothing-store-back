import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true
    },
    stockQuantity: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: true
    },
    images: {
      type: [String]
    },
    soldQuantity: {
      type: Number,
      default: 0
    },
    discountRate: {
      type: Number,
      default: 0,
      max: 100
    },
    clothingGender: {
      type: String,
      required: true
    },
    clothingPart: {
      type: String,
      required: [true, '缺少衣服分類']
    },
    tags: {
      type: [String]
    },
    colors: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'categories',
          required: [true, '缺少顏色']
        }
      ],
      required: true
    },
    sizes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'categories',
          required: [true, '缺少尺寸']
        }
      ],
      required: true
    },
    ratings: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ratings',
          required: [true, '缺少評分']
        }
      ]
    },
    sell: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('products', schema)
