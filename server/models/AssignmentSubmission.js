import mongoose from 'mongoose'

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    originalName: { type: String, default: '' },
    note: { type: String, default: '', maxlength: 2000 },
    submittedAt: { type: Date, default: Date.now },
    grade: { type: Number, min: 0, max: 100 },
    feedback: { type: String, default: '', maxlength: 3000 },
  },
  { timestamps: true },
)

assignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true })

export default mongoose.model('AssignmentSubmission', assignmentSubmissionSchema)
