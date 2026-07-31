import { useState } from 'react'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Avatar, Divider, IconButton, Chip,
  useMediaQuery, useTheme, alpha, AppBar, Toolbar, Menu, MenuItem,
  Popover, Badge, Stack, Button
} from '@mui/material'
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  FiHome, FiCalendar, FiFileText, FiUser,
  FiMenu, FiLogOut, FiBell, FiSettings, FiCheck, FiLock, FiChevronRight
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../common/BrandLogo'

const DRAWER_WIDTH = 260

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: FiHome },
  { label: 'My Bookings', href: '/dashboard/bookings', icon: FiCalendar },
  { label: 'Invoices', href: '/dashboard/invoices', icon: FiFileText },
  { label: 'Profile', href: '/dashboard/profile', icon: FiUser },
]

interface NotificationItem {
  id: string
  title: string
  desc: string
  time: string
  read: boolean
  link?: string
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, logout } = useAuth()

  // State for Notifications & Settings Popovers
  const [notifAnchor, setNotifAnchor] = useState<HTMLElement | null>(null)
  const [settingsAnchor, setSettingsAnchor] = useState<HTMLElement | null>(null)

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Welcome to BrandIt Portal! 🎉',
      desc: 'Your personal branding dashboard is ready. Explore consultation slots & invoices.',
      time: '2 hours ago',
      read: false,
      link: '/dashboard'
    },
    {
      id: '2',
      title: 'Real-time Slot Blocking Active 🔒',
      desc: 'Consultation dates and time slots are updated in real-time across all users.',
      time: '1 day ago',
      link: '/dashboard/bookings',
      read: false
    },
    {
      id: '3',
      title: 'Security & Profile Settings 🛡️',
      desc: 'You can update your avatar, phone number, and password anytime in your Profile.',
      time: '2 days ago',
      link: '/dashboard/profile',
      read: true
    }
  ])

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Professional'
  const userInitials = user ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}` : 'P'
  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleNotificationClick = (link?: string) => {
    setNotifAnchor(null)
    if (link) {
      navigate(link)
    }
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
          <Avatar src={user?.avatarUrl} sx={{ width: 36, height: 36, bgcolor: brandColors.primary, fontSize: '0.875rem', fontWeight: 700, '& img': { objectFit: 'cover' } }}>
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
            
            {/* Header Right Actions: Bell & Settings */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              
              {/* NOTIFICATION BELL BUTTON */}
              <IconButton
                size="small"
                aria-label="Notifications"
                onClick={(e) => setNotifAnchor(e.currentTarget)}
                sx={{
                  p: 1,
                  borderRadius: '10px',
                  backgroundColor: Boolean(notifAnchor) ? alpha(brandColors.primary, 0.1) : 'transparent',
                  '&:hover': { backgroundColor: alpha(brandColors.primary, 0.08) }
                }}
              >
                <Badge color="error" variant="dot" invisible={unreadCount === 0}>
                  <FiBell size={18} color={Boolean(notifAnchor) ? brandColors.primary : brandColors.muted} />
                </Badge>
              </IconButton>

              {/* SETTINGS GEAR BUTTON */}
              <IconButton
                size="small"
                aria-label="Settings"
                onClick={(e) => setSettingsAnchor(e.currentTarget)}
                sx={{
                  p: 1,
                  borderRadius: '10px',
                  backgroundColor: Boolean(settingsAnchor) ? alpha(brandColors.primary, 0.1) : 'transparent',
                  '&:hover': { backgroundColor: alpha(brandColors.primary, 0.08) }
                }}
              >
                <FiSettings size={18} color={Boolean(settingsAnchor) ? brandColors.primary : brandColors.muted} />
              </IconButton>

            </Box>
          </Toolbar>
        </AppBar>

        {/* NOTIFICATIONS POPOVER MENU */}
        <Popover
          open={Boolean(notifAnchor)}
          anchorEl={notifAnchor}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              width: { xs: 320, sm: 360 },
              borderRadius: '16px',
              mt: 1.5,
              p: 0,
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              border: `1px solid ${brandColors.border}`,
              overflow: 'hidden'
            }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderBottom: `1px solid ${brandColors.border}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text }}>Notifications</Typography>
              {unreadCount > 0 && (
                <Chip label={`${unreadCount} New`} size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
              )}
            </Box>
            {unreadCount > 0 && (
              <Button size="small" onClick={handleMarkAllRead} startIcon={<FiCheck size={12} />} sx={{ fontSize: '0.75rem', textTransform: 'none', fontWeight: 600 }}>
                Mark all read
              </Button>
            )}
          </Box>

          <Stack spacing={0} sx={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.map(n => (
              <Box
                key={n.id}
                onClick={() => handleNotificationClick(n.link)}
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${brandColors.border}`,
                  cursor: 'pointer',
                  backgroundColor: n.read ? '#fff' : alpha(brandColors.primary, 0.03),
                  '&:hover': { backgroundColor: alpha(brandColors.primary, 0.06) },
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  gap: 1.5
                }}
              >
                {!n.read && (
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: brandColors.primary, mt: 0.8, flexShrink: 0 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: n.read ? 600 : 700, color: brandColors.text, fontSize: '0.825rem' }}>
                    {n.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mt: 0.5, lineHeight: 1.4 }}>
                    {n.desc}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', mt: 0.8, display: 'block' }}>
                    {n.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          <Box sx={{ p: 1.5, textAlign: 'center', backgroundColor: '#F8FAFC', borderTop: `1px solid ${brandColors.border}` }}>
            <Button size="small" fullWidth onClick={() => { setNotifAnchor(null); navigate('/dashboard/bookings'); }} sx={{ fontSize: '0.8rem', textTransform: 'none', fontWeight: 700 }}>
              View Consultation Bookings &rarr;
            </Button>
          </Box>
        </Popover>

        {/* SETTINGS MENU */}
        <Menu
          anchorEl={settingsAnchor}
          open={Boolean(settingsAnchor)}
          onClose={() => setSettingsAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              width: 240,
              borderRadius: '16px',
              mt: 1.5,
              p: 1,
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              border: `1px solid ${brandColors.border}`
            }
          }}
        >
          <Box sx={{ px: 1.5, py: 1 }}>
            <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 700, letterSpacing: '0.05em' }}>
              SETTINGS & PREFERENCES
            </Typography>
          </Box>

          <MenuItem
            onClick={() => { setSettingsAnchor(null); navigate('/dashboard/profile'); }}
            sx={{ borderRadius: '10px', py: 1, px: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: brandColors.primary }}>
              <FiUser size={16} />
            </ListItemIcon>
            <ListItemText primary="Edit Profile & Details" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>

          <MenuItem
            onClick={() => { setSettingsAnchor(null); navigate('/dashboard/profile'); }}
            sx={{ borderRadius: '10px', py: 1, px: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: brandColors.primary }}>
              <FiLock size={16} />
            </ListItemIcon>
            <ListItemText primary="Change Password & Security" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>

          <MenuItem
            onClick={() => { setSettingsAnchor(null); navigate('/dashboard/bookings'); }}
            sx={{ borderRadius: '10px', py: 1, px: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: brandColors.primary }}>
              <FiCalendar size={16} />
            </ListItemIcon>
            <ListItemText primary="Booked Consultations" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>

          <MenuItem
            onClick={() => { setSettingsAnchor(null); navigate('/dashboard/invoices'); }}
            sx={{ borderRadius: '10px', py: 1, px: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: brandColors.primary }}>
              <FiFileText size={16} />
            </ListItemIcon>
            <ListItemText primary="Invoices & Statements" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>

          <Divider sx={{ my: 1, borderColor: brandColors.border }} />

          <MenuItem
            onClick={() => { setSettingsAnchor(null); handleLogout(); }}
            sx={{ borderRadius: '10px', py: 1, px: 1.5, color: '#EF4444' }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: '#EF4444' }}>
              <FiLogOut size={16} />
            </ListItemIcon>
            <ListItemText primary="Log Out Account" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>
        </Menu>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
