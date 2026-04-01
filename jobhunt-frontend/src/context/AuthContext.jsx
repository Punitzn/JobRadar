import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import API from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const { data } = await API.get('/auth/me')
        setUser(data.data.user)
      } catch {
        localStorage.removeItem('accessToken')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password })
    localStorage.setItem('accessToken', data.accessToken)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password })
    localStorage.setItem('accessToken', data.accessToken)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await API.post('/auth/logout')
    } catch {
      // ignore
    }
    localStorage.removeItem('accessToken')
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
