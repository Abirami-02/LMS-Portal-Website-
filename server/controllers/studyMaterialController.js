import StudyMaterial from '../models/StudyMaterial.js'
import Lecture from '../models/Lecture.js'

export async function listMaterials(req, res) {
  const filter = req.user.role === 'teacher' ? { uploadedBy: req.user._id } : {}
  if (req.user.role === 'student') {
    const publishedLectures = await Lecture.find({ published: true }).distinct('_id')
    filter.lecture = { $in: publishedLectures }
  }
  if (req.query.lecture) filter.lecture = req.query.lecture
  const materials = await StudyMaterial.find(filter).populate('lecture', 'title').populate('course', 'title').sort({ createdAt: -1 })
  return res.json({ materials })
}

export async function uploadMaterial(req, res) {
  const { title, lecture: lectureId } = req.body
  if (!title?.trim() || !lectureId || !req.file) return res.status(400).json({ message: 'Title, lecture, and a PDF file are required' })
  const lecture = await Lecture.findOne({ _id: lectureId, teacher: req.user._id })
  if (!lecture) return res.status(404).json({ message: 'Lecture not found or not owned by you' })
  const material = await StudyMaterial.create({ title: title.trim(), fileUrl: `/uploads/${req.file.filename}`, originalName: req.file.originalname, mimeType: req.file.mimetype, fileSize: req.file.size, lecture: lecture._id, course: lecture.course, module: lecture.module, uploadedBy: req.user._id })
  return res.status(201).json({ material })
}

export async function deleteMaterial(req, res) {
  const material = await StudyMaterial.findOneAndDelete({ _id: req.params.id, uploadedBy: req.user._id })
  if (!material) return res.status(404).json({ message: 'Study material not found' })
  return res.json({ message: 'Study material deleted' })
}
