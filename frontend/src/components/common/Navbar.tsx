import { useState, useEffect } from 'react'
import {
  AppBar, Toolbar, Container, Box, Button, IconButton,
  Drawer, List, ListItem, useScrollTrigger, alpha
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiUser } from 'react-icons/fi'
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
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 20 })

  useEffect(() => { setMobileOpen(false) }, [location])

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: trigger
            ? alpha('#fff', 0.85)
            : 'transparent',
          backdropFilter: trigger ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: trigger ? `1px solid ${brandColors.border}` : '1px solid transparent',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          color: brandColors.text,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: { xs: 64, md: 72 }, justifyContent: 'space-between' }}>
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <BrandLogo variant="dark" size="medium" />
            </motion.div>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {navLinks.map((link) => {
                const active = location.pathname === link.href
                return (
                  <Button
                    key={link.label}
                    component={RouterLink}
                    to={link.href}
                    sx={{
                      color: active ? brandColors.primary : brandColors.text,
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 1,
                      borderRadius: '10px',
                      backgroundColor: active ? alpha(brandColors.primary, 0.08) : 'transparent',
                      '&:hover': {
                        backgroundColor: alpha(brandColors.primary, 0.06),
                        color: brandColors.primary,
                        transform: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                )
              })}
            </Box>

            {/* CTA Buttons */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Button
                component={RouterLink}
                to="/login"
                startIcon={<FiUser size={16} />}
                sx={{
                  color: brandColors.text,
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: alpha(brandColors.primary, 0.06), boxShadow: 'none', transform: 'none' },
                }}
              >
                Sign In
              </Button>
              <Button
                component={RouterLink}
                to="/book"
                variant="contained"
                size="medium"
                sx={{ px: 2.5 }}
              >
                Get Started
              </Button>
            </Box>

            {/* Mobile Menu Toggle */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, color: brandColors.text }}
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Offset for fixed navbar */}
      <Toolbar sx={{ height: { xs: 64, md: 72 } }} />

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '85vw', sm: 320 },
            backgroundColor: '#fff',
            p: { xs: 2.5, sm: 3 },
            borderRadius: '20px 0 0 20px',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box
            component="span"
            sx={{ fontWeight: 800, fontSize: '1.25rem', color: brandColors.text, letterSpacing: '-0.03em' }}
          >
            BrandIt
          </Box>
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <FiX size={20} />
          </IconButton>
        </Box>

        <List disablePadding>
          {navLinks.map((link) => (
            <ListItem key={link.label} disablePadding sx={{ mb: 0.5 }}>
              <Button
                component={RouterLink}
                to={link.href}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.25,
                  borderRadius: '12px',
                  color: brandColors.text,
                  fontWeight: 500,
                  fontSize: '1rem',
                  '&:hover': { backgroundColor: alpha(brandColors.primary, 0.06), boxShadow: 'none', transform: 'none' },
                }}
              >
                {link.label}
              </Button>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            fullWidth
            size="large"
          >
            Sign In
          </Button>
          <Button
            component={RouterLink}
            to="/book"
            variant="contained"
            fullWidth
            size="large"
          >
            Get Started
          </Button>
        </Box>
      </Drawer>
    </>
  )
}
