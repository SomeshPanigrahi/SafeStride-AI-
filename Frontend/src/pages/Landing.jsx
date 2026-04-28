import { Link } from 'react-router-dom'
import { ArrowRight, Shield, TrendingUp, Zap, Activity, Target, Brain } from 'lucide-react'
import styles from './Landing.module.css'

const features = [
  {
    icon: <Brain size={22} />,
    title: 'AI-Powered Risk Analysis',
    desc: 'Real-time ACWR calculation detects injury risk before it becomes a problem. Science-backed thresholds keep you in the optimal training zone.',
    tag: 'CORE ENGINE',
    color: 'cyan'
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Training Load Intelligence',
    desc: 'Track acute vs chronic load across 7 and 28-day windows. Visual dashboards make complex sports science immediately actionable.',
    tag: 'ANALYTICS',
    color: 'green'
  },
  {
    icon: <Shield size={22} />,
    title: 'Injury Prevention Guard',
    desc: 'Four-tier risk system: Low → Optimal → Warning → High Risk. Get precise guidance on when to push and when to recover.',
    tag: 'SAFETY',
    color: 'orange'
  },
  {
    icon: <Activity size={22} />,
    title: 'Run History & Trends',
    desc: 'Log every session with duration, distance and intensity. See your 28-day arc and understand the patterns behind your performance.',
    tag: 'TRACKING',
    color: 'cyan'
  },
  {
    icon: <Target size={22} />,
    title: 'Smart Cold-Start Logic',
    desc: 'New to the app? The engine adapts automatically. No history needed — SafeStride calibrates to your baseline from day one.',
    tag: 'ADAPTIVE',
    color: 'green'
  },
  {
    icon: <Zap size={22} />,
    title: 'Instant Feedback Loop',
    desc: 'After every logged run, your risk status updates in real time. No waiting. No guessing. Just clear, immediate intelligence.',
    tag: 'REAL-TIME',
    color: 'orange'
  }
]

const riskLevels = [
  { range: '< 0.8', label: 'Low', desc: 'Undertraining zone', color: '#4a9eff' },
  { range: '0.8–1.3', label: 'Optimal', desc: 'Peak performance zone', color: '#00ff9d' },
  { range: '1.3–1.5', label: 'Warning', desc: 'Caution advised', color: '#ffe44d' },
  { range: '> 1.5', label: 'High Risk', desc: 'Injury risk elevated', color: '#ff3b5c' },
]

export default function Landing() {
  return (
    <div className={styles.page}>
      {/* Animated grid background */}
      <div className={styles.gridBg} />
      <div className={styles.gradientOrb1} />
      <div className={styles.gradientOrb2} />

      {/* Navbar */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoHex}>⬡</span>
            <span>SafeStride<span className={styles.logoAi}>AI</span></span>
          </div>
          <div className={styles.headerActions}>
            <Link to="/auth" className={styles.loginLink}>Sign In</Link>
            <Link to="/auth?mode=register" className={styles.ctaSmall}>Get Started</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot} />
          <span className={styles.badgeText}>Sports Science × AI</span>
        </div>

        <h1 className={styles.heroTitle}>
          Run Smarter.<br />
          <span className={styles.heroAccent}>Stay Safer.</span>
        </h1>

        <p className={styles.heroSubtitle}>
          SafeStride AI monitors your training load in real time, 
          calculates injury risk using proven sports science,
          and tells you exactly when to push — and when to rest.
        </p>

        <div className={styles.heroActions}>
          <Link to="/auth?mode=register" className={styles.heroCta}>
            Start Free
            <ArrowRight size={18} />
          </Link>
          <Link to="/auth" className={styles.heroSecondary}>
            Sign In
          </Link>
        </div>

        {/* ACWR mini-demo */}
        <div className={styles.heroStats}>
          {[
            { label: 'ACWR', value: '1.12', status: 'OPTIMAL', color: 'var(--accent-green)' },
            { label: 'ACUTE LOAD', value: '487', status: '7-DAY AVG', color: 'var(--accent-cyan)' },
            { label: 'CHRONIC LOAD', value: '434', status: '28-DAY AVG', color: 'var(--accent-cyan)' },
            { label: 'RISK LEVEL', value: '●', status: 'OPTIMAL ZONE', color: 'var(--accent-green)' },
          ].map((stat, i) => (
            <div key={i} className={styles.statCard} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue} style={{ color: stat.color }}>{stat.value}</div>
              <div className={styles.statStatus}>{stat.status}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RISK SYSTEM */}
      <section className={styles.riskSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>THE SCIENCE</span>
          <h2 className={styles.sectionTitle}>ACWR Risk Classification</h2>
          <p className={styles.sectionDesc}>
            Acute:Chronic Workload Ratio — the gold standard of injury prevention in elite sports.
          </p>
        </div>
        <div className={styles.riskGrid}>
          {riskLevels.map((r, i) => (
            <div key={i} className={styles.riskCard} style={{ '--risk-color': r.color, animationDelay: `${i * 0.1}s` }}>
              <div className={styles.riskRange}>{r.range}</div>
              <div className={styles.riskLabel} style={{ color: r.color }}>{r.label}</div>
              <div className={styles.riskDesc}>{r.desc}</div>
              <div className={styles.riskBar}>
                <div className={styles.riskBarFill} style={{ background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>CAPABILITIES</span>
          <h2 className={styles.sectionTitle}>Everything You Need</h2>
          <p className={styles.sectionDesc}>Built on real sports science. Designed for serious runners.</p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} className={`${styles.featureCard} ${styles[`color_${f.color}`]}`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={styles.featureTag}>{f.tag}</div>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <span className={styles.sectionTag}>GET STARTED FREE</span>
          <h2 className={styles.ctaTitle}>Your Training.<br />Your Data.<br />Your Safety.</h2>
          <p className={styles.ctaDesc}>Join runners who use SafeStride AI to train with precision and stay injury-free.</p>
          <Link to="/auth?mode=register" className={styles.heroCta}>
            Create Your Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <span className={styles.logoHex}>⬡</span>
            SafeStride<span className={styles.logoAi}>AI</span>
          </div>
          <p className={styles.footerText}>
            Built on sports science. Powered by data. Designed for runners.
          </p>
        </div>
      </footer>
    </div>
  )
}