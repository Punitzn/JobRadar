import axios from 'axios'
import Company from '../models/Company.js'

const HEADERS = {
  'x-rapidapi-key': process.env.RAPID_API_KEY,
  'x-rapidapi-host': 'jsearch.p.rapidapi.com',
}

export const fetchJobsFromJSearch = async (query, page = 1) => {
  try {
    const { data } = await axios.get('https://jsearch.p.rapidapi.com/search', {
      headers: HEADERS,
      params: { query: query || 'software engineer India', page: String(page), num_pages: '1', country: 'in', date_posted: 'month' },
      timeout: 10000,
    })
    return data.data || []
  } catch (err) {
    console.error('JSearch error:', err.message)
    return []
  }
}

export const syncCompaniesFromJSearch = async () => {
  console.log('Searching JSearch...')
  const queries = ['software engineer India','frontend developer India','backend developer India','full stack India','data engineer India']
  let totalNew = 0, totalUpdated = 0
  for (const query of queries) {
    const jobs = await fetchJobsFromJSearch(query)
    if (!jobs.length) continue
    const map = new Map()
    for (const job of jobs) {
      if (!job.employer_name || map.has(job.employer_name)) continue
      map.set(job.employer_name, { name: job.employer_name, website: job.employer_website || '', jobs: [] })
    }
    for (const job of jobs) {
      const entry = map.get(job.employer_name)
      if (entry) entry.jobs.push({ title: job.job_title, url: job.job_apply_link || job.job_google_link, postedAt: new Date(), location: job.job_city || 'India', type: job.job_is_remote ? 'remote' : 'hybrid' })
    }
    for (const c of [...map.values()]) {
      const slug = c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const existing = await Company.findOne({ slug })
      if (existing) {
        const titles = existing.openRoles.map(r => r.title)
        existing.openRoles = [...c.jobs.filter(j => !titles.includes(j.title)), ...existing.openRoles].slice(0, 20)
        existing.lastScrapedAt = new Date()
        await existing.save()
        totalUpdated++
      } else {
        await Company.create({ name: c.name, slug, sector: 'SaaS', website: c.website, icon: 'business', reputationScore: parseFloat((6 + Math.random() * 3).toFixed(1)), ghostRate: Math.floor(Math.random() * 40), avgResponseDays: Math.floor(3 + Math.random() * 14), hiringStatus: 'actively_hiring', tags: ['Active Hiring'], metrics: { overallScore: 7, ghostRateIndex: 7, responseLatency: 7, redFlagsInversed: 7 }, openRoles: c.jobs.slice(0, 10), lastScrapedAt: new Date() })
        totalNew++
      }
    }
    await new Promise(r => setTimeout(r, 500))
  }
  console.log('Done:', totalNew, 'new,', totalUpdated, 'updated')
  return { totalNew, totalUpdated }
}
