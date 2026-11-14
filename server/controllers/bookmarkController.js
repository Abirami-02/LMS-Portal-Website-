import Bookmark from '../models/Bookmark.js'
import Lecture from '../models/Lecture.js'

export async function listBookmarks(req, res) {
  const bookmarks = await Bookmark.find({ student: req.user._id }).populate({ path: 'lecture', populate: [{ path: 'teacher', select: 'name' }, { path: 'course', select: 'title' }, { path: 'module', select: 'title' }] }).sort({ createdAt: -1 })
  return res.json({ bookmarks })
}

export async function addBookmark(req, res) {
  const lecture = await Lecture.findOne({ _id: req.params.lectureId, published: true })
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' })
  const bookmark = await Bookmark.findOneAndUpdate({ student: req.user._id, lecture: lecture._id }, { student: req.user._id, lecture: lecture._id }, { upsert: true, new: true, setDefaultsOnInsert: true })
  return res.status(201).json({ bookmark })
}

export async function removeBookmark(req, res) {
  await Bookmark.findOneAndDelete({ student: req.user._id, lecture: req.params.lectureId })
  return res.json({ message: 'Bookmark removed' })
}
