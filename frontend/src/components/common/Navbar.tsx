import { useState, useEffect } from 'react'
import {
  AppBar, Toolbar, Container, Box, Button, IconButton,
  Drawer, List, ListItem, useScrollTrigger, alpha
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiUser, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { brandColors } from '../../theme'
import BrandLogo from './BrandLogo'

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blogs & Guides', href: '/blogs' },
  { label: 'About & Team', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 15 })

  useEffect(() => { setMobileOpen(false) }, [location])

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          top: { xs: 0, sm: 12 },
          px: { xs: 0, sm: 2, md: 3 },
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, sm: 0 } }}>
          <Box
            sx={{
              mx: { xs: 0, sm: 'auto' },
              px: { xs: 2.5, sm: 3, md: 3.5 },
              py: { xs: 1, sm: 1.2 },
              borderRadius: { xs: '0 0 20px 20px', sm: '24px' },
              // Apple iOS Glassmorphic Translucency & Blur
              backgroundColor: trigger
                ? 'rgba(255, 255, 255, 0.82)'
                : 'rgba(255, 255, 255, 0.68)',
              backdropFilter: 'blur(24px) saturate(190%)',
              WebkitBackdropFilter: 'blur(24px) saturate(190%)',
              border: trigger
                ? '1px solid rgba(226, 232, 240, 0.8)'
                : '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow: trigger
                ? '0 12px 36px -6px rgba(15, 23, 42, 0.08), 0 0 1px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                : '0 8px 30px -4px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <Toolbar disableGutters sx={{ minHeight: { xs: 52, md: 56 }, justifyContent: 'space-between' }}>
              {/* Logo */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <BrandLogo variant="dark" size="medium" />
                </RouterLink>
              </motion.div>

              {/* Desktop Nav Links */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.75 }}>
                {navLinks.map((link) => {
                  const active = location.pathname === link.href
                  return (
                    <motion.div key={link.label} whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}>
                      <Button
                        component={RouterLink}
                        to={link.href}
                        sx={{
                          color: active ? brandColors.primary : '#334155',
                          fontWeight: active ? 700 : 500,
                          fontSize: '0.875rem',
                          px: 2,
                          py: 0.85,
                          borderRadius: '14px',
                          backgroundColor: active ? alpha(brandColors.primary, 0.09) : 'transparent',
                          border: active ? `1px solid ${alpha(brandColors.primary, 0.2)}` : '1px solid transparent',
                          transition: 'all 0.25s ease',
                          '&:hover': {
                            backgroundColor: alpha(brandColors.primary, 0.06),
                            color: brandColors.primary,
                            borderColor: alpha(brandColors.primary, 0.12),
                          },
                        }}
                      >
                        {link.label}
                      </Button>
                    </motion.div>
                  )
                })}
              </Box>

              {/* CTA Buttons */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.25 }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    startIcon={<FiUser size={15} />}
                    sx={{
                      color: '#475569',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      px: 2,
                      py: 0.85,
                      borderRadius: '14px',
                      backgroundColor: 'rgba(241, 245, 249, 0.6)',
                      border: '1px solid rgba(203, 213, 225, 0.5)',
                      backdropFilter: 'blur(8px)',
                      '&:hover': {
                        backgroundColor: 'rgba(241, 245, 249, 0.9)',
                        color: brandColors.text,
                        borderColor: 'rgba(148, 163, 184, 0.5)',
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
                    endIcon={<FiArrowRight size={15} />}
                    sx={{
                      px: 2.75,
                      py: 0.9,
                      borderRadius: '14px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      backgroundColor: brandColors.primary,
                      backgroundImage: `linear-gradient(135deg, ${brandColors.primary} 0%, #084e96 100%)`,
                      boxShadow: '0 6px 20px rgba(10, 102, 194, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
                      '&:hover': {
                        backgroundImage: `linear-gradient(135deg, #0958a8 0%, #063c75 100%)`,
                        boxShadow: '0 8px 24px rgba(10, 102, 194, 0.42)',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </Box>

              {/* Mobile Menu Toggle */}
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  display: { md: 'none' },
                  color: brandColors.text,
                  backgroundColor: 'rgba(241, 245, 249, 0.7)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '12px',
                  p: 1,
                  border: '1px solid rgba(203, 213, 225, 0.6)',
                }}
                aria-label="Open menu"
              >
                <FiMenu size={22} />
              </IconButton>
            </Toolbar>
          </Box>
        </Container>
      </AppBar>

      {/* Offset for fixed floating glass navbar */}
      <Toolbar sx={{ height: { xs: 68, sm: 84 } }} />

      {/* Mobile Glassmorphic Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '85vw', sm: 340 },
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            p: { xs: 3, sm: 3.5 },
            borderLeft: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '-12px 0 40px rgba(15, 23, 42, 0.12)',
            borderRadius: '24px 0 0 24px',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <BrandLogo variant="dark" size="small" />
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
            const active = location.pathname === link.href
            return (
              <ListItem key={link.label} disablePadding sx={{ mb: 1 }}>
                <Button
                  component={RouterLink}
                  to={link.href}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2.2,
                    py: 1.4,
                    borderRadius: '14px',
                    color: active ? brandColors.primary : brandColors.text,
                    fontWeight: active ? 700 : 500,
                    fontSize: '1rem',
                    backgroundColor: active ? alpha(brandColors.primary, 0.08) : 'rgba(255, 255, 255, 0.5)',
                    border: active ? `1px solid ${alpha(brandColors.primary, 0.2)}` : '1px solid rgba(226, 232, 240, 0.6)',
                    '&:hover': {
                      backgroundColor: alpha(brandColors.primary, 0.06),
                      color: brandColors.primary,
                    },
                  }}
                >
                  {link.label}
                </Button>
              </ListItem>
            )
          })}
        </List>

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
              borderRadius: '14px',
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
              borderRadius: '14px',
              fontWeight: 700,
              backgroundColor: brandColors.primary,
              backgroundImage: `linear-gradient(135deg, ${brandColors.primary} 0%, #084e96 100%)`,
              boxShadow: '0 6px 20px rgba(10, 102, 194, 0.35)',
            }}
          >
            Get Started
          </Button>
        </Box>
      </Drawer>
    </>
  )
}
