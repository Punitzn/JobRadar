import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

const navItems = [
  { id: 'companies', label: 'Companies', icon: 'business' },
  { id: 'heatmap', label: 'Heatmap', icon: 'grid_view' },
  { id: 'report', label: 'Report', icon: 'assessment' },
  { id: 'resume', label: 'My Resume', icon: 'description' },
]

export default function Sidebar({ activeTab, onTabChange }) {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <aside className="sidebar" id="dashboard-sidebar">
      {/* Brand — click to go home */}
      <button className="sidebar-brand" onClick={() => navigate('/')} id="sidebar-home-btn">
        <h1 className="sidebar-logo">JobRadar</h1>
        <p className="sidebar-tagline">Precision Navigator</p>
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            id={`sidebar-${item.id}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
            {activeTab === item.id && (
              <motion.div
                className="sidebar-active-bg"
                layoutId="sidebarActive"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="sidebar-footer">
        {isAuthenticated ? (
          <>
            {/* Logged-in user info */}
            <div className="sidebar-user-card">
              <div className="sidebar-user-avatar">{initials}</div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name}</span>
                <span className="sidebar-user-email">{user.email}</span>
              </div>
            </div>

            <div className="sidebar-footer-links">
              <button
                className={`sidebar-footer-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => onTabChange('settings')}
                id="sidebar-settings"
              >
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </button>
              <button className="sidebar-footer-link sidebar-logout-link" onClick={handleLogout} id="sidebar-logout">
                <span className="material-symbols-outlined">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              className="sidebar-cta"
              onClick={() => navigate('/login')}
              id="sidebar-signin-btn"
            >
              Sign In
            </button>
            <div className="sidebar-footer-links">
              <button
                className={`sidebar-footer-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => onTabChange('settings')}
              >
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </button>
              <a href="#" className="sidebar-footer-link">
                <span className="material-symbols-outlined">help</span>
                <span>Support</span>
              </a>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
