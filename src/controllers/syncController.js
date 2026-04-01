import { syncCompaniesFromJSearch, fetchJobsFromJSearch } from '../services/jsearch.js'
import { success, error } from '../utils/response.js'

export const syncCompanies = async (req, res) => {
  try {
    const result = await syncCompaniesFromJSearch()
    success(res, result, 'Sync complete')
  } catch (err) {
    error(res, err.message)
  }
}

export const liveJobSearch = async (req, res) => {
  const { q = 'software engineer India', page = 1 } = req.query
  try {
    const jobs = await fetchJobsFromJSearch(q, Number(page))
    success(res, { jobs: jobs.map(j => ({ id: j.job_id, title: j.job_title, company: j.employer_name, location: j.job_city || 'India', type: j.job_is_remote ? 'remote' : 'hybrid', url: j.job_apply_link, postedAt: j.job_posted_at_datetime_utc, logo: j.employer_logo })), total: jobs.length })
  } catch (err) {
    error(res, err.message)
  }
}