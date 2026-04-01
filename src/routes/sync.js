import { Router } from 'express'
import { syncCompanies, liveJobSearch } from '../controllers/syncController.js'
const router = Router()
router.post('/companies', syncCompanies)
router.get('/jobs', liveJobSearch)
export default router