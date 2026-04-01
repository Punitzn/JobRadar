import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Navbar.css'

const tabs = [
  { id: 'companies', label: 'Companies', icon: '◆' },
  { id: 'heatmap', label: 'Heatmap', icon: '◈' },
  { id: 'report', label: 'Report', icon: '◉' },
  { id: 'resume', label: 'My Resume', icon: '◎' },
]

export default function Navbar({ activeTab, onTabChange }) {
  const navigate = useNavigate()

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <button
          className="navbar-brand"
          onClick={() => navigate('/')}
          id="nav-brand"
        >
          <span className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="var(--accent-primary)" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="6" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.6" />
              <circle cx="12" cy="12" r="2" fill="var(--accent-primary)" />
              <line x1="12" y1="2" x2="12" y2="6" stroke="var(--accent-primary)" strokeWidth="1" />
              <line x1="22" y1="12" x2="18" y2="12" stroke="var(--accent-primary)" strokeWidth="1" />
              <line x1="12" y1="22" x2="12" y2="18" stroke="var(--accent-primary)" strokeWidth="1" />
              <line x1="2" y1="12" x2="6" y2="12" stroke="var(--accent-primary)" strokeWidth="1" />
            </svg>
          </span>
          <span className="brand-text">JOBRADAR</span>
        </button>

        <div className="navbar-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              id={`nav-tab-${tab.id}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  className="tab-indicator"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <div className="nav-status">
            <span className="status-dot"></span>
            <span className="status-text">Live</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
