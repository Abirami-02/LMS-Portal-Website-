import mongoose from 'mongoose'

export function requireDatabase(_req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database is not connected. Configure MONGODB_URI and start MongoDB.' })
  }
  next()
}
