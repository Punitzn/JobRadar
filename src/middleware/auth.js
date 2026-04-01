import { verifyAccessToken } from '../utils/jwt.js'
import User from '../models/User.js'
import { error } from '../utils/response.js'

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer '))
      return error(res, 'Not authenticated', 401)

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)

    const user = await User.findById(decoded.id)
    if (!user) return error(res, 'User no longer exists', 401)

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return error(res, 'Token expired — please refresh', 401)
    return error(res, 'Invalid token', 401)
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return error(res, 'Admin access required', 403)
  next()
}
