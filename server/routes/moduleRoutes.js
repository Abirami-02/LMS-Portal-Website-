import { Router } from 'express'
import { createModule, deleteModule, listModules, updateModule } from '../controllers/moduleController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'
import { requireDatabase } from '../middleware/databaseMiddleware.js'

const router = Router()
router.use(protect, requireDatabase)
router.get('/course/:courseId', listModules)
router.post('/', authorizeRoles('teacher'), createModule)
router.patch('/:id', authorizeRoles('teacher'), updateModule)
router.delete('/:id', authorizeRoles('teacher'), deleteModule)

export default router
