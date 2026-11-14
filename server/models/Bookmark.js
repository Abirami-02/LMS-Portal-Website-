import mongoose from 'mongoose'

const bookmarkSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
  },
  { timestamps: true },
)

bookmarkSchema.index({ student: 1, lecture: 1 }, { unique: true })

export default mongoose.model('Bookmark', bookmarkSchema)
