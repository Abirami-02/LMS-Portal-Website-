import app from './app.js'
import connectDatabase from './config/db.js'

const port = Number(process.env.PORT) || 5000

async function startServer() {
  await connectDatabase()
  app.listen(port, '0.0.0.0', () => {
    console.log(`Smart Learning Portal API running on port ${port}`)
  })
}

startServer().catch((error) => {
  console.error('Unable to start server:', error.message)
  process.exit(1)
})
