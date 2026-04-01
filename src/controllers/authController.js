import User from '../models/User.js'
import { sendTokens, verifyRefreshToken, signAccessToken } from '../utils/jwt.js'
import { success, error } from '../utils/response.js'
import { validationResult } from 'express-validator'

// POST /api/auth/register
export const register = async (req, res) => {
  const errs = validationResult(req)
  if (!errs.isEmpty()) return error(res, 'Validation failed', 422, errs.array())

  const { name, email, password } = req.body

  try {
    const exists = await User.findOne({ email })
    if (exists) return error(res, 'Email already registered', 409)

    const user = await User.create({ name, email, password })
    sendTokens(res, user, 201)
  } catch (err) {
    error(res, err.message)
  }
}

// POST /api/auth/login
export const login = async (req, res) => {
  const errs = validationResult(req)
  if (!errs.isEmpty()) return error(res, 'Validation failed', 422, errs.array())

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return error(res, 'Invalid email or password', 401)

    sendTokens(res, user)
  } catch (err) {
    error(res, err.message)
  }
}

// POST /api/auth/refresh
export const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken
  if (!token) return error(res, 'No refresh token', 401)

  try {
    const decoded = verifyRefreshToken(token)
    const user = await User.findById(decoded.id)
    if (!user) return error(res, 'User not found', 401)

    const accessToken = signAccessToken(user._id)
    success(res, { accessToken }, 'Token refreshed')
  } catch {
    error(res, 'Invalid or expired refresh token', 401)
  }
}

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie('refreshToken')
  success(res, {}, 'Logged out successfully')
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  success(res, { user: req.user }, 'Current user')
}
