import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dns from 'dns'
import goalRoutes from './routes/goals.js'
import entryRoutes from './routes/entries.js'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'

dotenv.config()
dns.setServers(['8.8.8.8', '8.8.4.4'])
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/entries', entryRoutes)
app.use('/api/goals', goalRoutes)

app.get('/', (req, res) => {
  res.send('Bachat AI backend is running.')
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
})
