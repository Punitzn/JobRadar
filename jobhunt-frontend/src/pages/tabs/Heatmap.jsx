import { useState } from 'react'
import { motion } from 'framer-motion'
import './Heatmap.css'

const heatmapCompanies = [
  { id: 1, name: 'NVIDIA', sector: 'Tech', location: 'SF', score: 9.8, match: 94, tier: 'high' },
  { id: 2, name: 'Stripe', sector: 'Finance', location: 'NY', score: 9.2, match: 91, tier: 'high' },
  { id: 3, name: 'Slack', sector: 'SaaS', location: 'Remote', score: 7.8, match: 85, tier: 'medium-high' },
  { id: 4, name: 'Amazon', sector: 'Retail', location: 'WA', score: 6.9, match: 78, tier: 'medium-high' },
  { id: 5, name: 'Meta', sector: 'Social', location: 'CA', score: 5.4, match: 62, tier: 'medium' },
  { id: 6, name: 'Oracle', sector: 'Legacy', location: 'NY', score: 3.2, match: 41, tier: 'low' },
  { id: 7, name: 'Azure', sector: 'Cloud', location: 'SEA', score: 9.1, match: 90, tier: 'high' },
  { id: 8, name: 'OpenAI', sector: 'AI', location: 'SF', score: 7.2, match: 82, tier: 'medium-high' },
  { id: 9, name: 'Revolut', sector: 'Fintech', location: 'LDN', score: 4.8, match: 55, tier: 'medium' },
  { id: 10, name: 'Google', sector: 'Search', location: 'MV', score: 8.9, match: 88, tier: 'high' },
  { id: 11, name: 'Dell', sector: 'OS', location: 'TX', score: 6.4, match: 70, tier: 'medium-high' },
  { id: 12, name: 'Duolingo', sector: 'Edu', location: 'PA', score: 2.1, match: 38, tier: 'low' },
]

const decorativeCells = [
  'high', 'medium-high', 'medium-high', 'high', 'medium', 'low',
  'medium-high', 'high', 'high', 'medium-high', 'medium', 'medium-high',
  'high', 'low', 'medium-high', 'high', 'medium-high', 'medium'
]

const tierConfig = {
  'high': { bg: 'heatcell-emerald', textBg: 'emerald' },
  'medium-high': { bg: 'heatcell-lime', textBg: 'lime' },
  'medium': { bg: 'heatcell-orange', textBg: 'orange' },
  'low': { bg: 'heatcell-red', textBg: 'red' },
}

export default function Heatmap() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div className="heatmap-tab" id="heatmap-tab">
      {/* Header */}
      <div className="heatmap-header">
        <h1 className="heatmap-title">Market Heatmap</h1>
        <p className="heatmap-subtitle">
          Global landscape of target companies mapped by cultural fit and technical alignment.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="heatmap-stats-grid">
        <div className="heatmap-stat-card">
          <p className="stat-label">Top Alignment</p>
          <p className="stat-value stat-value-primary">NVIDIA</p>
          <p className="stat-detail">9.8 Score · 94% Match</p>
        </div>
        <div className="heatmap-stat-card">
          <p className="stat-label">Total Mapped</p>
          <p className="stat-value">142</p>
          <p className="stat-detail">Companies analyzed</p>
        </div>
        <div className="heatmap-stat-card">
          <p className="stat-label">Resume Status</p>
          <div className="stat-resume">
            <span className="material-symbols-outlined stat-check">check_circle</span>
            <p className="stat-resume-file">Engineer_v4.pdf</p>
          </div>
        </div>
        <div className="heatmap-stat-card heatmap-stat-legend">
          <div>
            <p className="stat-label">Legend</p>
            <div className="legend-dots">
              <div className="legend-square legend-sq-emerald"></div>
              <div className="legend-square legend-sq-lime"></div>
              <div className="legend-square legend-sq-orange"></div>
              <div className="legend-square legend-sq-red"></div>
            </div>
          </div>
          <span className="material-symbols-outlined legend-info">info</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="heatmap-container">
        <div className="heatmap-grid" id="heatmap-grid">
          {heatmapCompanies.map((company, i) => {
            const config = tierConfig[company.tier]
            return (
              <motion.div
                key={company.id}
                className={`heatcell ${config.bg}`}
                onMouseEnter={() => setHoveredId(company.id)}
                onMouseLeave={() => setHoveredId(null)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                whileHover={{ scale: 0.97 }}
                id={`heatcell-${company.id}`}
              >
                <div className="heatcell-top">
                  <span className="heatcell-sector">
                    {company.sector} · {company.location}
                  </span>
                  <span className="heatcell-score">{company.score}</span>
                </div>
                <div className="heatcell-bottom">
                  <h3 className="heatcell-name">{company.name}</h3>
                  <p className="heatcell-match">{company.match}% MATCH</p>
                </div>
              </motion.div>
            )
          })}

          {/* Decorative cells */}
          {decorativeCells.map((tier, i) => (
            <div
              key={`deco-${i}`}
              className={`heatcell-deco ${tierConfig[tier].bg}`}
            />
          ))}
        </div>
      </div>

      {/* Contextual Insights */}
      <div className="heatmap-insights">
        <div className="insights-left">
          <h3 className="insights-heading">
            <span className="material-symbols-outlined insights-icon">trending_up</span>
            Emerging Opportunities
          </h3>
          <div className="insights-list">
            <div className="insight-card">
              <div className="insight-card-left">
                <div className="insight-icon-box">
                  <span className="material-symbols-outlined">rocket_launch</span>
                </div>
                <div>
                  <p className="insight-name">Mistral AI</p>
                  <p className="insight-detail">+12% Match increase this week</p>
                </div>
              </div>
              <button className="insight-action">Details</button>
            </div>
            <div className="insight-card">
              <div className="insight-card-left">
                <div className="insight-icon-box">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <div>
                  <p className="insight-name">Citadel</p>
                  <p className="insight-detail">New openings match your Tech Stack</p>
                </div>
              </div>
              <button className="insight-action">Details</button>
            </div>
          </div>
        </div>

        <div className="insights-right">
          <h3 className="filter-heading">Precise Filter</h3>
          <p className="filter-desc">
            The heatmap reflects your current resume uploaded on <strong>Oct 24, 2023</strong>.
            To refine these results, adjust your industry preferences or update your skill keywords.
          </p>
          <div className="filter-tags">
            <span className="filter-tag">Rust</span>
            <span className="filter-tag">Distributed Systems</span>
            <span className="filter-tag">Cloud Native</span>
            <span className="filter-tag-add">+ Add Filter</span>
          </div>
        </div>
      </div>
    </div>
  )
}
