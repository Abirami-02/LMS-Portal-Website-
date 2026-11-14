import Assignment from '../models/Assignment.js'
import AssignmentSubmission from '../models/AssignmentSubmission.js'
import Course from '../models/Course.js'
import Module from '../models/Module.js'

const populatedAssignment = (query) => query.populate('teacher', 'name email bio').populate('course', 'title').populate('module', 'title order')

function serializeSubmission(submission) {
  if (!submission) return null
  return { id: submission._id, fileUrl: submission.fileUrl, originalName: submission.originalName, note: submission.note, submittedAt: submission.submittedAt, grade: submission.grade, feedback: submission.feedback }
}

export async function listAssignments(req, res) {
  const filter = req.user.role === 'teacher' ? { teacher: req.user._id } : { published: true }
  const assignments = await populatedAssignment(Assignment.find(filter).sort({ dueDate: 1, createdAt: -1 }))
  if (req.user.role === 'teacher') return res.json({ assignments })

  const submissions = await AssignmentSubmission.find({ student: req.user._id, assignment: { $in: assignments.map((assignment) => assignment._id) } })
  const submissionMap = new Map(submissions.map((submission) => [submission.assignment.toString(), serializeSubmission(submission)]))
  return res.json({ assignments: assignments.map((assignment) => ({ ...assignment.toObject(), submission: submissionMap.get(assignment._id.toString()) || null })) })
}

export async function getAssignment(req, res) {
  const assignment = await populatedAssignment(Assignment.findById(req.params.id))
  if (!assignment || (req.user.role === 'student' && !assignment.published)) return res.status(404).json({ message: 'Assignment not found' })
  if (req.user.role === 'teacher' && assignment.teacher._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You do not own this assignment' })
  const submission = req.user.role === 'student' ? await AssignmentSubmission.findOne({ assignment: assignment._id, student: req.user._id }) : null
  return res.json({ assignment: { ...assignment.toObject(), submission: serializeSubmission(submission) } })
}

export async function createAssignment(req, res) {
  const { title, description, instructions, dueDate, course, module: moduleId, published = false } = req.body
  if (!title?.trim() || !dueDate || !course || !moduleId) return res.status(400).json({ message: 'Title, deadline, course, and module are required' })
  if (new Date(dueDate) <= new Date()) return res.status(400).json({ message: 'Deadline must be in the future' })
  const courseRecord = await Course.findOne({ _id: course, teacher: req.user._id })
  const moduleRecord = await Module.findOne({ _id: moduleId, course, teacher: req.user._id })
  if (!courseRecord || !moduleRecord) return res.status(404).json({ message: 'Course or module not found or not owned by you' })
  const assignment = await Assignment.create({ title: title.trim(), description, instructions, dueDate, course, module: moduleId, published, teacher: req.user._id, fileUrl: req.file ? `/uploads/${req.file.filename}` : '', originalName: req.file?.originalname || '' })
  return res.status(201).json({ assignment: await populatedAssignment(Assignment.findById(assignment._id)) })
}

export async function updateAssignment(req, res) {
  const assignment = await Assignment.findOne({ _id: req.params.id, teacher: req.user._id })
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  if (req.body.dueDate && new Date(req.body.dueDate) <= new Date()) return res.status(400).json({ message: 'Deadline must be in the future' })
  for (const field of ['title', 'description', 'instructions', 'dueDate', 'published']) {
    if (req.body[field] !== undefined) assignment[field] = req.body[field]
  }
  if (req.file) {
    assignment.fileUrl = `/uploads/${req.file.filename}`
    assignment.originalName = req.file.originalname
  }
  await assignment.save()
  return res.json({ assignment: await populatedAssignment(Assignment.findById(assignment._id)) })
}

export async function deleteAssignment(req, res) {
  const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, teacher: req.user._id })
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  await AssignmentSubmission.deleteMany({ assignment: assignment._id })
  return res.json({ message: 'Assignment deleted' })
}

export async function submitAssignment(req, res) {
  const assignment = await Assignment.findOne({ _id: req.params.id, published: true })
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  if (new Date() > assignment.dueDate) return res.status(400).json({ message: 'The assignment deadline has passed. Submissions are closed.' })
  if (!req.file) return res.status(400).json({ message: 'Choose a submission file before uploading' })
  const submission = await AssignmentSubmission.findOneAndUpdate(
    { assignment: assignment._id, student: req.user._id },
    { assignment: assignment._id, student: req.user._id, fileUrl: `/uploads/${req.file.filename}`, originalName: req.file.originalname, note: req.body.note || '', submittedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
  return res.status(201).json({ submission: serializeSubmission(submission), message: 'Assignment submitted successfully' })
}

export async function listSubmissions(req, res) {
  const assignment = await Assignment.findOne({ _id: req.params.id, teacher: req.user._id })
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' })
  const submissions = await AssignmentSubmission.find({ assignment: assignment._id }).populate('student', 'name email').sort({ submittedAt: -1 })
  return res.json({ submissions })
}
