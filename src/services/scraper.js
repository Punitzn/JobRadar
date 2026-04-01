/**
 * JobRadar Scraper Service
 * ────────────────────────
 * Scrapes open job listings from company LinkedIn/career pages
 * using Cheerio. Falls back gracefully if site blocks scraping.
 *
 * For production, replace with LinkedIn Jobs API via RapidAPI:
 * https://rapidapi.com/rockapis-rockapis-default/api/linkedin-jobs-search
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import Company from '../models/Company.js'

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
}

// ── Scrape a generic /jobs or /careers page ──────────────────────────────────
const scrapeCareerPage = async (url) => {
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 8000 })
    const $ = cheerio.load(data)
    const roles = []

    // Generic heuristic: find job title elements
    $('[class*="job"], [class*="role"], [class*="position"], [class*="opening"]').each((_, el) => {
      const title = $(el).find('h2, h3, h4, a, strong').first().text().trim()
      const link = $(el).find('a').first().attr('href')
      if (title && title.length > 3) {
        roles.push({
          title,
          url: link?.startsWith('http') ? link : link ? `${new URL(url).origin}${link}` : url,
          postedAt: new Date(),
          location: 'India',
          type: 'hybrid',
        })
      }
    })

    return roles.slice(0, 10) // cap at 10 roles per company
  } catch {
    return [] // silently fail — site may block or be unavailable
  }
}

// ── RapidAPI LinkedIn Jobs (optional, needs API key) ─────────────────────────
export const fetchJobsFromRapidAPI = async (companyName) => {
  if (!process.env.RAPID_API_KEY) return []

  try {
    const { data } = await axios.get('https://linkedin-jobs-search.p.rapidapi.com/', {
      params: { query: `${companyName} India`, page: '1' },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com',
      },
      timeout: 10000,
    })

    return (data || []).slice(0, 10).map((job) => ({
      title: job.job_title || 'Unknown Role',
      url: job.linkedin_job_url_cleaned || job.job_url,
      postedAt: new Date(),
      location: job.job_location || 'India',
      type: job.job_location?.toLowerCase().includes('remote') ? 'remote' : 'hybrid',
    }))
  } catch {
    return []
  }
}

// ── Main scrape runner — updates all companies in DB ─────────────────────────
export const scrapeAllCompanies = async () => {
  console.log('🔍 Scraper started...')
  const companies = await Company.find({ website: { $exists: true } })

  for (const company of companies) {
    try {
      // Try RapidAPI first, fallback to direct scrape
      let roles = await fetchJobsFromRapidAPI(company.name)
      if (!roles.length && company.website) {
        const careersUrl = `${company.website}/careers`
        roles = await scrapeCareerPage(careersUrl)
      }

      if (roles.length) {
        company.openRoles = roles
        company.lastScrapedAt = new Date()
        await company.save()
        console.log(`✅ ${company.name}: ${roles.length} roles found`)
      }
    } catch (err) {
      console.warn(`⚠️  Failed to scrape ${company.name}: ${err.message}`)
    }
  }

  console.log('✅ Scraper finished.')
}
