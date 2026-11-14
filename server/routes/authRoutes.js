import { Router } from 'express'
import { login, me, register, updateProfile } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { requireDatabase } from '../middleware/databaseMiddleware.js'

const router = Router()

router.post('/register', requireDatabase, register)
router.post('/login', requireDatabase, login)
router.get('/me', protect, requireDatabase, me)
router.patch('/me', protect, requireDatabase, updateProfile)

export default router
