import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import cron from 'node-cron'

import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import companyRoutes from './routes/companies.js'
import userRoutes from './routes/users.js'
import syncRoutes from './routes/sync.js'
import jobRoutes from './routes/jobs.js'
import { scrapeAllCompanies } from './services/scraper.js'

const app = express()
const PORT = process.env.PORT || 5000

// ── Security & Middleware ─────────────────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  })
)
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many requests, slow down!' },
})
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
})

app.use('/api/auth', authLimiter)
app.use('/api', apiLimiter)

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/users', userRoutes)
app.use('/api/sync', syncRoutes)
app.use('/api/jobs', jobRoutes)

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, time: new Date().toISOString() })
)

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
)

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// ── Cron: Scrape jobs every day at 2 AM ──────────────────────────────────────
cron.schedule('0 2 * * *', () => {
  console.log('⏰ Daily job scrape triggered')
  scrapeAllCompanies()
})

// ── Start ─────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 JobRadar backend running on http://localhost:${PORT}`)
    console.log(`📡 Environment: ${process.env.NODE_ENV}`)
  })
})
