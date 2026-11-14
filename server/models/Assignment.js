import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: '', maxlength: 3000 },
    instructions: { type: String, default: '', maxlength: 5000 },
    dueDate: { type: Date, required: true },
    fileUrl: { type: String, default: '' },
    originalName: { type: String, default: '' },
    published: { type: Boolean, default: false },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  },
  { timestamps: true },
)

export default mongoose.model('Assignment', assignmentSchema)
