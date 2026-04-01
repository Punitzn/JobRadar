import Company from '../models/Company.js'
import { fetchJobsFromRapidAPI } from '../services/scraper.js'
import { success, error } from '../utils/response.js'

// GET /api/jobs — all open roles across companies
export const getAllJobs = async (req, res) => {
  try {
    const { sector, type, search, page = 1, limit = 30 } = req.query

    const filter = { 'openRoles.0': { $exists: true } }
    if (sector) filter.sector = sector

    const companies = await Company.find(filter).select('name slug sector openRoles')

    let jobs = []
    for (const c of companies) {
      for (const role of c.openRoles) {
        if (type && role.type !== type) continue
        if (search && !role.title.toLowerCase().includes(search.toLowerCase())) continue
        jobs.push({
          ...role.toObject(),
          company: { name: c.name, slug: c.slug, sector: c.sector },
        })
      }
    }

    // Paginate in memory
    const start = (Number(page) - 1) * Number(limit)
    const paginated = jobs.slice(start, start + Number(limit))

    success(res, {
      jobs: paginated,
      pagination: { total: jobs.length, page: Number(page), pages: Math.ceil(jobs.length / Number(limit)) },
    })
  } catch (err) {
    error(res, err.message)
  }
}

// GET /api/jobs/search?q=frontend — live search via RapidAPI
export const searchJobs = async (req, res) => {
  const { q } = req.query
  if (!q) return error(res, 'Search query is required', 400)

  try {
    const roles = await fetchJobsFromRapidAPI(q)
    success(res, { jobs: roles, source: process.env.RAPID_API_KEY ? 'linkedin' : 'mock' })
  } catch (err) {
    error(res, err.message)
  }
}

// GET /api/jobs/:companySlug — jobs for a specific company
export const getJobsByCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.companySlug }).select('name slug openRoles lastScrapedAt')
    if (!company) return error(res, 'Company not found', 404)
    success(res, { company: company.name, jobs: company.openRoles, lastScrapedAt: company.lastScrapedAt })
  } catch (err) {
    error(res, err.message)
  }
}
