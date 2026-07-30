import axios from 'axios'

const getApiBaseUrl = () => {
  let rawUrl = import.meta.env.VITE_API_URL || '/api'
  if (rawUrl === '/api') return '/api'

  // Prepend https:// if protocol is missing
  if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
    rawUrl = `https://${rawUrl}`
  }

  // Remove trailing slashes
  rawUrl = rawUrl.replace(/\/+$/, '')

  // Append /api if not present
  if (!rawUrl.endsWith('/api')) {
    rawUrl = `${rawUrl}/api`
  }

  return rawUrl
}

export const API_BASE_URL = getApiBaseUrl()

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('brandit_access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for automatic token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('brandit_refresh_token')
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
          const newAccessToken = res.data.accessToken
          localStorage.setItem('brandit_access_token', newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        } catch (refreshErr) {
          localStorage.removeItem('brandit_access_token')
          localStorage.removeItem('brandit_refresh_token')
          localStorage.removeItem('brandit_user')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
