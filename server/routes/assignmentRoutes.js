import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Router } from 'express'
import multer from 'multer'
import { createAssignment, deleteAssignment, getAssignment, listAssignments, listSubmissions, submitAssignment, updateAssignment } from '../controllers/assignmentController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'
import { requireDatabase } from '../middleware/databaseMiddleware.js'

const router = Router()
const uploadDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads')
fs.mkdirSync(uploadDirectory, { recursive: true })
const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.bin'
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } })

router.use(protect, requireDatabase)
router.get('/', listAssignments)
router.get('/:id/submissions', authorizeRoles('teacher'), listSubmissions)
router.get('/:id', getAssignment)
router.post('/', authorizeRoles('teacher'), upload.single('file'), createAssignment)
router.patch('/:id', authorizeRoles('teacher'), upload.single('file'), updateAssignment)
router.delete('/:id', authorizeRoles('teacher'), deleteAssignment)
router.post('/:id/submit', authorizeRoles('student'), upload.single('file'), submitAssignment)

export default router
