export type UserRole = 'USER' | 'TEAM' | 'ADMIN'

export interface User {
  id: number
  email: string
  fullName?: string
  firstName?: string
  lastName?: string
  role: UserRole
  phone?: string
  linkedinUrl?: string
  currentRole?: string
  bio?: string
  avatarUrl?: string
  emailVerified?: boolean
  birthDay?: number
  birthMonth?: number
  birthYear?: number
  dateOfBirth?: string
  createdAt?: string
}

export interface LoginCredentials {
  email: string
  password?: string
  otp?: string
}

export interface RegisterData {
  fullName: string
  email: string
  password?: string
  phone?: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  user: User
  message?: string
}
