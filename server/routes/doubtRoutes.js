import { Router } from 'express'
import { answerDoubt, askDoubt, listDoubts } from '../controllers/doubtController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'
import { requireDatabase } from '../middleware/databaseMiddleware.js'

const router = Router()
router.use(protect, requireDatabase)
router.get('/lecture/:lectureId', listDoubts)
router.post('/lecture/:lectureId', authorizeRoles('student'), askDoubt)
router.patch('/:id/answer', authorizeRoles('teacher'), answerDoubt)

export default router
