import mongoose from 'mongoose'

async function connectDatabase() {
  const databaseUrl = process.env.MONGODB_URI

  if (!databaseUrl) {
    console.warn('MONGODB_URI is not configured. Starting without a database connection.')
    return
  }

  try {
    await mongoose.connect(databaseUrl, { serverSelectionTimeoutMS: 5000 })
    console.log('MongoDB connected')
  } catch (error) {
    console.warn(`MongoDB connection unavailable: ${error.message}`)
    console.warn('The API will continue running; database-backed features require MongoDB.')
  }
}

export default connectDatabase
