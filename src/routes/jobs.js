import { Router } from 'express'
import { getAllJobs, searchJobs, getJobsByCompany } from '../controllers/jobsController.js'

const router = Router()

router.get('/', getAllJobs)
router.get('/search', searchJobs)
router.get('/:companySlug', getJobsByCompany)

export default router
