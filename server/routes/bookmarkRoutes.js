import { Router } from 'express'
import { addBookmark, listBookmarks, removeBookmark } from '../controllers/bookmarkController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'
import { requireDatabase } from '../middleware/databaseMiddleware.js'

const router = Router()
router.use(protect, requireDatabase, authorizeRoles('student'))
router.get('/', listBookmarks)
router.post('/:lectureId', addBookmark)
router.delete('/:lectureId', removeBookmark)

export default router
