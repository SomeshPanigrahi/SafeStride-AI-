 import { Ruler } from 'lucide-react'
import { useState, useEffect } from 'react'
import { runsAPI } from '../services/api'
import Navbar from '../Components/Navbar'
import { Plus, Trash2, Pencil, Check, X, ChevronDown, Calendar, Clock, Zap, Activity } from 'lucide-react'
import styles from './RunLog.module.css'

const INTENSITY_LABELS = { 1: 'Very Easy', 2: 'Easy', 3: 'Moderate', 4: 'Hard', 5: 'Max Effort' }
const INTENSITY_COLORS = { 1: '#4a9eff', 2: '#00d4ff', 3: '#00ff9d', 4: '#ffe44d', 5: '#ff3b5c' }

const MOCK_RUNS = [
  { _id: '1', date: '2024-01-15', duration: 45, distance: 8.2, intensity: 3, notes: 'Good steady run' },
  { _id: '2', date: '2024-01-13', duration: 30, distance: 5.0, intensity: 2, notes: 'Easy recovery' },
  { _id: '3', date: '2024-01-11', duration: 60, distance: 12.5, intensity: 4, notes: 'Tempo intervals' },
  { _id: '4', date: '2024-01-09', duration: 75, distance: 16.0, intensity: 3, notes: 'Long Sunday run' },
  { _id: '5', date: '2024-01-07', duration: 35, distance: 6.2, intensity: 2, notes: '' },
]

const defaultForm = { date: new Date().toISOString().slice(0, 10), duration: '', distance: '', intensity: 3, notes: '' }

export default function RunLog() {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [useMock, setUseMock] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('date')

  const fetchRuns = async () => {
    setLoading(true)
    try {
      const res = await runsAPI.getAll()
       setRuns(Array.isArray(res.data) ? res.data : res.data.runs || [])
      setUseMock(false)
    } catch {
      setRuns(MOCK_RUNS)
      setUseMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRuns() }, [])

  const handleFormChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const startEdit = (run) => {
    setEditId(run._id)
    setForm({
      date: run.date?.slice(0, 10) || '',
      duration: run.duration,
      distance: run.distance || '',
      intensity: run.intensity,
      notes: run.notes || ''
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditId(null)
    setForm(defaultForm)
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const payload = {
      date: form.date,
      duration: Number(form.duration),
      distance: form.distance ? Number(form.distance) : undefined,
      intensity: Number(form.intensity),
      notes: form.notes
    }
    try {
      if (editId) {
        await runsAPI.update(editId, payload)
      } else {
        await runsAPI.add(payload)
      }
      await fetchRuns()
      cancelForm()
    } catch {
      // Mock mode: local update
      if (useMock) {
        if (editId) {
          setRuns(r => r.map(x => x._id === editId ? { ...x, ...payload } : x))
        } else {
          setRuns(r => [{ ...payload, _id: String(Date.now()) }, ...r])
        }
        cancelForm()
      } else {
        setError('Failed to save run. Check your connection.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleteId(id)
    try {
      await runsAPI.delete(id)
      setRuns(r => r.filter(x => x._id !== id))
    } catch {
      if (useMock) {
        setRuns(r => r.filter(x => x._id !== id))
      }
    } finally {
      setDeleteId(null)
    }
  }

  const sorted = [...runs].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date)
    if (sortBy === 'duration') return b.duration - a.duration
    if (sortBy === 'intensity') return b.intensity - a.intensity
    return 0
  })

  const totalLoad = runs.reduce((s, r) => s + (r.duration * r.intensity), 0)
  const avgIntensity = runs.length ? (runs.reduce((s, r) => s + r.intensity, 0) / runs.length).toFixed(1) : 0

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Run Log</h1>
              <p className={styles.pageSub}>Track every session. Build your training history.</p>
            </div>
            <button className={styles.addBtn} onClick={() => { setShowForm(p => !p); if (editId) { setEditId(null); setForm(defaultForm) } }}>
              {showForm && !editId ? <X size={16} /> : <Plus size={16} />}
              {showForm && !editId ? 'Cancel' : 'Log Run'}
            </button>
          </div>

          {useMock && (
            <div className={styles.mockNotice}>⚡ Demo mode — your changes won't persist until the backend is connected</div>
          )}

          {/* Stats row */}
          <div className={styles.statsRow}>
            {[
              { label: 'TOTAL RUNS', value: runs.length, icon: <Activity size={16} /> },
              { label: 'TOTAL LOAD', value: totalLoad.toFixed(0), icon: <Zap size={16} /> },
              { label: 'AVG INTENSITY', value: avgIntensity, icon: <TrendingIcon size={16} /> },
            ].map((s, i) => (
              <div key={i} className={styles.statPill}>
                <span className={styles.statIcon}>{s.icon}</span>
                <span className={styles.statVal}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <span className={styles.formCardTitle}>
                  {editId ? '✎ Edit Run' : '+ New Run'}
                </span>
                <button className={styles.formClose} onClick={cancelForm}><X size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}><Calendar size={12} /> Date</label>
                    <input type="date" name="date" value={form.date} onChange={handleFormChange} className={styles.input} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}><Clock size={12} /> Duration (min)</label>
                    <input type="number" name="duration" value={form.duration} onChange={handleFormChange} placeholder="45" className={styles.input} min="1" max="600" required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}><Ruler size={12} /> Distance (km)</label>
                    <input type="number" name="distance" value={form.distance} onChange={handleFormChange} placeholder="8.5" className={styles.input} step="0.1" min="0" />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}><Zap size={12} /> Intensity (1–5)</label>
                    <div className={styles.intensityPicker}>
                      {[1,2,3,4,5].map(n => (
                        <button
                          key={n}
                          type="button"
                          className={`${styles.intensityBtn} ${Number(form.intensity) === n ? styles.intensityActive : ''}`}
                          style={Number(form.intensity) === n ? { borderColor: INTENSITY_COLORS[n], color: INTENSITY_COLORS[n], background: INTENSITY_COLORS[n] + '18' } : {}}
                          onClick={() => setForm(p => ({ ...p, intensity: n }))}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <div className={styles.intensityLabel} style={{ color: INTENSITY_COLORS[form.intensity] }}>
                      {INTENSITY_LABELS[form.intensity]}
                    </div>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Notes (optional)</label>
                  <input type="text" name="notes" value={form.notes} onChange={handleFormChange} placeholder="How did it feel?" className={styles.input} />
                </div>
                {error && <div className={styles.errorMsg}>⚠ {error}</div>}
                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelBtn} onClick={cancelForm}>Cancel</button>
                  <button type="submit" className={styles.saveBtn} disabled={submitting}>
                    {submitting ? 'Saving...' : <><Check size={15} /> {editId ? 'Update Run' : 'Save Run'}</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sort controls */}
          <div className={styles.controls}>
            <span className={styles.runCount}>{runs.length} runs logged</span>
            <div className={styles.sortGroup}>
              <span className={styles.sortLabel}>Sort by</span>
              {['date', 'duration', 'intensity'].map(s => (
                <button
                  key={s}
                  className={`${styles.sortBtn} ${sortBy === s ? styles.sortActive : ''}`}
                  onClick={() => setSortBy(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Run list */}
          {loading ? (
            <div className={styles.loadingState}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.skeleton} style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>⬡</div>
              <div className={styles.emptyTitle}>No runs yet</div>
              <p className={styles.emptyDesc}>Log your first run to start tracking your training load</p>
              <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                <Plus size={16} /> Log First Run
              </button>
            </div>
          ) : (
            <div className={styles.runList}>
              {sorted.map((run, i) => {
                const load = run.duration * run.intensity
                const ic = INTENSITY_COLORS[run.intensity] || '#00d4ff'
                return (
                  <div key={run._id} className={styles.runCard} style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className={styles.runColorBar} style={{ background: ic }} />
                    <div className={styles.runMain}>
                      <div className={styles.runDate}>
                        {new Date(run.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className={styles.runMeta}>
                        <span className={styles.runMetaItem}>
                          <Clock size={13} />
                          {run.duration} min
                        </span>
                        {run.distance && (
                          <span className={styles.runMetaItem}>
                            <Ruler size={13} />
                            {run.distance} km
                          </span>
                        )}
                        <span className={styles.intensityTag} style={{ color: ic, borderColor: ic + '40', background: ic + '10' }}>
                          <Zap size={12} />
                          {INTENSITY_LABELS[run.intensity]}
                        </span>
                      </div>
                      {run.notes && <div className={styles.runNotes}>{run.notes}</div>}
                    </div>
                    <div className={styles.runRight}>
                      <div className={styles.loadValue}>
                        <span className={styles.loadNum}>{load}</span>
                        <span className={styles.loadSub}>load</span>
                      </div>
                      <div className={styles.runActions}>
                        <button className={styles.editBtn} onClick={() => startEdit(run)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(run._id)}
                          disabled={deleteId === run._id}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function TrendingIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

// function RulerIcon({ size }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z" />
//       <path d="m7.5 10.5 2 2" /><path d="m10.5 7.5 2 2" /><path d="m13.5 4.5 2 2" /><path d="m4.5 13.5 2 2" />
//     </svg>
//   )
// }