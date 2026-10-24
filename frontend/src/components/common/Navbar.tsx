import { useState, useEffect } from 'react'
import {
  AppBar, Toolbar, Container, Box, Button, IconButton,
  Drawer, List, ListItem, useScrollTrigger, alpha,
  Menu, MenuItem, Avatar, Typography, Divider, Chip, Tooltip
} from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  FiMenu, FiX, FiUser, FiArrowRight, FiLogOut,
  FiGrid, FiChevronDown, FiShield, FiCalendar,
  FiBriefcase, FiTag, FiCamera, FiStar, FiBookOpen,
  FiUsers, FiMail
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { brandColors } from '../../theme'
import BrandLogo from './BrandLogo'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { label: 'Services', desktopLabel: 'Services', href: '/services', icon: FiBriefcase },
  { label: 'Pricing', desktopLabel: 'Pricing', href: '/pricing', icon: FiTag },
  { label: 'Our Story', desktopLabel: 'Our Story', href: '/#our-story', icon: FiCamera },
  { label: 'Testimonials', desktopLabel: 'Reviews', href: '/testimonials', icon: FiStar },
  { label: 'Blogs & Guides', desktopLabel: 'Blogs', href: '/blogs', icon: FiBookOpen },
  { label: 'About & Team', desktopLabel: 'About', href: '/about', icon: FiUsers },
  { label: 'Contact', desktopLabel: 'Contact', href: '/contact', icon: FiMail },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 15 })
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuAnchor(null)
  }, [location])

  const isAdmin = Boolean(user && (user.role === 'ADMIN' || user.email === 'raghavdhir1510@gmail.com'))
  const isTeam = Boolean(user && user.role === 'TEAM')

  const dashboardRoute = isAdmin ? '/admin' : isTeam ? '/team' : '/dashboard'
  const dashboardLabel = isAdmin ? 'Admin Panel' : isTeam ? 'Team Workspace' : 'Dashboard'

  const userFullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || 'Account'
    : 'Account'

  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase()
    : (user?.email ? user.email.substring(0, 2).toUpperCase() : 'U')

  const roleLabel = isAdmin ? 'Admin' : isTeam ? 'Team' : 'Client'

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null)
  }

  const handleLogout = () => {
    handleCloseUserMenu()
    logout()
    navigate('/')
  }

  const isLinkActive = (href: string) => {
    if (href.includes('#')) {
      const hash = '#' + href.split('#')[1]
      return location.pathname === '/' && location.hash === hash
    }
    return location.pathname === href
  }

  const handleLinkClick = (href: string) => {
    if (href.includes('#')) {
      const hash = '#' + href.split('#')[1]
      if (location.pathname === '/') {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{
          backgroundColor: 'transparent !important',
          backgroundImage: 'none !important',
          boxShadow: 'none !important',
          border: 'none !important',
          outline: 'none !important',
          backdropFilter: 'none !important',
          WebkitBackdropFilter: 'none !important',
          top: { xs: 0, sm: 14 },
          px: { xs: 0, sm: 2, md: 3 },
          pointerEvents: 'none',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, sm: 0 }, pointerEvents: 'none' }}>
          <Box
            sx={{
              pointerEvents: 'auto',
              mx: { xs: 0, sm: 'auto' },
              px: { xs: 2.5, sm: 3, md: 3.5 },
              py: { xs: 1, sm: 1.1 },
              borderRadius: { xs: '0 0 20px 20px', sm: '100px' },
              // Ultra-Modern Glassmorphic Floating Capsule
              backgroundColor: trigger
                ? 'rgba(255, 255, 255, 0.92)'
                : 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(28px) saturate(200%)',
              WebkitBackdropFilter: 'blur(28px) saturate(200%)',
              border: trigger
                ? `1px solid ${alpha(brandColors.primary, 0.2)}`
                : '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: trigger
                ? '0 16px 40px -10px rgba(10, 102, 194, 0.14), 0 0 1px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
                : '0 10px 30px -5px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <Toolbar disableGutters sx={{ minHeight: { xs: 54, md: 58 }, justifyContent: 'space-between' }}>
              {/* Logo */}
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <BrandLogo variant="dark" size="medium" />
              </motion.div>

              {/* Desktop Nav Links: Responsive Capsule Dock (Adaptive Icons & Labels) */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  gap: { md: 0.4, lg: 0.6 },
                  position: 'relative',
                  backgroundColor: 'rgba(241, 245, 249, 0.5)',
                  p: 0.5,
                  borderRadius: '100px',
                  border: '1px solid rgba(226, 232, 240, 0.7)',
                }}
              >
                {navLinks.map((link) => {
                  const active = isLinkActive(link.href)
                  return (
                    <Box key={link.label} sx={{ position: 'relative' }}>
                      <Tooltip
                        title={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, py: 0.2 }}>
                            <link.icon size={13} />
                            <span>{link.label}</span>
                          </Box>
                        }
                        arrow
                        placement="bottom"
                        slotProps={{
                          tooltip: {
                            sx: {
                              bgcolor: '#0F172A',
                              color: '#FFFFFF',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                              display: { xs: 'none', md: 'block', xl: 'none' },
                            },
                          },
                          arrow: {
                            sx: {
                              color: '#0F172A',
                              display: { xs: 'none', md: 'block', xl: 'none' },
                            },
                          },
                        }}
                      >
                        <Button
                          component={RouterLink}
                          to={link.href}
                          onClick={() => handleLinkClick(link.href)}
                          sx={{
                            color: active ? brandColors.primary : '#334155',
                            fontWeight: active ? 750 : 600,
                            fontSize: { md: '0.82rem', lg: '0.88rem' },
                            letterSpacing: '-0.01em',
                            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                            px: { md: active ? 1.2 : 0.85, lg: 1.15, xl: 1.5 },
                            py: 0.6,
                            minWidth: { md: active ? 'auto' : 34, lg: 'auto' },
                            height: 35,
                            borderRadius: '100px',
                            backgroundColor: active ? '#FFFFFF' : 'transparent',
                            boxShadow: active ? '0 2px 8px rgba(10, 102, 194, 0.12)' : 'none',
                            border: active ? `1px solid ${alpha(brandColors.primary, 0.22)}` : '1px solid transparent',
                            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative',
                            zIndex: 1,
                            textTransform: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: { md: 0.5, lg: 0.65 },
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              backgroundColor: active ? '#FFFFFF' : alpha(brandColors.primary, 0.08),
                              color: brandColors.primary,
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          <link.icon
                            size={15}
                            style={{
                              flexShrink: 0,
                              color: active ? brandColors.primary : 'inherit',
                            }}
                          />
                          {/* Label visible: On lg/xl always; on md only if active */}
                          <Box
                            component="span"
                            sx={{
                              display: {
                                xs: 'none',
                                md: active ? 'inline' : 'none',
                                lg: 'inline',
                              },
                            }}
                          >
                            {link.desktopLabel}
                          </Box>
                        </Button>
                      </Tooltip>
                    </Box>
                  )
                })}
              </Box>

              {/* CTA Buttons */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.8, flexShrink: 0 }}>
                {isAuthenticated && user ? (
                  <>
                    {/* Dashboard Shortcut Button */}
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                      <Button
                        component={RouterLink}
                        to={dashboardRoute}
                        startIcon={isAdmin ? <FiShield size={15} /> : <FiGrid size={15} />}
                        sx={{
                          color: brandColors.primary,
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          px: 2,
                          py: 0.85,
                          borderRadius: '100px',
                          backgroundColor: alpha(brandColors.primary, 0.08),
                          border: `1px solid ${alpha(brandColors.primary, 0.25)}`,
                          textTransform: 'none',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: alpha(brandColors.primary, 0.16),
                            borderColor: brandColors.primary,
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {dashboardLabel}
                      </Button>
                    </motion.div>

                    {/* Logged In Account Capsule Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleOpenUserMenu}
                        aria-controls={Boolean(userMenuAnchor) ? 'nav-user-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={Boolean(userMenuAnchor) ? 'true' : undefined}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.2,
                          pl: 0.8,
                          pr: 1.6,
                          py: 0.55,
                          borderRadius: '100px',
                          backgroundColor: '#fff',
                          border: `1px solid ${alpha('#CBD5E1', 0.9)}`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          textTransform: 'none',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#F8FAFC',
                            borderColor: alpha(brandColors.primary, 0.4),
                            boxShadow: '0 4px 14px rgba(10,102,194,0.1)',
                          },
                        }}
                      >
                        <Avatar
                          src={user.avatarUrl}
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: isAdmin ? '#0A66C2' : isTeam ? '#7C3AED' : '#2563EB',
                            color: '#fff',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            border: '1.5px solid #fff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          }}
                        >
                          {userInitials}
                        </Avatar>

                        <Box sx={{ textAlign: 'left', lineHeight: 1.15 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: '#0F172A',
                              fontSize: '0.85rem',
                              maxWidth: 120,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {user.firstName || 'Account'}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: isAdmin ? brandColors.primary : brandColors.muted,
                              fontSize: '0.66rem',
                              fontWeight: 700,
                              letterSpacing: '0.02em',
                              display: 'block',
                            }}
                          >
                            {roleLabel}
                          </Typography>
                        </Box>

                        <FiChevronDown
                          size={14}
                          color="#64748B"
                          style={{
                            transform: Boolean(userMenuAnchor) ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                            marginLeft: 2,
                          }}
                        />
                      </Button>
                    </motion.div>

                    {/* Quick Direct Logout Button */}
                    <Tooltip title="Log Out" arrow>
                      <IconButton
                        onClick={handleLogout}
                        size="small"
                        aria-label="Log Out"
                        sx={{
                          p: 1,
                          color: '#64748B',
                          backgroundColor: 'rgba(241, 245, 249, 0.8)',
                          border: '1px solid rgba(203, 213, 225, 0.8)',
                          borderRadius: '50%',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            borderColor: alpha('#EF4444', 0.4),
                          },
                        }}
                      >
                        <FiLogOut size={16} />
                      </IconButton>
                    </Tooltip>

                    {/* Dropdown Menu */}
                    <Menu
                      id="nav-user-menu"
                      anchorEl={userMenuAnchor}
                      open={Boolean(userMenuAnchor)}
                      onClose={handleCloseUserMenu}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          mt: 1.5,
                          minWidth: 230,
                          p: 1,
                          borderRadius: '18px',
                          border: '1px solid rgba(226, 232, 240, 0.9)',
                          backgroundColor: 'rgba(255, 255, 255, 0.97)',
                          backdropFilter: 'blur(20px)',
                          boxShadow: '0 16px 36px -6px rgba(15, 23, 42, 0.12), 0 0 1px rgba(15, 23, 42, 0.1)',
                          '& .MuiMenuItem-root': {
                            borderRadius: '10px',
                            px: 1.5,
                            py: 1.1,
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            color: '#1E293B',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.3,
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              backgroundColor: alpha(brandColors.primary, 0.08),
                              color: brandColors.primary,
                            },
                          },
                        },
                      }}
                    >
                      {/* User Header */}
                      <Box sx={{ px: 1.5, py: 1.2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>
                          {userFullName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.74rem', mt: 0.2, wordBreak: 'break-all' }}>
                          {user.email}
                        </Typography>
                        <Chip
                          label={roleLabel.toUpperCase()}
                          size="small"
                          sx={{
                            mt: 1,
                            height: 20,
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            backgroundColor: isAdmin ? alpha(brandColors.primary, 0.1) : '#EEF2FF',
                            color: isAdmin ? brandColors.primary : '#4338CA',
                            border: `1px solid ${isAdmin ? alpha(brandColors.primary, 0.2) : '#C7D2FE'}`,
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 0.8, borderColor: '#F1F5F9' }} />

                      <MenuItem
                        component={RouterLink}
                        to={dashboardRoute}
                        onClick={handleCloseUserMenu}
                      >
                        {isAdmin ? <FiShield size={16} /> : <FiGrid size={16} />}
                        {dashboardLabel}
                      </MenuItem>

                      <MenuItem
                        component={RouterLink}
                        to={isAdmin ? '/admin' : '/dashboard/profile'}
                        onClick={handleCloseUserMenu}
                      >
                        <FiUser size={16} />
                        Profile Settings
                      </MenuItem>

                      {!isAdmin && !isTeam && (
                        <MenuItem
                          component={RouterLink}
                          to="/dashboard/bookings"
                          onClick={handleCloseUserMenu}
                        >
                          <FiCalendar size={16} />
                          My Bookings
                        </MenuItem>
                      )}

                      <Divider sx={{ my: 0.8, borderColor: '#F1F5F9' }} />

                      <MenuItem
                        onClick={handleLogout}
                        sx={{
                          color: '#EF4444 !important',
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.08) !important',
                            color: '#DC2626 !important',
                          },
                        }}
                      >
                        <FiLogOut size={16} color="#EF4444" />
                        Log Out
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        component={RouterLink}
                        to="/login"
                        sx={{
                          color: '#334155',
                          fontWeight: 650,
                          fontSize: '0.86rem',
                          fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                          px: { md: 1.3, lg: 1.7 },
                          py: 0.6,
                          height: 35,
                          borderRadius: '100px',
                          textTransform: 'none',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: alpha(brandColors.primary, 0.08),
                            color: brandColors.primary,
                          },
                        }}
                      >
                        Sign In
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        component={RouterLink}
                        to="/book"
                        variant="contained"
                        endIcon={<FiArrowRight size={14} />}
                        sx={{
                          px: { md: 1.8, lg: 2.2 },
                          py: 0.6,
                          height: 35,
                          borderRadius: '100px',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                          textTransform: 'none',
                          whiteSpace: 'nowrap',
                          backgroundColor: brandColors.primary,
                          backgroundImage: `linear-gradient(135deg, ${brandColors.primary} 0%, #2563EB 100%)`,
                          boxShadow: '0 3px 12px rgba(10, 102, 194, 0.28)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundImage: `linear-gradient(135deg, #0850A0 0%, #1D4ED8 100%)`,
                            boxShadow: '0 5px 16px rgba(10, 102, 194, 0.38)',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        Get Started
                      </Button>
                    </motion.div>
                  </>
                )}
              </Box>

              {/* Mobile Menu Toggle */}
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  display: { md: 'none' },
                  color: brandColors.text,
                  backgroundColor: 'rgba(241, 245, 249, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '100px',
                  p: 1,
                  border: '1px solid rgba(203, 213, 225, 0.7)',
                }}
                aria-label="Open menu"
              >
                <FiMenu size={20} />
              </IconButton>
            </Toolbar>
          </Box>
        </Container>
      </AppBar>

      {/* Offset for fixed floating glass navbar */}
      <Toolbar sx={{ height: { xs: 72, sm: 84 } }} />

      {/* Mobile Glassmorphic Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '85vw', sm: 340 },
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            p: { xs: 3, sm: 3.5 },
            borderLeft: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '-12px 0 40px rgba(15, 23, 42, 0.12)',
            borderRadius: '24px 0 0 24px',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <BrandLogo variant="dark" size="small" />
          </Box>
          <IconButton
            onClick={() => setMobileOpen(false)}
            size="small"
            sx={{
              backgroundColor: 'rgba(241, 245, 249, 0.8)',
              p: 1,
              borderRadius: '50%',
              border: '1px solid rgba(203, 213, 225, 0.5)',
            }}
          >
            <FiX size={18} />
          </IconButton>
        </Box>

        <List disablePadding>
          {navLinks.map((link) => {
            const active = isLinkActive(link.href)
            return (
              <ListItem key={link.label} disablePadding sx={{ mb: 1 }}>
                <Button
                  component={RouterLink}
                  to={link.href}
                  fullWidth
                  onClick={() => {
                    setMobileOpen(false)
                    handleLinkClick(link.href)
                  }}
                  startIcon={
                    <link.icon
                      size={18}
                      style={{
                        color: active ? brandColors.primary : '#64748B',
                      }}
                    />
                  }
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2.2,
                    py: 1.3,
                    borderRadius: '100px',
                    color: active ? brandColors.primary : brandColors.text,
                    fontWeight: active ? 750 : 550,
                    fontSize: '0.94rem',
                    fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                    backgroundColor: active ? alpha(brandColors.primary, 0.09) : 'rgba(255, 255, 255, 0.6)',
                    border: active ? `1px solid ${alpha(brandColors.primary, 0.25)}` : '1px solid rgba(226, 232, 240, 0.7)',
                    '&:hover': {
                      backgroundColor: alpha(brandColors.primary, 0.08),
                      color: brandColors.primary,
                    },
                  }}
                >
                  <span>{link.label}</span>
                </Button>
              </ListItem>
            )
          })}
        </List>

        {isAuthenticated && user ? (
          <Box sx={{ mt: 3, p: 2, borderRadius: '18px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar
                src={user.avatarUrl}
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: isAdmin ? '#0A66C2' : isTeam ? '#7C3AED' : '#2563EB',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}
              >
                {userInitials}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }} noWrap>
                  {userFullName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.74rem' }} noWrap>
                  {user.email}
                </Typography>
                <Chip
                  label={roleLabel.toUpperCase()}
                  size="small"
                  sx={{
                    mt: 0.5,
                    height: 18,
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    backgroundColor: isAdmin ? alpha(brandColors.primary, 0.1) : '#EEF2FF',
                    color: isAdmin ? brandColors.primary : '#4338CA',
                  }}
                />
              </Box>
            </Box>

            <Button
              component={RouterLink}
              to={dashboardRoute}
              variant="contained"
              fullWidth
              size="large"
              startIcon={isAdmin ? <FiShield size={18} /> : <FiGrid size={18} />}
              onClick={() => setMobileOpen(false)}
              sx={{
                py: 1.3,
                borderRadius: '100px',
                fontWeight: 700,
                backgroundColor: brandColors.primary,
                backgroundImage: `linear-gradient(135deg, ${brandColors.primary} 0%, #2563EB 100%)`,
                boxShadow: '0 4px 14px rgba(10, 102, 194, 0.3)',
                mb: 1.2
              }}
            >
              {dashboardLabel}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              size="medium"
              startIcon={<FiLogOut size={16} />}
              onClick={() => {
                setMobileOpen(false)
                logout()
                navigate('/')
              }}
              sx={{
                py: 1,
                borderRadius: '100px',
                fontWeight: 700,
                borderColor: alpha('#EF4444', 0.4),
                color: '#EF4444',
                '&:hover': {
                  borderColor: '#EF4444',
                  backgroundColor: alpha('#EF4444', 0.06),
                }
              }}
            >
              Log Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<FiUser size={18} />}
              sx={{
                py: 1.3,
                borderRadius: '100px',
                fontWeight: 600,
                borderColor: 'rgba(203, 213, 225, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              Sign In
            </Button>
            <Button
              component={RouterLink}
              to="/book"
              variant="contained"
              fullWidth
              size="large"
              endIcon={<FiArrowRight size={18} />}
              sx={{
                py: 1.4,
                borderRadius: '100px',
                fontWeight: 700,
                backgroundColor: brandColors.primary,
                backgroundImage: `linear-gradient(135deg, ${brandColors.primary} 0%, #2563EB 100%)`,
                boxShadow: '0 6px 20px rgba(10, 102, 194, 0.35)',
              }}
            >
              Get Started
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  )
}
