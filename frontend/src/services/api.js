import axios from 'axios'
import store  from '@/store'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

/* ── attach token to every request ── */
api.interceptors.request.use(function(config) {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

/* ── response error handler ── */
api.interceptors.response.use(
  function(res) { return res },

  function(err) {
    const status  = err.response && err.response.status
    const url     = err.config && err.config.url || ''

                               
    const isFetchMe   = url.includes('/auth/me') || url.includes('/users/me')
    const onLoginPage = window.location.pathname === '/login'

    if (status === 401 && !isFetchMe && !onLoginPage) {
      /* clear both token AND user so store rehydrates cleanly */
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      /* use Vuex to clear auth state properly instead of just localStorage */
      try { store.commit('auth/CLEAR_AUTH') } catch(e) {}

      window.location.href = '/login'
    }

    return Promise.reject(err)
  }
)

export default api