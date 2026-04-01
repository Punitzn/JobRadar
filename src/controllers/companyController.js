import Company from '../models/Company.js'
import { success, error } from '../utils/response.js'
import { validationResult } from 'express-validator'

// GET /api/companies
export const getCompanies = async (req, res) => {
  try {
    const {
      sector,
      hiringStatus,
      search,
      sort = '-reputationScore',
      page = 1,
      limit = 20,
    } = req.query

    const filter = {}
    if (sector) filter.sector = sector
    if (hiringStatus) filter.hiringStatus = hiringStatus
    if (search) filter.name = { $regex: search, $options: 'i' }

    const skip = (Number(page) - 1) * Number(limit)

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select('-reviews -openRoles'),
      Company.countDocuments(filter),
    ])

    // Attach skill match % if user is logged in
    const userSkills = req.user?.skills || []
    const enriched = companies.map((c) => ({
      ...c.toObject(),
      skillMatch: c.getSkillMatch(userSkills),
    }))

    success(res, {
      companies: enriched,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (err) {
    error(res, err.message)
  }
}

// GET /api/companies/:slug
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug }).populate(
      'reviews.user',
      'name'
    )
    if (!company) return error(res, 'Company not found', 404)

    const skillMatch = company.getSkillMatch(req.user?.skills || [])
    success(res, { company: { ...company.toObject(), skillMatch } })
  } catch (err) {
    error(res, err.message)
  }
}

// POST /api/companies (admin)
export const createCompany = async (req, res) => {
  const errs = validationResult(req)
  if (!errs.isEmpty()) return error(res, 'Validation failed', 422, errs.array())

  try {
    const slug = req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const company = await Company.create({ ...req.body, slug })
    success(res, { company }, 'Company created', 201)
  } catch (err) {
    if (err.code === 11000) return error(res, 'Company already exists', 409)
    error(res, err.message)
  }
}

// PATCH /api/companies/:slug (admin)
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    )
    if (!company) return error(res, 'Company not found', 404)
    success(res, { company }, 'Company updated')
  } catch (err) {
    error(res, err.message)
  }
}

// POST /api/companies/:slug/reviews
export const addReview = async (req, res) => {
  const errs = validationResult(req)
  if (!errs.isEmpty()) return error(res, 'Validation failed', 422, errs.array())

  try {
    const company = await Company.findOne({ slug: req.params.slug })
    if (!company) return error(res, 'Company not found', 404)

    // Prevent duplicate reviews from same user
    const alreadyReviewed = company.reviews.some(
      (r) => r.user?.toString() === req.user._id.toString()
    )
    if (alreadyReviewed) return error(res, 'You have already reviewed this company', 409)

    company.reviews.push({
      user: req.body.isAnonymous ? null : req.user._id,
      text: req.body.text,
      rating: req.body.rating,
      outcome: req.body.outcome,
      isAnonymous: req.body.isAnonymous ?? true,
    })

    await company.save() // triggers reputationScore recompute
    success(res, { reputationScore: company.reputationScore }, 'Review added', 201)
  } catch (err) {
    error(res, err.message)
  }
}

// GET /api/companies/heatmap — aggregated stats for heatmap view
export const getHeatmap = async (req, res) => {
  try {
    const data = await Company.aggregate([
      {
        $group: {
          _id: '$sector',
          avgReputation: { $avg: '$reputationScore' },
          avgGhostRate: { $avg: '$ghostRate' },
          count: { $sum: 1 },
          activeHiring: {
            $sum: { $cond: [{ $eq: ['$hiringStatus', 'actively_hiring'] }, 1, 0] },
          },
        },
      },
      { $sort: { avgReputation: -1 } },
    ])
    success(res, { heatmap: data })
  } catch (err) {
    error(res, err.message)
  }
}
