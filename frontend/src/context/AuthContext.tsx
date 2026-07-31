import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import api from '../services/api'
import SessionTimeoutModal from '../components/auth/SessionTimeoutModal'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  linkedinUrl?: string
  currentRole?: string
  bio?: string
  role: 'USER' | 'ADMIN' | 'TEAM'
  emailVerified: boolean
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isSessionExpired: boolean
  login: (email: string, password: string) => Promise<User>
  register: (firstName: string, lastName: string, email: string, password: string, phone?: string, role?: 'USER' | 'TEAM') => Promise<User>
  loginWithSocial: (provider: 'google', tokenOrCode: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  closeSessionExpiredModal: () => void
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes (was 10, too aggressive for users)

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('brandit_user')
      if (saved && saved !== 'undefined' && saved !== 'null') {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to parse cached user:', e)
      localStorage.removeItem('brandit_user')
    }
    return null
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isAuthenticated = !!user && !!localStorage.getItem('brandit_access_token')

  const logout = useCallback(() => {
    localStorage.removeItem('brandit_access_token')
    localStorage.removeItem('brandit_refresh_token')
    localStorage.removeItem('brandit_user')
    setUser(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleSessionTimeout = useCallback(() => {
    logout()
    setIsSessionExpired(true)
  }, [logout])

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (user && localStorage.getItem('brandit_access_token')) {
      timeoutRef.current = setTimeout(handleSessionTimeout, SESSION_TIMEOUT_MS)
    }
  }, [user, handleSessionTimeout])

  // Set up 10-minute inactivity listeners when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) return

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    
    // Start initial timer
    resetInactivityTimer()

    const handleUserActivity = () => {
      resetInactivityTimer()
    }

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity)
    })

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity)
      })
    }
  }, [isAuthenticated, resetInactivityTimer])

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('brandit_access_token')
        if (!token) {
          setIsLoading(false)
          return
        }

        try {
          const res = await api.get<User>('/auth/me')
          setUser(res.data)
          localStorage.setItem('brandit_user', JSON.stringify(res.data))
        } catch (err: any) {
          const status = err?.response?.status
          // Only hard-logout on explicit auth failures (401/403)
          // On network error, 500, or Railway cold-start timeout: keep cached user
          if (status === 401 || status === 403) {
            // Try refresh token first before giving up
            const refreshToken = localStorage.getItem('brandit_refresh_token')
            if (refreshToken) {
              try {
                const refreshRes = await api.post('/auth/refresh', { refreshToken })
                const newAccessToken = refreshRes.data.accessToken
                localStorage.setItem('brandit_access_token', newAccessToken)
                // Retry /me with new token
                const retryRes = await api.get<User>('/auth/me')
                setUser(retryRes.data)
                localStorage.setItem('brandit_user', JSON.stringify(retryRes.data))
              } catch (_refreshErr) {
                // Refresh also failed — truly expired, log out
                logout()
              }
            } else {
              logout()
            }
          }
          // For network errors / server errors: silently keep cached user state
        }
      } finally {
        setIsLoading(false)
      }
    }
    checkAuthStatus()
  }, [logout])

  const saveAuthSession = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('brandit_access_token', accessToken)
    localStorage.setItem('brandit_refresh_token', refreshToken)
    localStorage.setItem('brandit_user', JSON.stringify(userData))
    setUser(userData)
    setIsSessionExpired(false)
    resetInactivityTimer()
  }

  const login = async (email: string, password: string): Promise<User> => {
    const cleanEmail = email ? email.trim().toLowerCase() : ''
    const res = await api.post('/auth/login', { email: cleanEmail, password })
    saveAuthSession(res.data.accessToken, res.data.refreshToken, res.data.user)
    return res.data.user
  }

  const register = async (firstName: string, lastName: string, email: string, password: string, phone?: string, role?: 'USER' | 'TEAM'): Promise<User> => {
    const cleanEmail = email ? email.trim().toLowerCase() : ''
    const res = await api.post('/auth/register', { firstName, lastName, email: cleanEmail, password, phone, role })
    saveAuthSession(res.data.accessToken, res.data.refreshToken, res.data.user)
    return res.data.user
  }

  const loginWithSocial = async (provider: 'google', tokenOrCode: string) => {
    const res = await api.post('/auth/google', { token: tokenOrCode })
    saveAuthSession(res.data.accessToken, res.data.refreshToken, res.data.user)
  }

  const updateProfile = async (data: Partial<User>) => {
    const res = await api.put<User>('/auth/profile', data)
    setUser(res.data)
    localStorage.setItem('brandit_user', JSON.stringify(res.data))
  }

  const closeSessionExpiredModal = () => {
    setIsSessionExpired(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isSessionExpired,
        login,
        register,
        loginWithSocial,
        logout,
        updateProfile,
        closeSessionExpiredModal,
      }}
    >
      {children}
      <SessionTimeoutModal
        open={isSessionExpired}
        onClose={closeSessionExpiredModal}
      />
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
