import Course from '../models/Course.js'
import Enrollment from '../models/Enrollment.js'

export async function enroll(req, res) {
  const course = await Course.findOne({ _id: req.params.courseId, published: true })
  if (!course) return res.status(404).json({ message: 'Course not found' })
  const enrollment = await Enrollment.findOneAndUpdate({ student: req.user._id, course: course._id }, { student: req.user._id, course: course._id }, { upsert: true, new: true, setDefaultsOnInsert: true }).populate('course', 'title description')
  return res.status(201).json({ enrollment })
}

export async function listEnrollments(req, res) {
  const enrollments = await Enrollment.find({ student: req.user._id }).populate('course', 'title description thumbnail teacher').sort({ createdAt: -1 })
  return res.json({ enrollments })
}
