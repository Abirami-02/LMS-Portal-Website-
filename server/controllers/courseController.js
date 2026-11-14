import Course from '../models/Course.js'

export async function listCourses(req, res) {
  const filter = req.user.role === 'teacher' ? { teacher: req.user._id } : { published: true }
  const courses = await Course.find(filter).populate('teacher', 'name email').sort({ createdAt: -1 })
  return res.json({ courses })
}

export async function getCourse(req, res) {
  const course = await Course.findById(req.params.id).populate('teacher', 'name email bio')
  if (!course || (req.user.role === 'student' && !course.published)) return res.status(404).json({ message: 'Course not found' })
  if (req.user.role === 'teacher' && course.teacher._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You do not own this course' })
  return res.json({ course })
}

export async function createCourse(req, res) {
  const { title, description, thumbnail, published } = req.body
  if (!title?.trim()) return res.status(400).json({ message: 'Course title is required' })
  const course = await Course.create({ title: title.trim(), description, thumbnail, published, teacher: req.user._id })
  return res.status(201).json({ course })
}

export async function updateCourse(req, res) {
  const course = await Course.findOne({ _id: req.params.id, teacher: req.user._id })
  if (!course) return res.status(404).json({ message: 'Course not found' })
  for (const field of ['title', 'description', 'thumbnail', 'published']) {
    if (req.body[field] !== undefined) course[field] = req.body[field]
  }
  await course.save()
  return res.json({ course })
}

export async function deleteCourse(req, res) {
  const course = await Course.findOneAndDelete({ _id: req.params.id, teacher: req.user._id })
  if (!course) return res.status(404).json({ message: 'Course not found' })
  return res.json({ message: 'Course deleted' })
}
