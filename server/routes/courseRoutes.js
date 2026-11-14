import { Router } from 'express'
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from '../controllers/courseController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'
import { requireDatabase } from '../middleware/databaseMiddleware.js'

const router = Router()
router.use(protect, requireDatabase)
router.get('/', listCourses)
router.get('/:id', getCourse)
router.post('/', authorizeRoles('teacher'), createCourse)
router.patch('/:id', authorizeRoles('teacher'), updateCourse)
router.delete('/:id', authorizeRoles('teacher'), deleteCourse)

export default router
