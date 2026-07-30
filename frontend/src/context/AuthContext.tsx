import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

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
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string, phone?: string) => Promise<void>
  loginWithSocial: (provider: 'google', tokenOrCode: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('brandit_user')
    return saved ? JSON.parse(saved) : null
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const isAuthenticated = !!user && !!localStorage.getItem('brandit_access_token')

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
          localStorage.removeItem('brandit_access_token')
          localStorage.removeItem('brandit_refresh_token')
          localStorage.removeItem('brandit_user')
          setUser(null)
        }
      }
      setIsLoading(false)
    }
    checkAuthStatus()
  }, [])

  const saveAuthSession = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('brandit_access_token', accessToken)
    localStorage.setItem('brandit_refresh_token', refreshToken)
    localStorage.setItem('brandit_user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    saveAuthSession(res.data.accessToken, res.data.refreshToken, res.data.user)
  }

  const register = async (firstName: string, lastName: string, email: string, password: string, phone?: string) => {
    // Register account — do NOT auto-login. User will be redirected to /login.
    await api.post('/auth/register', { firstName, lastName, email, password, phone })
  }

  const loginWithSocial = async (provider: 'google', tokenOrCode: string) => {
    const res = await api.post('/auth/google', { token: tokenOrCode })
    saveAuthSession(res.data.accessToken, res.data.refreshToken, res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('brandit_access_token')
    localStorage.removeItem('brandit_refresh_token')
    localStorage.removeItem('brandit_user')
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    const res = await api.put<User>('/auth/profile', data)
    setUser(res.data)
    localStorage.setItem('brandit_user', JSON.stringify(res.data))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        loginWithSocial,
        logout,
        updateProfile,
      }}
    >
      {children}
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
