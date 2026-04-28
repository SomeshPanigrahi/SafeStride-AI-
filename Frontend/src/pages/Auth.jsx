import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { Eye, EyeOff, ArrowLeft, Loader } from 'lucide-react'
import styles from './Auth.module.css'

export default function Auth() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') === 'register' ? 'register' : 'login')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setError('')
    setFormData({ name: '', email: '', password: '' })
  }, [mode])

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const res = await authAPI.register(formData)
        login(res.data.user, res.data.token)
      } else {
        const res = await authAPI.login({ email: formData.email, password: formData.password })
        login(res.data.user, res.data.token)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.bgOrb} />

      <Link to="/" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <div className={styles.container}>
        {/* Left panel */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <div className={styles.logo}>
              <span className={styles.logoHex}>⬡</span>
              <span>SafeStride<span className={styles.logoAi}>AI</span></span>
            </div>
            <h2 className={styles.leftTitle}>
              Train with<br />
              <span className={styles.leftAccent}>intelligence.</span>
            </h2>
            <p className={styles.leftDesc}>
              Your personal AI-powered training coach. Log runs, track load, and prevent injuries before they happen.
            </p>

            <div className={styles.features}>
              {[
                { icon: '⬡', text: 'Real-time ACWR calculation' },
                { icon: '⬡', text: 'Injury risk prediction' },
                { icon: '⬡', text: '28-day training history' },
                { icon: '⬡', text: 'Personalized risk alerts' },
              ].map((f, i) => (
                <div key={i} className={styles.featureItem} style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative metrics */}
          <div className={styles.demoCard}>
            <div className={styles.demoLabel}>CURRENT ACWR</div>
            <div className={styles.demoValue}>1.09</div>
            <div className={styles.demoStatus}>
              <span className={styles.demoStatusDot} />
              OPTIMAL ZONE
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className={styles.rightPanel}>
          <div className={styles.formContainer}>
            {/* Mode toggle */}
            <div className={styles.modeToggle}>
              <button
                className={`${styles.modeBtn} ${mode === 'login' ? styles.modeActive : ''}`}
                onClick={() => setMode('login')}
              >Sign In</button>
              <button
                className={`${styles.modeBtn} ${mode === 'register' ? styles.modeActive : ''}`}
                onClick={() => setMode('register')}
              >Create Account</button>
            </div>

            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>
                {mode === 'login' ? 'Welcome back' : 'Start your journey'}
              </h1>
              <p className={styles.formSubtitle}>
                {mode === 'login'
                  ? 'Sign in to your SafeStride AI account'
                  : 'Create an account to track your training'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {mode === 'register' && (
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Runner"
                    className={styles.input}
                    required
                    autoComplete="name"
                  />
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={styles.input}
                  required
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <div className={styles.passWrap}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={styles.input}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className={styles.errorMsg}>
                  <span>⚠</span> {error}
                </div>
              )}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <><Loader size={16} className={styles.spinner} /> Processing...</>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <p className={styles.switchText}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button className={styles.switchLink} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}