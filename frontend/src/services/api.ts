import axios from 'axios'

const getApiBaseUrl = () => {
  let rawUrl = import.meta.env.VITE_API_URL

  // If VITE_API_URL is explicitly set to a custom remote API domain (e.g. https://api.go-brandit.com)
  if (rawUrl && rawUrl.trim() !== '' && rawUrl !== '/api') {
    let clean = rawUrl.trim()
    // Do not force direct browser connections to up.railway.app subdomains because mobile carriers (Jio/Airtel/Vi) block them
    if ((clean.startsWith('http://') || clean.startsWith('https://')) && !clean.includes('up.railway.app')) {
      clean = clean.replace(/\/+$/, '')
      if (!clean.endsWith('/api')) {
        clean = `${clean}/api`
      }
      return clean
    }
  }

  // Default to relative '/api' route.
  // In Vercel production: Vercel proxies '/api/*' -> Railway backend server-to-server (bypassing mobile ISP blocks).
  // In Vite local dev: Vite proxies '/api/*' -> localhost:8080.
  return '/api'
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
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                           originalRequest?.url?.includes('/auth/register') ||
                           originalRequest?.url?.includes('/auth/refresh') ||
                           originalRequest?.url?.includes('/auth/forgot-password') ||
                           originalRequest?.url?.includes('/auth/reset-password')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
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
