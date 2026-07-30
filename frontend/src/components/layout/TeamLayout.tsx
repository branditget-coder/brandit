import { useState } from 'react'
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, IconButton, Button, Paper, Divider, Chip, useMediaQuery, useTheme, alpha
} from '@mui/material'
import {
  FiGrid, FiCalendar, FiBookOpen, FiUser, FiLogOut, FiMenu, FiX, FiShield
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../common/BrandLogo'

const DRAWER_WIDTH = 270

const navItems = [
  { label: 'Team Overview', href: '/team', icon: FiGrid },
  { label: 'Client Consultations', href: '/team/consultations', icon: FiCalendar },
  { label: 'Company SOPs & Resources', href: '/team/resources', icon: FiBookOpen },
  { label: 'My Profile & Security', href: '/team/profile', icon: FiUser },
]

export default function TeamLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = `${user?.firstName?.[0] || 'T'}${user?.lastName?.[0] || 'M'}`.toUpperCase()

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2.5 }}>
      {/* Brand & Team Badge */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BrandLogo size="small" />
          <Chip
            label="TEAM"
            size="small"
            sx={{
              backgroundColor: alpha('#8B5CF6', 0.12),
              color: '#7C3AED',
              fontWeight: 800,
              fontSize: '0.7rem',
              letterSpacing: '0.04em',
              height: 22,
            }}
          />
        </Box>
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <FiX size={20} />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 3, borderColor: brandColors.border }} />

      {/* Navigation List */}
      <List disablePadding sx={{ flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to={item.href}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: '14px',
                  py: 1.25,
                  px: 2,
                  backgroundColor: isActive ? alpha(brandColors.primary, 0.08) : 'transparent',
                  color: isActive ? brandColors.primary : brandColors.text,
                  fontWeight: isActive ? 700 : 500,
                  '&:hover': {
                    backgroundColor: alpha(brandColors.primary, 0.05),
                    color: brandColors.primary,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? brandColors.primary : brandColors.muted }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.92rem', fontWeight: isActive ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* User Info & Logout */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '16px',
          border: `1px solid ${brandColors.border}`,
          backgroundColor: alpha(brandColors.primary, 0.03),
          mt: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar
            src={user?.avatarUrl}
            sx={{
              width: 42,
              height: 42,
              bgcolor: alpha('#7C3AED', 0.15),
              color: '#7C3AED',
              fontWeight: 700,
              fontSize: '1rem',
              border: `2px solid ${alpha('#7C3AED', 0.3)}`,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: brandColors.text }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700 }}>
              <FiShield size={10} /> BrandIt Team
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          size="small"
          variant="outlined"
          color="error"
          startIcon={<FiLogOut size={16} />}
          onClick={handleLogout}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.82rem',
            borderColor: alpha('#EF4444', 0.3),
            '&:hover': { borderColor: '#EF4444', backgroundColor: alpha('#EF4444', 0.05) },
          }}
        >
          Sign Out
        </Button>
      </Paper>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: brandColors.background }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <Paper
          square
          elevation={0}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 1.5,
            borderBottom: `1px solid ${brandColors.border}`,
            backgroundColor: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BrandLogo size="small" />
            <Chip label="TEAM" size="small" sx={{ backgroundColor: alpha('#8B5CF6', 0.12), color: '#7C3AED', fontWeight: 800, height: 20, fontSize: '0.65rem' }} />
          </Box>
          <IconButton onClick={() => setMobileOpen(true)} size="medium">
            <FiMenu size={22} />
          </IconButton>
        </Paper>
      )}

      {/* Desktop Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: `1px solid ${brandColors.border}`,
            backgroundColor: '#fff',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Workspace Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 4, md: 5 },
          mt: { xs: 7, md: 0 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          maxWidth: '1280px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
