import mongoose from 'mongoose'

const doubtSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
    question: { type: String, required: true, trim: true, maxlength: 1000 },
    answer: { type: String, default: '', maxlength: 2000 },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['open', 'answered'], default: 'open' },
  },
  { timestamps: true },
)

export default mongoose.model('Doubt', doubtSchema)
