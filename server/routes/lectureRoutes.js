import { Router } from 'express'
import { createLecture, deleteLecture, getLecture, listLectures, updateLecture } from '../controllers/lectureController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'
import { requireDatabase } from '../middleware/databaseMiddleware.js'

const router = Router()
router.use(protect, requireDatabase)
router.get('/', listLectures)
router.get('/:id', getLecture)
router.post('/', authorizeRoles('teacher'), createLecture)
router.patch('/:id', authorizeRoles('teacher'), updateLecture)
router.delete('/:id', authorizeRoles('teacher'), deleteLecture)

export default router
