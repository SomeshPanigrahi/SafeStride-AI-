import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ss_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// Runs
export const runsAPI = {
  getAll: () => api.get('/runs'),
  add: (data) => api.post('/runs', data),
  bulkAdd: (runs) => api.post('/runs/bulk', { runs }),
  update: (id, data) => api.put(`/runs/${id}`, data),
  delete: (id) => api.delete(`/runs/${id}`),
}

// Analytics
export const analyticsAPI = {
  dashboard: () => api.get('/analytics/dashboard'),
  load: () => api.get('/analytics/load'),
  weeklyLoad: () => api.get('/analytics/weekly-load'),
  history: () => api.get('/analytics/history'),
  risk: () => api.get('/analytics/risk'),
}

export default api