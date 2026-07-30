import { useState } from 'react'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Avatar, Divider, IconButton, Chip,
  useMediaQuery, useTheme, alpha, Toolbar, AppBar, Container
} from '@mui/material'
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  FiHome, FiCalendar, FiFileText, FiUser, FiBookOpen,
  FiMenu, FiX, FiLogOut, FiBell, FiSettings
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../common/BrandLogo'

const DRAWER_WIDTH = 260

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: FiHome },
  { label: 'My Bookings', href: '/dashboard/bookings', icon: FiCalendar },
  { label: 'Invoices', href: '/dashboard/invoices', icon: FiFileText },
  { label: 'Resume Builder', href: '/dashboard/resume-builder', icon: FiBookOpen },
  { label: 'Profile', href: '/dashboard/profile', icon: FiUser },
]

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, logout } = useAuth()

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Professional'
  const userInitials = user ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}` : 'P'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const DrawerContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <BrandLogo variant="dark" size="small" />
      </Box>

      <Divider sx={{ mx: 2, borderColor: brandColors.border }} />

      {/* Nav */}
      <List sx={{ px: 1.5, pt: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.href
          return (
            <ListItem disablePadding key={item.label} sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.href}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: '12px',
                  px: 2,
                  py: 1.25,
                  backgroundColor: active ? alpha(brandColors.primary, 0.1) : 'transparent',
                  color: active ? brandColors.primary : brandColors.muted,
                  '&:hover': {
                    backgroundColor: alpha(brandColors.primary, 0.07),
                    color: brandColors.primary,
                  },
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

      {/* User card */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
            borderRadius: '12px', backgroundColor: brandColors.background,
            border: `1px solid ${brandColors.border}`,
          }}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: brandColors.primary, fontSize: '0.875rem', fontWeight: 700 }}>
            {userInitials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, fontSize: '0.8rem' }} noWrap>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ color: brandColors.muted, fontSize: '0.7rem' }}>
              {user?.role === 'ADMIN' ? 'Admin' : 'Member'}
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
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            borderRight: `1px solid ${brandColors.border}`,
            backgroundColor: '#fff',
          },
        }}
      >
        <DrawerContent />
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <DrawerContent />
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {/* Top Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: alpha('#fff', 0.85),
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${brandColors.border}`,
            color: brandColors.text,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
            <IconButton
              sx={{ display: { md: 'none' } }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </IconButton>
            <Box />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" aria-label="Notifications">
                <FiBell size={18} color={brandColors.muted} />
              </IconButton>
              <IconButton size="small" aria-label="Settings">
                <FiSettings size={18} color={brandColors.muted} />
              </IconButton>
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
