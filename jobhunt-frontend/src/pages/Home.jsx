import { useRef, useEffect, useState, Suspense, lazy } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import './Home.css'

const Spline = lazy(() => import('@splinetool/react-spline'))

export default function Home() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [splineLoaded, setSplineLoaded] = useState(false)

  const { scrollY } = useScroll()

  // Robot fades out and scales down over deeper scroll
  const splineOpacity = useTransform(scrollY, [0, 600], [1, 0])
  const splineScale = useTransform(scrollY, [0, 600], [1, 0.85])
  const splineY = useTransform(scrollY, [0, 600], [0, -100])

  // Navbar fades in after scrolling past the robot
  const navOpacity = useTransform(scrollY, [300, 500], [0, 1])
  const navY = useTransform(scrollY, [300, 500], [-20, 0])

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div className="home" ref={containerRef}>
      {/* ── Ambient Background ── */}
      <div className="home-ambient">
        <div
          className="ambient-orb ambient-orb-1"
          style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
        />
        <div
          className="ambient-orb ambient-orb-2"
          style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }}
        />
        <div
          className="ambient-orb ambient-orb-3"
          style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }}
        />
        <div className="grid-overlay" />
      </div>

      {/* ── Navbar — Hidden initially, appears on scroll ── */}
      <motion.header
        className="home-nav"
        id="home-navbar"
        style={{ opacity: navOpacity, y: navY }}
      >
        <div className="home-nav-inner">
          <div className="home-brand">
            <span className="material-symbols-outlined" style={{ color: 'var(--accent-primary)', fontSize: '20px' }}>radar</span>
            <span>JOBRADAR</span>
          </div>
          <nav className="home-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">Process</a>
            <a href="#stats">Data</a>
          </nav>
          <button
            className="home-cta-nav"
            onClick={() => navigate('/dashboard')}
            id="nav-launch-btn"
          >
            Launch Dashboard →
          </button>
        </div>
      </motion.header>

      {/* ── 3D Spline Fullscreen Entry (sticky, no nav, fades on scroll) ── */}
      <div className="hero-sticky-wrapper">
        <motion.section
          className="hero-fullscreen"
          id="hero-fullscreen"
          style={{ opacity: splineOpacity, scale: splineScale, y: splineY }}
        >
          {/* ── High-Fidelity Loading Overlay ── */}
          {!splineLoaded && (
            <div className="radar-loader-overlay">
              <div className="radar-circle">
                <div className="radar-sweep" />
                <div className="radar-ping" />
              </div>
              <div className="radar-text">
                <span className="loading-label">INITIALIZING RADAR</span>
                <span className="loading-status">Waking up systems...</span>
              </div>
            </div>
          )}

          <ErrorBoundary
            fallback={
              <iframe
                src="https://my.spline.design/nexbotrobotcharacterconcept-HvE6PMsSSB9oIsUdE5M8ulk3/"
                frameBorder="0"
                width="100%"
                height="100%"
                title="Spline 3D Robot Hub"
                onLoad={() => setSplineLoaded(true)}
                style={{ pointerEvents: 'auto' }}
              />
            }
          >
            <Suspense fallback={null}>
              <Spline
                scene="https://prod.spline.design/HvE6PMsSSB9oIsUdE5M8ulk3/scene.splinecode"
                onLoad={() => setSplineLoaded(true)}
                onError={() => console.error('Spline failed to load native')}
                style={{ pointerEvents: 'auto' }}
              />
            </Suspense>
          </ErrorBoundary>

          {/* ── Scroll Indicator Overlay ── */}
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <div className="scroll-line" />
            <span>Scroll to Explore</span>
          </motion.div>
        </motion.section>
      </div>

      {/* ── Home Page Content (Scroll down to see) ── */}
      <section
        className="hero-content-section"
        ref={heroRef}
        id="hero-content"
      >
        <div className="container">
          <div className="hero-content-inner">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="badge-dot" />
              <span>AI-Powered Hiring Intelligence</span>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="title-line">Navigate the</span>
              <span className="title-line title-accent">Job Market</span>
              <span className="title-line">with Precision</span>
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Track company reputations, visualize hiring patterns,
              and align your skills — all powered by your personal AI radar assistant.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <button
                className="btn-primary"
                onClick={() => navigate('/dashboard')}
                id="hero-launch-btn"
              >
                <span>Launch Dashboard</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="btn-secondary-outline" id="hero-explore-btn">
                <span>Explore Features</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Marquee ── */}
      <section className="stats-marquee" id="stats">
        <div className="marquee-track">
          {[
            { value: '12K+', label: 'Companies Tracked' },
            { value: '98%', label: 'Ghost Detection Rate' },
            { value: '45K', label: 'Reports Filed' },
            { value: '87%', label: 'Match Accuracy' },
            { value: '12K+', label: 'Companies Tracked' },
            { value: '98%', label: 'Ghost Detection Rate' },
            { value: '45K', label: 'Reports Filed' },
            { value: '87%', label: 'Match Accuracy' },
          ].map((stat, i) => (
            <div className="marquee-item" key={i}>
              <span className="marquee-value">{stat.value}</span>
              <span className="marquee-label">{stat.label}</span>
              <span className="marquee-sep">◈</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="features-section" id="features">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-tag">CAPABILITIES</span>
            <h2 className="section-title">
              Four pillars of<br />
              <span className="text-gradient">hiring intelligence</span>
            </h2>
          </motion.div>

          <div className="features-grid">
            {[
              {
                icon: '◆',
                title: 'Company Radar',
                desc: 'Searchable database with reputation scores, ghost rates, and AI-powered resume matching. Every card tells a story.',
                tag: 'COMPANIES',
                accent: 'primary',
              },
              {
                icon: '◈',
                title: 'Market Heatmap',
                desc: 'Color-coded grid visualization. Green for growth, red for caution. See the hiring landscape at a glance.',
                tag: 'HEATMAP',
                accent: 'secondary',
              },
              {
                icon: '◉',
                title: 'Experience Reports',
                desc: 'Submit and analyze application experiences. Star ratings, ghost detection, and red flag identification.',
                tag: 'REPORT',
                accent: 'primary',
              },
              {
                icon: '◎',
                title: 'Resume Analysis',
                desc: 'Upload your resume, visualize skill alignment, and identify gaps across your target companies.',
                tag: 'MY RESUME',
                accent: 'secondary',
              },
            ].map((feature, i) => (
              <motion.div
                className={`feature-card feature-card-${feature.accent}`}
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
              >
                <div className="feature-card-header">
                  <span className="feature-icon">{feature.icon}</span>
                  <span className="feature-tag">{feature.tag}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
                <div className="feature-line" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-tag">PROCESS</span>
            <h2 className="section-title">
              Three steps to<br />
              <span className="text-gradient-warm">clarity</span>
            </h2>
          </motion.div>

          <div className="steps-grid">
            {[
              { num: '01', title: 'Upload Resume', desc: 'Drop your PDF and let our engine extract your skill profile automatically.' },
              { num: '02', title: 'Scan the Market', desc: 'Our radar analyzes thousands of companies against your profile in real-time.' },
              { num: '03', title: 'Target & Apply', desc: 'Focus on high-match, low-ghost companies. Apply with confidence.' },
            ].map((step, i) => (
              <motion.div
                className="step-card"
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
              >
                <span className="step-num">{step.num}</span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-block"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="cta-title">
              Ready to decode the<br />job market?
            </h2>
            <p className="cta-sub">
              Stop applying blind. Start applying smart.
            </p>
            <button
              className="btn-primary btn-large"
              onClick={() => navigate('/dashboard')}
              id="cta-launch-btn"
            >
              <span>Launch JobRadar</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-inner">
            <span className="footer-brand">JOBRADAR</span>
            <span className="footer-copy">© 2026 — Hiring Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
