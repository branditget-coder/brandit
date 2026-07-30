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
  role: 'USER' | 'ADMIN'
  emailVerified: boolean
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isSessionExpired: boolean
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string, phone?: string) => Promise<void>
  loginWithSocial: (provider: 'google', tokenOrCode: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  closeSessionExpiredModal: () => void
}

const SESSION_TIMEOUT_MS = 10 * 60 * 1000 // 10 minutes

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('brandit_user')
    return saved ? JSON.parse(saved) : null
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
      const token = localStorage.getItem('brandit_access_token')
      if (token) {
        try {
          const res = await api.get<User>('/auth/me')
          setUser(res.data)
          localStorage.setItem('brandit_user', JSON.stringify(res.data))
        } catch {
          // Token invalid
          logout()
        }
      }
      setIsLoading(false)
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

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    saveAuthSession(res.data.accessToken, res.data.refreshToken, res.data.user)
  }

  const register = async (firstName: string, lastName: string, email: string, password: string, phone?: string) => {
    await api.post('/auth/register', { firstName, lastName, email, password, phone })
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
