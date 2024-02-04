import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true
    },
    price: {
      type: Number,
      require: true
    },
    stockQuantity: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      require: true
    },
    image: {
      type: [String]
    },
    soldQuantity: {
      type: Number,
      default: 0
    },
    discountRate: {
      type: Float32Array,
      default: 0.0
    },
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories'
    },
    clothing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories'
    },
    colors: {
      type: [String]
    },
    sizes: {
      type: [String]
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
