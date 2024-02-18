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
      default: 0.0
    },
    clothingGender: {
      type: String,
      required: true
    },
    clothingPart: {
      type: String,
      required: true
    },
    tags: {
      type: [String]
    },
    colors: {
      type: [String],
      required: true
    },
    sizes: {
      type: [String],
      required: true
    },
    rating: {
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
