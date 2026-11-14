import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Router } from 'express'
import multer from 'multer'
import { deleteMaterial, listMaterials, uploadMaterial } from '../controllers/studyMaterialController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'
import { requireDatabase } from '../middleware/databaseMiddleware.js'

const router = Router()
const uploadDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads')
fs.mkdirSync(uploadDirectory, { recursive: true })
const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_req, _file, callback) => callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`),
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype === 'application/pdf'),
})

router.use(protect, requireDatabase)
router.get('/', listMaterials)
router.post('/', authorizeRoles('teacher'), upload.single('file'), uploadMaterial)
router.delete('/:id', authorizeRoles('teacher'), deleteMaterial)

export default router
