import { useState, useEffect } from 'react'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Avatar, Divider, IconButton, alpha,
  AppBar, Toolbar, Chip, CircularProgress, Alert
} from '@mui/material'
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiUsers, FiCalendar, FiFileText,
  FiBarChart2, FiMenu, FiLogOut, FiAlertTriangle
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../common/BrandLogo'

const DRAWER_WIDTH = 260

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: FiGrid },
  { label: 'Analytics', href: '/admin/analytics', icon: FiBarChart2 },
  { label: 'Users', href: '/admin/users', icon: FiUsers },
  { label: 'Bookings', href: '/admin/bookings', icon: FiCalendar },
]

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  const isAdmin = user && (user.role === 'ADMIN' || user.email === 'raghavdhir1510@gmail.com')

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true })
      }
    }
  }, [user, isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: brandColors.background }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  if (!isAdmin) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, backgroundColor: brandColors.background }}>
        <Box sx={{ maxWidth: 450, textAlign: 'center', p: 4, borderRadius: '24px', backgroundColor: '#fff', border: `1px solid ${brandColors.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          <FiAlertTriangle size={48} color="#EF4444" style={{ marginBottom: 16 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: brandColors.text }}>Access Denied</Typography>
          <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3, lineHeight: 1.7 }}>
            The Admin Panel is strictly restricted to authorized administrators (Raghav Dhir).
          </Typography>
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', textAlign: 'left' }}>
            Logged in as: {user ? user.email : 'Unauthenticated'} ({user ? user.role : 'Guest'})
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <RouterLink to="/dashboard" style={{ textDecoration: 'none' }}>
              <Chip label="Go to User Dashboard" clickable color="primary" sx={{ px: 2, py: 2.2, fontWeight: 700 }} />
            </RouterLink>
            <Chip label="Sign Out" clickable onClick={() => { logout(); navigate('/login'); }} sx={{ px: 2, py: 2.2, fontWeight: 700 }} />
          </Box>
        </Box>
      </Box>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const DrawerContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <BrandLogo variant="dark" size="small" />
        <Chip label="Official Admin" size="small" sx={{ mt: 1, bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 700, fontSize: '0.7rem' }} />
      </Box>

      <Divider sx={{ mx: 2, borderColor: brandColors.border }} />

      <List sx={{ px: 1.5, pt: 2, flexGrow: 1 }}>
        {adminNav.map((item) => {
          const active = location.pathname === item.href
          return (
            <ListItem disablePadding key={item.label} sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: '12px',
                  px: 2,
                  py: 1.25,
                  backgroundColor: active ? alpha(brandColors.primary, 0.1) : 'transparent',
                  color: active ? brandColors.primary : brandColors.muted,
                  '&:hover': { backgroundColor: alpha(brandColors.primary, 0.07), color: brandColors.primary },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  <item.icon size={18} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ mx: 2, borderColor: brandColors.border }} />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '12px', backgroundColor: brandColors.background, border: `1px solid ${brandColors.border}` }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: brandColors.primary, color: '#fff', fontSize: '0.875rem', fontWeight: 700 }}>RD</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text, fontSize: '0.8rem' }} noWrap>
              {user ? `${user.firstName} ${user.lastName}` : 'Raghav Dhir'}
            </Typography>
            <Typography variant="caption" sx={{ color: brandColors.muted, fontSize: '0.7rem' }} noWrap>
              {user ? user.email : 'raghavdhir1510@gmail.com'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleLogout} aria-label="Log out">
            <FiLogOut size={15} color={brandColors.muted} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: brandColors.background }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none', borderRight: `1px solid ${brandColors.border}`, backgroundColor: '#fff' },
        }}
      >
        <DrawerContent />
      </Drawer>

      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
        <DrawerContent />
      </Drawer>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: alpha('#fff', 0.85), backdropFilter: 'blur(20px)', borderBottom: `1px solid ${brandColors.border}`, color: brandColors.text }}>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
            <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <FiMenu size={20} />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="Admin Portal" color="primary" size="small" sx={{ fontWeight: 700 }} />
              <Typography variant="caption" sx={{ color: brandColors.muted }}>
                Authorized for {user?.email}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
