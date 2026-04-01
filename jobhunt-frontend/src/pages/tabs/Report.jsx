import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { redFlags } from '../../data/mockData'
import './Report.css'

export default function Report() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="settings-gate">
        <div className="settings-gate-card">
          <span className="material-symbols-outlined settings-gate-icon">assignment</span>
          <h2 className="settings-gate-title">Sign In to Report</h2>
          <p className="settings-gate-desc">
            Help others navigate the job market by sharing your interview experiences. Sign in to submit a report.
          </p>
          <button className="settings-gate-btn" onClick={() => navigate('/login')}>
            Sign In
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [ghosted, setGhosted] = useState(null)
  const [selectedFlags, setSelectedFlags] = useState([])
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const toggleFlag = (flag) => {
    setSelectedFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="report-tab" id="report-tab">
      <div className="tab-header">
        <div className="tab-header-left">
          <h1 className="tab-title">Report Experience</h1>
          <span className="tab-count">Help others navigate</span>
        </div>
      </div>

      <div className="report-layout">
        <form className="report-form" onSubmit={handleSubmit} id="report-form">
          {/* Company & Role */}
          <div className="form-row">
            <div className="form-field" id="field-company">
              <label className="field-label">Company Name</label>
              <input
                type="text"
                className="field-input"
                placeholder="e.g. Vercel"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                id="input-company"
              />
            </div>
            <div className="form-field" id="field-role">
              <label className="field-label">Role Applied For</label>
              <input
                type="text"
                className="field-input"
                placeholder="e.g. Senior Frontend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                id="input-role"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="form-field" id="field-rating">
            <label className="field-label">Overall Experience</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  id={`star-${star}`}
                >
                  <div className="star-circle">
                    <span className="star-num">{star}</span>
                  </div>
                </button>
              ))}
              <span className="rating-label">
                {rating === 0 && 'Rate your experience'}
                {rating === 1 && 'Terrible'}
                {rating === 2 && 'Poor'}
                {rating === 3 && 'Average'}
                {rating === 4 && 'Good'}
                {rating === 5 && 'Excellent'}
              </span>
            </div>
          </div>

          {/* Ghost Detection */}
          <div className="form-field" id="field-ghost">
            <label className="field-label">Were you ghosted?</label>
            <div className="ghost-options">
              {[
                { value: true, label: 'Yes, ghosted', icon: '👻' },
                { value: false, label: 'No response issues', icon: '✓' },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  className={`ghost-btn ${ghosted === opt.value ? 'active' : ''} ${opt.value ? 'ghost-yes' : 'ghost-no'}`}
                  onClick={() => setGhosted(opt.value)}
                  id={`ghost-${opt.value}`}
                >
                  <span className="ghost-icon">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          <div className="form-field" id="field-flags">
            <label className="field-label">Red Flags (select all that apply)</label>
            <div className="flag-grid">
              {redFlags.map((flag) => (
                <button
                  key={flag}
                  type="button"
                  className={`flag-pill ${selectedFlags.includes(flag) ? 'active' : ''}`}
                  onClick={() => toggleFlag(flag)}
                >
                  <span className="flag-check">
                    {selectedFlags.includes(flag) ? '✕' : '+'}
                  </span>
                  <span>{flag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-field" id="field-notes">
            <label className="field-label">Additional Notes</label>
            <textarea
              className="field-textarea"
              placeholder="Share your experience in detail..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              id="input-notes"
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="submit-btn"
            id="submit-report"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Submit Report</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </form>

        {/* ── Side Preview ── */}
        <div className="report-preview">
          <div className="preview-card">
            <div className="preview-header">
              <span className="preview-tag">Preview</span>
            </div>
            <div className="preview-body">
              <h3 className="preview-company">
                {company || 'Company Name'}
              </h3>
              <p className="preview-role">{role || 'Role Title'}</p>
              <div className="preview-rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`preview-star ${s <= rating ? 'filled' : ''}`}
                  >
                    ●
                  </span>
                ))}
              </div>
              {ghosted !== null && (
                <div className={`preview-ghost ${ghosted ? 'ghosted' : 'ok'}`}>
                  {ghosted ? '👻 Ghosted' : '✓ Responsive'}
                </div>
              )}
              {selectedFlags.length > 0 && (
                <div className="preview-flags">
                  {selectedFlags.map((f) => (
                    <span className="pill pill-red" key={f}>{f}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="toast-icon">✓</span>
            <span>Report submitted successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
