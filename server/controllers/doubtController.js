import Doubt from '../models/Doubt.js'
import Lecture from '../models/Lecture.js'

export async function listDoubts(req, res) {
  const lecture = await Lecture.findById(req.params.lectureId)
  if (!lecture || (req.user.role === 'student' && !lecture.published) || (req.user.role === 'teacher' && lecture.teacher.toString() !== req.user._id.toString())) {
    return res.status(404).json({ message: 'Lecture not found' })
  }
  const doubts = await Doubt.find({ lecture: req.params.lectureId }).populate('student', 'name').populate('answeredBy', 'name').sort({ createdAt: -1 })
  return res.json({ doubts })
}

export async function askDoubt(req, res) {
  const lecture = await Lecture.findOne({ _id: req.params.lectureId, published: true })
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' })
  if (!req.body.question?.trim()) return res.status(400).json({ message: 'Question is required' })
  const doubt = await Doubt.create({ lecture: lecture._id, student: req.user._id, question: req.body.question.trim() })
  return res.status(201).json({ doubt: await Doubt.findById(doubt._id).populate('student', 'name') })
}

export async function answerDoubt(req, res) {
  const doubt = await Doubt.findById(req.params.id).populate('lecture')
  if (!doubt || doubt.lecture.teacher.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Doubt not found' })
  if (!req.body.answer?.trim()) return res.status(400).json({ message: 'Answer is required' })
  doubt.answer = req.body.answer.trim()
  doubt.answeredBy = req.user._id
  doubt.status = 'answered'
  await doubt.save()
  return res.json({ doubt })
}
