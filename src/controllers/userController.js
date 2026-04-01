import User from '../models/User.js'
import Company from '../models/Company.js'
import { success, error } from '../utils/response.js'

// GET /api/users/profile
export const getProfile = async (req, res) => {
  success(res, { user: req.user })
}

// PATCH /api/users/profile
export const updateProfile = async (req, res) => {
  const allowed = ['name', 'skills']
  const updates = {}
  allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key] })

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })
    success(res, { user }, 'Profile updated')
  } catch (err) {
    error(res, err.message)
  }
}

// POST /api/users/skills — replace skill list
export const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body
    if (!Array.isArray(skills)) return error(res, 'skills must be an array', 400)

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills },
      { new: true }
    )
    success(res, { skills: user.skills }, 'Skills updated')
  } catch (err) {
    error(res, err.message)
  }
}

// POST /api/users/saved/:companyId
export const toggleSavedCompany = async (req, res) => {
  try {
    const user = req.user
    const { companyId } = req.params
    const isSaved = user.savedCompanies.includes(companyId)

    const update = isSaved
      ? { $pull: { savedCompanies: companyId } }
      : { $addToSet: { savedCompanies: companyId } }

    await User.findByIdAndUpdate(user._id, update)
    success(res, {}, isSaved ? 'Company unsaved' : 'Company saved')
  } catch (err) {
    error(res, err.message)
  }
}

// GET /api/users/saved
export const getSavedCompanies = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'savedCompanies',
      'name slug sector reputationScore ghostRate hiringStatus tags'
    )
    success(res, { companies: user.savedCompanies })
  } catch (err) {
    error(res, err.message)
  }
}

// POST /api/users/applications
export const addApplication = async (req, res) => {
  try {
    const { companyId, role, status, notes } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { applications: { company: companyId, role, status, notes } } },
      { new: true }
    ).populate('applications.company', 'name slug sector')

    success(res, { applications: user.applications }, 'Application tracked', 201)
  } catch (err) {
    error(res, err.message)
  }
}

// GET /api/users/applications
export const getApplications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'applications.company',
      'name slug sector reputationScore'
    )
    success(res, { applications: user.applications })
  } catch (err) {
    error(res, err.message)
  }
}

// PATCH /api/users/applications/:appId
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, 'applications._id': req.params.appId },
      {
        $set: {
          'applications.$.status': status,
          ...(notes && { 'applications.$.notes': notes }),
        },
      },
      { new: true }
    )
    if (!user) return error(res, 'Application not found', 404)
    success(res, {}, 'Application updated')
  } catch (err) {
    error(res, err.message)
  }
}
