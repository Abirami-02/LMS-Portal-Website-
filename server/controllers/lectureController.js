import Lecture from '../models/Lecture.js'
import Module from '../models/Module.js'

function validVideoUrl(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) && (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be') || url.pathname.toLowerCase().endsWith('.mp4') || url.pathname.toLowerCase().endsWith('.webm') || url.pathname.toLowerCase().endsWith('.ogg'))
  } catch {
    return false
  }
}

const populated = (query) => query.populate('teacher', 'name email bio').populate('course', 'title').populate('module', 'title order')

export async function listLectures(req, res) {
  const filter = req.user.role === 'teacher' ? { teacher: req.user._id } : { published: true }
  if (req.query.course) filter.course = req.query.course
  const lectures = await populated(Lecture.find(filter).sort({ scheduledAt: -1, createdAt: -1 }))
  return res.json({ lectures })
}

export async function getLecture(req, res) {
  const lecture = await populated(Lecture.findById(req.params.id))
  if (!lecture || (req.user.role === 'student' && !lecture.published)) return res.status(404).json({ message: 'Lecture not found' })
  if (req.user.role === 'teacher' && lecture.teacher._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You do not own this lecture' })
  return res.json({ lecture })
}

export async function createLecture(req, res) {
  const { title, description, videoUrl, course, module: moduleId, tags = [], scheduledAt, published = false } = req.body
  if (!title?.trim() || !videoUrl || !course || !moduleId) return res.status(400).json({ message: 'Title, video URL, course, and module are required' })
  if (!validVideoUrl(videoUrl)) return res.status(400).json({ message: 'Use a YouTube URL or a direct MP4/WebM/OGG video URL' })
  const module = await Module.findOne({ _id: moduleId, course, teacher: req.user._id })
  if (!module) return res.status(404).json({ message: 'Module not found or not owned by you' })
  const lecture = await Lecture.create({ title: title.trim(), description, videoUrl: videoUrl.trim(), course, module: moduleId, tags, scheduledAt, published, teacher: req.user._id })
  return res.status(201).json({ lecture: await populated(Lecture.findById(lecture._id)) })
}

export async function updateLecture(req, res) {
  const lecture = await Lecture.findOne({ _id: req.params.id, teacher: req.user._id })
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' })
  if (req.body.videoUrl && !validVideoUrl(req.body.videoUrl)) return res.status(400).json({ message: 'Use a YouTube URL or a direct video URL' })
  for (const field of ['title', 'description', 'videoUrl', 'tags', 'scheduledAt', 'published', 'module']) {
    if (req.body[field] !== undefined) lecture[field] = req.body[field]
  }
  await lecture.save()
  return res.json({ lecture: await populated(Lecture.findById(lecture._id)) })
}

export async function deleteLecture(req, res) {
  const lecture = await Lecture.findOneAndDelete({ _id: req.params.id, teacher: req.user._id })
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' })
  return res.json({ message: 'Lecture deleted' })
}
