

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { analyticsAPI } from '../services/api'
import Navbar from '../Components/Navbar'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Activity, TrendingUp, ShieldAlert, Plus, RefreshCw } from 'lucide-react'
import styles from './Dashboard.module.css'

const RISK_CONFIG = {
  low: { label: 'Low', color: '#4a9eff', bg: 'rgba(74,158,255,0.1)', border: 'rgba(74,158,255,0.3)' },
  optimal: { label: 'Optimal', color: '#00ff9d', bg: 'rgba(0,255,157,0.1)', border: 'rgba(0,255,157,0.3)' },
  warning: { label: 'Warning', color: '#ffe44d', bg: 'rgba(255,228,77,0.1)', border: 'rgba(255,228,77,0.3)' },
  high: { label: 'High Risk', color: '#ff3b5c', bg: 'rgba(255,59,92,0.1)', border: 'rgba(255,59,92,0.3)' },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className={styles.tooltipRow}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await analyticsAPI.dashboard()
      const d = res.data

      console.log("REAL DASHBOARD:", d)

      setData({
        acwr: d.summary?.acwr ?? 0,
        acuteLoad: d.summary?.acuteLoad ?? 0,
        chronicLoad: d.summary?.chronicLoad ?? 0,
        riskLevel: d.summary?.riskLevel?.toLowerCase() || 'optimal',
        totalRuns: d.totalRuns ?? 0,
        weeklyLoad: d.weeklyLoad ?? [],
        history: d.history ?? [],
        explanation: d.explanation ?? "", // ✅ NEW
      })

    } catch (err) {
      console.error("Dashboard fetch failed:", err)
      setError("Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const risk = RISK_CONFIG[data?.riskLevel] || RISK_CONFIG.optimal

  const firstName =
    user?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Athlete'

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>

          {/* Header */}
          <div className={styles.pageHeader}>
            <div>
              <div className={styles.greeting}>
                <span className={styles.greetingDot} />
                <span className={styles.greetingText}>
                  {new Date().getHours() < 12 ? 'Good morning' :
                   new Date().getHours() < 17 ? 'Good afternoon' :
                   'Good evening'}
                </span>
              </div>

              <h1 className={styles.pageTitle}>
                {firstName}<span className={styles.comma}>,</span>
              </h1>

              <p className={styles.pageSub}>
                Here's your training intelligence for today
              </p>
            </div>

            <div className={styles.headerActions}>
              <button
                onClick={fetchData}
                className={styles.refreshBtn}
                disabled={loading}
              >
                <RefreshCw size={15} className={loading ? styles.spinning : ''} />
                Refresh
              </button>

              <Link to="/runs" className={styles.addRunBtn}>
                <Plus size={16} />
                Log Run
              </Link>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.demoNotice}>
              ⚠️ {error}
            </div>
          )}

          {/* KPI Row */}
          <div className={styles.kpiGrid}>

            {/* ACWR */}
            <div
              className={styles.acwrCard}
              style={{
                '--risk-color': risk.color,
                '--risk-bg': risk.bg,
                '--risk-border': risk.border
              }}
            >
              <div className={styles.acwrLabel}>
                <span className={styles.kpiTag}>ACWR</span>
                <span className={styles.acwrInfo}>
                  Acute:Chronic Workload Ratio
                </span>
              </div>

              <div className={styles.acwrValue}>
                {loading ? '—' : data?.acwr?.toFixed(2)}
              </div>

              <div className={styles.acwrBadge}>
                <span className={styles.acwrDot} />
                {risk.label}
              </div>
            </div>

            {/* Mini KPIs */}
            <div className={styles.kpiMini}>
              {[
                {
                  tag: 'ACUTE LOAD',
                  value: loading ? '—' : data?.acuteLoad?.toFixed(0),
                  sub: '7-day average',
                  icon: <Activity size={18} />,
                  color: 'cyan'
                },
                {
                  tag: 'CHRONIC LOAD',
                  value: loading ? '—' : data?.chronicLoad?.toFixed(0),
                  sub: '28-day average',
                  icon: <TrendingUp size={18} />,
                  color: 'green'
                },
                {
                  tag: 'TOTAL RUNS',
                  value: loading ? '—' : data?.totalRuns,
                  sub: 'logged sessions',
                  icon: <ShieldAlert size={18} />,
                  color: 'orange'
                }
              ].map((k, i) => (
                <div key={i} className={`${styles.kpiCard} ${styles[`kpi_${k.color}`]}`}>
                  <div className={styles.kpiCardTop}>
                    <span className={styles.kpiTag}>{k.tag}</span>
                    <span className={styles.kpiIcon}>{k.icon}</span>
                  </div>
                  <div className={styles.kpiValue}>{k.value}</div>
                  <div className={styles.kpiSub}>{k.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className={styles.chartsGrid}>

            {/* Weekly */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <div className={styles.chartTitle}>Weekly Load</div>
                  <div className={styles.chartSub}>Last 7 days</div>
                </div>
              </div>

              <div className={styles.chartBody}>
                {!loading && (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data?.weeklyLoad}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="load" fill="#00d4ff" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* History */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <div className={styles.chartTitle}>28-Day History</div>
                </div>
              </div>

              <div className={styles.chartBody}>
                {!loading && (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data?.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="load" stroke="#00d4ff" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* 🔥 AI EXPLANATION SECTION */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>AI Coach Insight</div>
            </div>

            <div className={styles.chartBody}>
              {loading ? (
                <p>Analyzing your training...</p>
              ) : (
                <p>
                  {data?.explanation ||
                    "Keep logging runs to unlock personalized training insights."}
                </p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}