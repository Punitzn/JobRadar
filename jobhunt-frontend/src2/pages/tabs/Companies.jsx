import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import API from '../../utils/api'
import './Companies.css'

// ── Helpers ──────────────────────────────────────────────────────────────────

function ProgressBar({ value, max = 10, color = 'var(--accent-primary)' }) {
  const percent = (value / max) * 100
  return (
    <div className="progress-bar-track">
      <div className="progress-bar-fill" style={{ width: `${percent}%`, background: color }} />
    </div>
  )
}

function MatchCircle({ percent }) {
  let borderColor = 'var(--accent-primary)'
  if (percent < 50) borderColor = 'var(--accent-danger)'
  else if (percent < 70) borderColor = 'var(--accent-tertiary)'
  return (
    <div className="match-circle" style={{ borderColor }}>
      <span style={{ color: borderColor }}>{percent}%</span>
    </div>
  )
}

// ── Map backend company → UI shape ───────────────────────────────────────────

function mapCompany(c) {
  // Build tags from backend data
  const tags = []
  if (c.ghostRate > 30) tags.push({ label: '- Ghosted', type: 'danger' })
  if (c.tags?.includes('High Salary')) tags.push({ label: '+ High Salary', type: 'primary' })
  if (c.tags?.includes('Work Life')) tags.push({ label: '+ Work Life', type: 'primary' })
  if (c.tags?.includes('Moderate Response')) tags.push({ label: 'Moderate Resp', type: 'neutral' })

  // Signal label
  const signal = c.tags?.find(t =>
    ['Fast Feedback', 'Top Employer', 'Transparent Process'].includes(t)
  )

  return {
    id: c._id,
    slug: c.slug,
    name: c.name,
    icon: c.icon || 'business',
    industry: c.sector,
    tagline: c.tags?.[0] || '',
    reputation: c.reputationScore,
    match: c.skillMatch ?? 0,
    ghostRate: c.ghostRate,
    ghostLabel: c.ghostRate <= 15 ? 'Low' : c.ghostRate <= 35 ? 'Moderate' : 'High',
    responseDays: c.avgResponseDays ?? '—',
    signal: signal ? `+ ${signal}` : '',
    overallScore: c.metrics?.overallScore ?? c.reputationScore,
    ghostRateIndex: c.metrics?.ghostRateIndex ?? 0,
    responseLatency: c.metrics?.responseLatency ?? 0,
    redFlags: c.metrics?.redFlagsInversed ?? 0,
    techMatch: c.skillMatch ?? 0,
    domainExp: Math.round((c.skillMatch ?? 0) * 0.7),
    skillsMatch: (c.requiredSkills ?? []).slice(0, 4),
    skillsMissing: (c.requiredSkills ?? []).slice(4, 6),
    reviews: (c.reviews ?? []).map(r => r.text),
    tags,
    hiringStatus: c.hiringStatus,
  }
}

// ── Featured Card ─────────────────────────────────────────────────────────────

function FeaturedCard({ company }) {
  return (
    <section className="featured-card" id={`company-${company.id}`}>
      <div className="featured-card-header">
        <div className="featured-identity">
          <div className="featured-identity-left">
            <div className="company-icon-box">
              <span className="material-symbols-outlined">{company.icon}</span>
            </div>
            <div>
              <h3 className="featured-name">{company.name}</h3>
              <div className="featured-meta">
                <span className="industry-badge">{company.industry}</span>
                {company.tagline && <span className="featured-tagline">• {company.tagline}</span>}
              </div>
            </div>
          </div>
          <div className="featured-score-box">
            <div className="featured-score">
              <span className="score-num">{company.reputation}</span>
              <span className="score-den">/10</span>
            </div>
            <span className="score-label">Reputation</span>
          </div>
        </div>

        <div className="quick-stats">
          <div className="quick-stat">
            <div className="quick-stat-header">
              <span className="material-symbols-outlined qs-icon">target</span>
              <span className="qs-label">Match</span>
            </div>
            <div className="quick-stat-body">
              <MatchCircle percent={company.match} />
              <span className="qs-text">
                {company.match >= 70 ? 'Optimal' : company.match >= 50 ? 'Good' : 'Partial'}
              </span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-header">
              <span className="material-symbols-outlined qs-icon qs-icon-danger">mist</span>
              <span className="qs-label">Ghost Rate</span>
            </div>
            <div className="qs-value-row">
              <span className="qs-big-value">{company.ghostRate}%</span>
              <span className="qs-sub">({company.ghostLabel})</span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-header">
              <span className="material-symbols-outlined qs-icon qs-icon-primary">bolt</span>
              <span className="qs-label qs-label-primary">Signal</span>
            </div>
            <div className="qs-signal-badge">{company.signal || '—'}</div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-header">
              <span className="material-symbols-outlined qs-icon">schedule</span>
              <span className="qs-label">Resp. Time</span>
            </div>
            <span className="qs-big-value">
              {company.responseDays !== '—' ? `${company.responseDays} Days` : '—'}
            </span>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metrics-col">
            <h4 className="metrics-heading">Performance Metrics</h4>
            <div className="metrics-list">
              {[
                { label: 'Overall Score', value: company.overallScore },
                { label: 'Ghost Rate Index', value: company.ghostRateIndex },
                { label: 'Response Latency', value: company.responseLatency },
                { label: 'Red Flags (Inversed)', value: company.redFlags },
              ].map((m) => (
                <div className="metric-row" key={m.label}>
                  <div className="metric-row-header">
                    <span className="metric-label">{m.label}</span>
                    <span className="metric-value">{m.value}</span>
                  </div>
                  <ProgressBar value={m.value} />
                </div>
              ))}
            </div>
          </div>
          <div className="metrics-col">
            <h4 className="metrics-heading">Resume Fit Analysis</h4>
            <div className="metrics-list">
              <div className="metric-row">
                <div className="metric-row-header">
                  <span className="metric-label">Technical Skills Match</span>
                  <span className="metric-value" style={{ color: 'var(--accent-primary)' }}>
                    {company.techMatch}%
                  </span>
                </div>
                <ProgressBar value={company.techMatch} max={100} />
              </div>
              <div className="metric-row">
                <div className="metric-row-header">
                  <span className="metric-label">Domain Experience</span>
                  <span className="metric-value">{company.domainExp}%</span>
                </div>
                <ProgressBar value={company.domainExp} max={100} color="var(--text-secondary)" />
              </div>
            </div>
            <div className="skills-tags">
              {company.skillsMatch.map((s) => (
                <span className="skill-tag skill-tag-match" key={s}>{s}</span>
              ))}
              {company.skillsMissing.map((s) => (
                <span className="skill-tag skill-tag-missing" key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {company.reviews.length > 0 && (
        <div className="reviews-section">
          <div className="reviews-header">
            <h4 className="reviews-heading">Recent Candidate Reviews</h4>
            <a href="#" className="reviews-add">
              Add your experience{' '}
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
            </a>
          </div>
          <div className="reviews-grid">
            {company.reviews.slice(0, 2).map((review, i) => (
              <div className={`review-card ${i === 0 ? 'review-primary' : ''}`} key={i}>
                "{review}"
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

// ── Compact Card ──────────────────────────────────────────────────────────────

function CompactCard({ company }) {
  const matchColor =
    company.match >= 70 ? 'var(--accent-primary)' :
    company.match >= 50 ? 'var(--accent-tertiary)' :
    'var(--accent-danger)'

  return (
    <motion.div
      className="compact-card"
      id={`company-${company.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ backgroundColor: 'var(--surface-container)' }}
    >
      <div className="compact-card-top">
        <div className="compact-identity">
          <div className="compact-icon-box">
            <span className="material-symbols-outlined">{company.icon}</span>
          </div>
          <div>
            <h3 className="compact-name">{company.name}</h3>
            <span className="compact-industry">{company.industry}</span>
          </div>
        </div>
        <div className="match-circle" style={{ borderColor: matchColor, width: '40px', height: '40px' }}>
          <span style={{ color: matchColor, fontSize: '0.6rem' }}>{company.match}%</span>
        </div>
      </div>
      <div className="compact-card-middle">
        <div className="compact-rep">
          <span className="compact-rep-value">{company.reputation}</span>
          <span className="compact-rep-label">Rep</span>
        </div>
        <div className="compact-ghost">
          <span className="compact-ghost-value">{company.ghostRate}%</span>
          <span
            className="compact-ghost-label"
            style={{ color: company.ghostRate > 30 ? 'var(--accent-danger)' : 'var(--accent-primary)' }}
          >
            Ghost Rate
          </span>
        </div>
      </div>
      {company.tags?.length > 0 && (
        <div className="compact-card-tags">
          {company.tags.map((tag, i) => (
            <span className={`compact-tag compact-tag-${tag.type}`} key={i}>
              {tag.label}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ── Skeleton Loader ───────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{ opacity: 0.4, display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: '80px', borderRadius: '12px',
          background: 'var(--surface-container)',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
      ))}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({ active: 0, freeze: 0 })

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const params = {}
        if (search) params.search = search

        const { data } = await API.get('/companies', { params })
        const mapped = data.data.companies.map(mapCompany)
        setCompanies(mapped)

        // Compute footer stats
        const active = data.data.companies.filter(c => c.hiringStatus === 'actively_hiring').length
        const freeze = data.data.companies.filter(c => c.hiringStatus === 'freeze').length
        setStats({ active, freeze })
      } catch (err) {
        setError('Failed to load companies. Is the backend running?')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchCompanies, 300)
    return () => clearTimeout(debounce)
  }, [search])

  const featured = companies[0] ?? null
  const sidebar = companies.slice(1)

  return (
    <div className="companies-tab" id="companies-tab">
      {/* Header */}
      <header className="companies-header">
        <div>
          <h2 className="companies-title">Company Intel</h2>
          <p className="companies-subtitle">Deep-dive analytics on hiring patterns and candidate matches.</p>
        </div>
        <div className="companies-search">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search companies or sectors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="company-search-input"
          />
        </div>
      </header>

      {/* Error */}
      {error && (
        <div style={{
          padding: '16px 24px', margin: '16px 0', borderRadius: '12px',
          background: 'var(--accent-danger, #ff4444)22',
          color: 'var(--accent-danger, #ff6b6b)',
          border: '1px solid var(--accent-danger, #ff4444)44',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Bento Grid */}
      {loading ? (
        <Skeleton />
      ) : (
        <div className="companies-bento">
          <div className="bento-main">
            {featured && <FeaturedCard company={featured} />}
          </div>
          <div className="bento-side">
            {sidebar.map((company) => (
              <CompactCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <footer className="companies-footer">
        <div className="footer-stats-left">
          <span className="footer-stats-label">Quick Stats</span>
          <div className="footer-stats-items">
            <div className="footer-stat-item">
              <span className="footer-stat-dot footer-stat-dot-active" />
              <span className="footer-stat-text">Active Hiring: {stats.active} Companies</span>
            </div>
            <div className="footer-stat-item">
              <span className="footer-stat-dot footer-stat-dot-freeze" />
              <span className="footer-stat-text">Hiring Freeze: {stats.freeze} Companies</span>
            </div>
          </div>
        </div>
        <button className="footer-heatmap-link">
          VIEW GLOBAL HEATMAP
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
        </button>
      </footer>
    </div>
  )
}
