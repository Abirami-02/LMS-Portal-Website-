import mongoose from 'mongoose'

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: '', maxlength: 3000 },
    videoUrl: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    scheduledAt: { type: Date },
    published: { type: Boolean, default: false },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  },
  { timestamps: true },
)

export default mongoose.model('Lecture', lectureSchema)
