import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }
    if (mode === 'register' && !form.name) {
      setError('Name is required.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password)
      }
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login')
    setError('')
  }

  return (
    <div className="login-page">
      {/* Ambient background */}
      <div className="login-ambient">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-grid-overlay" />
      </div>

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand */}
        <div className="login-brand">
          <button className="login-home-btn" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined" style={{ color: 'var(--accent-primary)', fontSize: '24px' }}>radar</span>
            <span className="login-logo">JOBRADAR</span>
          </button>
          <p className="login-tagline">Hiring Intelligence Platform</p>
        </div>

        {/* Form Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h1 className="login-title">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="login-subtitle">
              {mode === 'login'
                ? 'Sign in to access your personalized dashboard.'
                : 'Join to save companies, track applications & more.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="form-field-wrap"
                >
                  <div className="form-field">
                    <label className="form-label">Full Name</label>
                    <div className="form-input-wrap">
                      <span className="material-symbols-outlined form-input-icon">person</span>
                      <input
                        type="text"
                        placeholder="Punit Jain"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        id="register-name"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="form-field">
              <label className="form-label">Email</label>
              <div className="form-input-wrap">
                <span className="material-symbols-outlined form-input-icon">mail</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  id="login-email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <span className="material-symbols-outlined form-input-icon">lock</span>
                <input
                  type="password"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  id="login-password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="login-error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={submitting}
              id="login-submit"
            >
              {submitting ? (
                <div className="login-spinner" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="login-toggle">
            <span className="login-toggle-text">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button className="login-toggle-btn" onClick={toggleMode} id="login-toggle-mode">
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Skip */}
        <button
          className="login-skip"
          onClick={() => navigate('/dashboard')}
          id="login-skip-btn"
        >
          Browse without signing in →
        </button>
      </motion.div>
    </div>
  )
}
