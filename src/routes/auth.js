import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, refresh, logout, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  ],
  register
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  login
)

router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', protect, getMe)

export default router
