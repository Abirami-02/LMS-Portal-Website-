
import mongoose from 'mongoose'

let cached = globalThis.mongoose

if (!cached) {
  cached = globalThis.mongoose = {
    connection: null,
    promise: null,
  }
}

async function connectDatabase() {
  const databaseUrl = process.env.MONGODB_URI

  if (!databaseUrl) {
    throw new Error('MONGODB_URI is not configured')
  }

  if (cached.connection) {
    return cached.connection
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 5,
    })
  }

  try {
    cached.connection = await cached.promise
    console.log('MongoDB connected')
    return cached.connection
  } catch (error) {
    cached.promise = null
    throw error
  }
}

export default connectDatabase
