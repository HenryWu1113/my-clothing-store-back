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
      type: Number,
      default: 0.0
    },
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
      required: true
    },
    clothing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
      required: true
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
