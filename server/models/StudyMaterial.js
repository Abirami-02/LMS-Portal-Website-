import mongoose from 'mongoose'

const studyMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    fileUrl: { type: String, required: true },
    originalName: { type: String, default: '' },
    mimeType: { type: String, default: 'application/pdf' },
    fileSize: { type: Number, default: 0 },
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

export default mongoose.model('StudyMaterial', studyMaterialSchema)
