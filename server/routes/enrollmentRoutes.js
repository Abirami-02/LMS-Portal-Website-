import { Router } from 'express'
import { enroll, listEnrollments } from '../controllers/enrollmentController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'
import { requireDatabase } from '../middleware/databaseMiddleware.js'

const router = Router()
router.use(protect, requireDatabase, authorizeRoles('student'))
router.get('/', listEnrollments)
router.post('/:courseId', enroll)

export default router
