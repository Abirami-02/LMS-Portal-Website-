import Course from '../models/Course.js'
import Module from '../models/Module.js'

async function ownedCourse(courseId, teacherId) {
  return Course.findOne({ _id: courseId, teacher: teacherId })
}

export async function listModules(req, res) {
  const course = await Course.findById(req.params.courseId)
  if (!course) return res.status(404).json({ message: 'Course not found' })
  if ((req.user.role === 'teacher' && course.teacher.toString() !== req.user._id.toString()) || (req.user.role === 'student' && !course.published)) {
    return res.status(403).json({ message: 'You do not have access to this course' })
  }
  const modules = await Module.find({ course: req.params.courseId }).sort({ order: 1, createdAt: 1 })
  return res.json({ modules })
}

export async function createModule(req, res) {
  const course = await ownedCourse(req.body.course, req.user._id)
  if (!course) return res.status(404).json({ message: 'Course not found or not owned by you' })
  if (!req.body.title?.trim()) return res.status(400).json({ message: 'Module title is required' })
  const module = await Module.create({ ...req.body, title: req.body.title.trim(), teacher: req.user._id })
  return res.status(201).json({ module })
}

export async function updateModule(req, res) {
  const module = await Module.findOne({ _id: req.params.id, teacher: req.user._id })
  if (!module) return res.status(404).json({ message: 'Module not found' })
  for (const field of ['title', 'description', 'order']) {
    if (req.body[field] !== undefined) module[field] = req.body[field]
  }
  await module.save()
  return res.json({ module })
}

export async function deleteModule(req, res) {
  const module = await Module.findOneAndDelete({ _id: req.params.id, teacher: req.user._id })
  if (!module) return res.status(404).json({ message: 'Module not found' })
  return res.json({ message: 'Module deleted' })
}
