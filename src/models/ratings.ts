import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    description: {
      type: String
    },
    images: {
      type: [String]
    },
    thumb: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
          required: true
        }
      ]
    }
  },
  { timestamps: true, versionKey: false }
).index({ product: 1, user: 1 }, { unique: true })

export default mongoose.model('ratings', schema)
