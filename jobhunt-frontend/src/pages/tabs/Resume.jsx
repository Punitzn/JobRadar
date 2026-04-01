import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { userSkills } from '../../data/mockData'
import './Resume.css'

export default function Resume() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="settings-gate">
        <div className="settings-gate-card">
          <span className="material-symbols-outlined settings-gate-icon">description</span>
          <h2 className="settings-gate-title">Sign In for Resume</h2>
          <p className="settings-gate-desc">
            Upload your resume, analyze your skills, and get personalized company match scores.
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

  const [skills, setSkills] = useState(userSkills)
  const [newSkill, setNewSkill] = useState('')
  const [fileName, setFileName] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const addSkill = () => {
    const trimmed = newSkill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed])
      setNewSkill('')
    }
  }

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer?.files?.[0]
    if (file && file.type === 'application/pdf') {
      setFileName(file.name)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  return (
    <div className="resume-tab" id="resume-tab">
      <div className="tab-header">
        <div className="tab-header-left">
          <h1 className="tab-title">My Resume</h1>
          <span className="tab-count">{skills.length} skills detected</span>
        </div>
      </div>

      <div className="resume-layout">
        {/* ── Upload Zone ── */}
        <div className="upload-section">
          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''} ${fileName ? 'has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            id="upload-zone"
          >
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input"
            />

            {fileName ? (
              <div className="upload-success">
                <div className="file-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <span className="file-name">{fileName}</span>
                <span className="file-status">✓ Uploaded & Analyzed</span>
              </div>
            ) : (
              <div className="upload-prompt">
                <div className="upload-icon-wrapper">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <span className="upload-title">Drop your resume here</span>
                <span className="upload-hint">PDF files only • Click or drag</span>
              </div>
            )}

            {isDragging && (
              <div className="drag-overlay">
                <span>Drop to upload</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Skills Section ── */}
        <div className="skills-section">
          <div className="skills-header">
            <h2 className="skills-title">Skill Profile</h2>
            <span className="skills-sub">
              {fileName ? 'Auto-detected from resume' : 'Add your skills manually'}
            </span>
          </div>

          {/* Manual Input */}
          <div className="skill-input-row" id="skill-input-row">
            <div className="skill-input-wrapper">
              <input
                type="text"
                className="skill-input"
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                id="skill-input"
              />
            </div>
            <button
              className="add-skill-btn"
              onClick={addSkill}
              disabled={!newSkill.trim()}
              id="add-skill-btn"
            >
              <span>+</span>
            </button>
          </div>

          {/* Skills Cloud */}
          <div className="skills-cloud" id="skills-cloud">
            <AnimatePresence mode="popLayout">
              {skills.map((skill) => (
                <motion.button
                  key={skill}
                  className="skill-chip"
                  onClick={() => removeSkill(skill)}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  title="Click to remove"
                >
                  <span>{skill}</span>
                  <span className="chip-remove">×</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="resume-stats">
            <div className="resume-stat-card">
              <span className="stat-value">{skills.length}</span>
              <span className="stat-label">Skills Detected</span>
            </div>
            <div className="resume-stat-card">
              <span className="stat-value">
                {Math.round(
                  (skills.filter((s) =>
                    ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'Git', 'Next.js', 'GraphQL'].includes(s)
                  ).length / 8) * 100
                )}%
              </span>
              <span className="stat-label">Market Alignment</span>
            </div>
            <div className="resume-stat-card">
              <span className="stat-value">8</span>
              <span className="stat-label">Strong Matches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
