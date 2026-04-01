import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  updateSkills,
  toggleSavedCompany,
  getSavedCompanies,
  addApplication,
  getApplications,
  updateApplicationStatus,
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// All user routes require auth
router.use(protect)

router.get('/profile', getProfile)
router.patch('/profile', updateProfile)
router.post('/skills', updateSkills)

router.get('/saved', getSavedCompanies)
router.post('/saved/:companyId', toggleSavedCompany)

router.get('/applications', getApplications)
router.post('/applications', addApplication)
router.patch('/applications/:appId', updateApplicationStatus)

export default router
