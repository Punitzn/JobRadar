import { Router } from 'express'
import { body } from 'express-validator'
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  addReview,
  getHeatmap,
} from '../controllers/companyController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

// Public (skill match enriched if logged in)
router.get('/', getCompanies)          // optional auth via try/catch in middleware if needed
router.get('/heatmap', getHeatmap)
router.get('/:slug', getCompany)

// Protected
router.post(
  '/:slug/reviews',
  protect,
  [
    body('text').trim().notEmpty().isLength({ max: 1000 }).withMessage('Review text required (max 1000 chars)'),
    body('rating').isFloat({ min: 1, max: 10 }).withMessage('Rating must be 1-10'),
    body('outcome').isIn(['hired', 'rejected', 'ghosted', 'withdrew', 'pending']),
  ],
  addReview
)

// Admin only
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').trim().notEmpty(),
    body('sector').notEmpty(),
  ],
  createCompany
)
router.patch('/:slug', protect, adminOnly, updateCompany)

export default router
