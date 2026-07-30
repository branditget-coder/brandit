import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography, Button, Container, alpha } from '@mui/material'
import { FiShieldOff, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { brandColors } from '../../theme'

interface ProtectedRouteProps {
  allowedRoles?: Array<'USER' | 'ADMIN' | 'TEAM'>
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // 1. Show sleek loading screen while verifying token/session
  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: brandColors.background }}>
        <CircularProgress size={44} sx={{ color: brandColors.primary, mb: 2 }} />
        <Typography variant="body2" sx={{ color: brandColors.muted, fontWeight: 600 }}>
          Authenticating secure session...
        </Typography>
      </Box>
    )
  }

  // 2. Unauthenticated -> Redirect to Login with requested location
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 3. Role-Based Access Control (RBAC) verification
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const defaultRoute = user.role === 'ADMIN' ? '/admin' : user.role === 'TEAM' ? '/team' : '/dashboard'
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: brandColors.background, py: 8 }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', p: { xs: 4, sm: 6 }, borderRadius: '28px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', boxShadow: '0 12px 36px rgba(0,0,0,0.04)' }}>
            <Box sx={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: alpha('#EF4444', 0.1), color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <FiShieldOff size={36} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: brandColors.text }}>
              403 Access Denied
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, mb: 4, lineHeight: 1.6 }}>
              You do not have permissions to view this portal. Your current role is <strong>{user.role}</strong>.
            </Typography>
            <Button
              variant="contained"
              startIcon={<FiArrowLeft />}
              onClick={() => window.location.href = defaultRoute}
              sx={{ py: 1.4, px: 4, borderRadius: '12px', fontWeight: 700, textTransform: 'none', backgroundColor: brandColors.primary }}
            >
              Return to Authorized Portal
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  // Authorized -> Render child routes
  return <Outlet />
}

// Guard to prevent logged-in users from viewing Login/Register pages
export function PublicOnlyRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated && user) {
    const defaultRoute = user.role === 'ADMIN' ? '/admin' : user.role === 'TEAM' ? '/team' : '/dashboard'
    return <Navigate to={defaultRoute} replace />
  }

  return <Outlet />
}
