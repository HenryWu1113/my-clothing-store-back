import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 50
    },
    freeDeliveryFee: {
      type: Number,
      default: 3000
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('brands', schema)
