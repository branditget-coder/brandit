import { useState, useEffect } from 'react'
import {
  AppBar, Toolbar, Container, Box, Button, IconButton,
  Drawer, List, ListItem, useScrollTrigger, alpha
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiUser, FiArrowRight } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
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
          top: { xs: 0, sm: 14 },
          px: { xs: 0, sm: 2, md: 3 },
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, sm: 0 } }}>
          <Box
            sx={{
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

              {/* Desktop Nav Links with Prominent Readable Text */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.75, position: 'relative' }}>
                {navLinks.map((link) => {
                  const active = location.pathname === link.href
                  return (
                    <Box key={link.label} sx={{ position: 'relative' }}>
                      <Button
                        component={RouterLink}
                        to={link.href}
                        sx={{
                          color: active ? brandColors.primary : '#0F172A',
                          fontWeight: active ? 750 : 600,
                          fontSize: '0.975rem',
                          letterSpacing: '-0.01em',
                          fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                          px: 2.2,
                          py: 0.9,
                          borderRadius: '100px',
                          backgroundColor: active ? alpha(brandColors.primary, 0.09) : 'transparent',
                          border: active ? `1px solid ${alpha(brandColors.primary, 0.2)}` : '1px solid transparent',
                          transition: 'all 0.25s ease',
                          position: 'relative',
                          zIndex: 1,
                          '&:hover': {
                            backgroundColor: alpha(brandColors.primary, 0.07),
                            color: brandColors.primary,
                          },
                        }}
                      >
                        {active && (
                          <Box
                            component="span"
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              backgroundColor: brandColors.primary,
                              mr: 1,
                              display: 'inline-block',
                              boxShadow: `0 0 8px ${brandColors.primary}`,
                            }}
                          />
                        )}
                        {link.label}
                      </Button>
                    </Box>
                  )
                })}
              </Box>

              {/* CTA Buttons */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    startIcon={<FiUser size={16} />}
                    sx={{
                      color: '#0F172A',
                      fontWeight: 700,
                      fontSize: '0.925rem',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      px: 2.5,
                      py: 0.9,
                      borderRadius: '100px',
                      backgroundColor: 'rgba(241, 245, 249, 0.8)',
                      border: '1px solid rgba(203, 213, 225, 0.8)',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(241, 245, 249, 1)',
                        color: brandColors.primary,
                        borderColor: alpha(brandColors.primary, 0.4),
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    component={RouterLink}
                    to="/book"
                    variant="contained"
                    endIcon={<FiArrowRight size={16} />}
                    sx={{
                      px: 3,
                      py: 0.95,
                      borderRadius: '100px',
                      fontWeight: 750,
                      fontSize: '0.95rem',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      textTransform: 'none',
                      backgroundColor: brandColors.primary,
                      backgroundImage: `linear-gradient(135deg, ${brandColors.primary} 0%, #2563EB 100%)`,
                      boxShadow: '0 6px 20px rgba(10, 102, 194, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        backgroundImage: `linear-gradient(135deg, #0850A0 0%, #1D4ED8 100%)`,
                        boxShadow: '0 8px 25px rgba(10, 102, 194, 0.48)',
                        transform: 'translateY(-1px)',
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
                    borderRadius: '100px',
                    color: active ? brandColors.primary : brandColors.text,
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.95rem',
                    fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                    backgroundColor: active ? alpha(brandColors.primary, 0.08) : 'rgba(255, 255, 255, 0.5)',
                    border: active ? `1px solid ${alpha(brandColors.primary, 0.2)}` : '1px solid rgba(226, 232, 240, 0.6)',
                    '&:hover': {
                      backgroundColor: alpha(brandColors.primary, 0.06),
                      color: brandColors.primary,
                    },
                  }}
                >
                  {active && (
                    <Box
                      component="span"
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: brandColors.primary,
                        mr: 1.2,
                        display: 'inline-block',
                      }}
                    />
                  )}
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
      </Drawer>
    </>
  )
}
