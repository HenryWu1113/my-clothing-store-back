import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    images: {
      type: [String]
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model('news', schema)
