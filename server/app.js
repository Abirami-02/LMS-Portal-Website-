import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import healthRoutes from './routes/healthRoutes.js'
import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import moduleRoutes from './routes/moduleRoutes.js'
import lectureRoutes from './routes/lectureRoutes.js'
import studyMaterialRoutes from './routes/studyMaterialRoutes.js'
import bookmarkRoutes from './routes/bookmarkRoutes.js'
import doubtRoutes from './routes/doubtRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'
import assignmentRoutes from './routes/assignmentRoutes.js'

dotenv.config()

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configuredClientUrls = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = origin?.replace(/\/$/, '')
    const isLocalDevelopmentOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin || '')
    if (!origin || configuredClientUrls.includes(normalizedOrigin) || isLocalDevelopmentOrigin) return callback(null, true)
    return callback(new Error('Origin is not allowed by CORS'))
  },
}))
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (_req, res) => {
  res.json({ name: 'Smart Learning Portal API', status: 'online' })
})

app.use('/api/health', healthRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/modules', moduleRoutes)
app.use('/api/lectures', lectureRoutes)
app.use('/api/study-materials', studyMaterialRoutes)
app.use('/api/bookmarks', bookmarkRoutes)
app.use('/api/doubts', doubtRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/assignments', assignmentRoutes)

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Something went wrong on the server' })
})

export default app
