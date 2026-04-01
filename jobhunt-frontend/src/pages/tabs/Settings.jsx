import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import API from '../../utils/api'
import './Settings.css'

export default function Settings() {
  const navigate = useNavigate()
  const { user, logout, updateUser, isAuthenticated } = useAuth()
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState(user?.skills || [])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Not logged in gate
  if (!isAuthenticated) {
    return (
      <div className="settings-gate">
        <div className="settings-gate-card">
          <span className="material-symbols-outlined settings-gate-icon">lock</span>
          <h2 className="settings-gate-title">Sign In Required</h2>
          <p className="settings-gate-desc">
            You need to sign in to access your settings, profile, and saved data.
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

  const handleSaveName = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      await API.patch('/users/profile', { name: name.trim() })
      updateUser({ name: name.trim() })
      setEditingName(false)
      setMessage('Name updated!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Failed to update name.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSkill = async () => {
    const s = skillInput.trim()
    if (!s || skills.includes(s)) return
    const newSkills = [...skills, s]
    setSkills(newSkills)
    setSkillInput('')
    try {
      await API.post('/users/skills', { skills: newSkills })
      updateUser({ skills: newSkills })
    } catch {
      setSkills(skills) // revert
    }
  }

  const handleRemoveSkill = async (skill) => {
    const newSkills = skills.filter(s => s !== skill)
    setSkills(newSkills)
    try {
      await API.post('/users/skills', { skills: newSkills })
      updateUser({ skills: newSkills })
    } catch {
      setSkills(skills) // revert
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div className="settings-tab">
      <header className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-subtitle">Manage your account, skills, and preferences.</p>
      </header>

      {/* Success message */}
      {message && (
        <motion.div
          className="settings-toast"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
          {message}
        </motion.div>
      )}

      <div className="settings-grid">
        {/* Profile Section */}
        <section className="settings-section">
          <h3 className="settings-section-title">Profile</h3>
          <div className="settings-card">
            <div className="settings-profile-row">
              <div className="settings-avatar">{initials}</div>
              <div className="settings-profile-info">
                {editingName ? (
                  <div className="settings-edit-row">
                    <input
                      className="settings-edit-input"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                      autoFocus
                    />
                    <button className="settings-save-btn" onClick={handleSaveName} disabled={saving}>
                      {saving ? '...' : 'Save'}
                    </button>
                    <button className="settings-cancel-btn" onClick={() => { setEditingName(false); setName(user.name) }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="settings-name-row">
                    <span className="settings-name">{user.name}</span>
                    <button className="settings-edit-btn" onClick={() => setEditingName(true)}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                    </button>
                  </div>
                )}
                <span className="settings-email">{user.email}</span>
                <span className="settings-role-badge">{user.role}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="settings-section">
          <h3 className="settings-section-title">Your Skills</h3>
          <div className="settings-card">
            <p className="settings-skill-desc">
              Add your skills to get personalized company match scores.
            </p>
            <div className="settings-skill-input-row">
              <input
                className="settings-skill-input"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                placeholder="e.g. React, Python, AWS..."
                id="settings-skill-input"
              />
              <button className="settings-skill-add-btn" onClick={handleAddSkill}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Add
              </button>
            </div>
            <div className="settings-skills-list">
              {skills.length === 0 && (
                <span className="settings-skill-empty">No skills added yet.</span>
              )}
              {skills.map(skill => (
                <span className="settings-skill-chip" key={skill}>
                  {skill}
                  <button
                    className="settings-skill-remove"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section className="settings-section">
          <h3 className="settings-section-title">Account</h3>
          <div className="settings-card">
            <div className="settings-account-info">
              <div className="settings-account-row">
                <span className="settings-account-label">Member Since</span>
                <span className="settings-account-value">
                  {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="settings-account-row">
                <span className="settings-account-label">Plan</span>
                <span className="settings-account-value">Free</span>
              </div>
            </div>
            <div className="settings-logout-area">
              <button className="settings-logout-btn" onClick={handleLogout} id="settings-logout-btn">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
