import { Box, Container, Typography, Button, Stack, Grid, alpha } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCheckCircle, FiTrendingUp, FiTarget, FiUsers } from 'react-icons/fi'
import { brandColors } from '../../theme'

import LiveVisitorBadge from '../common/LiveVisitorBadge'

const featurePillars = [
  { icon: <FiTrendingUp size={22} color={brandColors.primary} />, title: 'Profile Setup & Advice', desc: 'Complete structural overhaul & growth blueprint — ₹99' },
  { icon: <FiTarget size={22} color={brandColors.primary} />, title: 'Personal Branding', desc: '8 strategy-backed posts/month publishing — ₹320/mo' },
  { icon: <FiUsers size={22} color={brandColors.primary} />, title: 'Outreach & Growth Engine', desc: '8 posts/mo + cold messaging & follow-ups — ₹400/mo' },
]

const highlights = [
  '₹99 One-Time Setup',
  '8 Strategy Posts / month',
  'Cold Outreach & Growth Engine',
  '1-on-1 LinkedIn Advisory',
]

const floatingCards = [
  { title: 'Profile Setup + Advice', value: '₹99 (One-Time)', icon: '🚀', color: '#EFF6FF', border: brandColors.primary },
  { title: 'Personal Branding', value: '8 Posts/mo — ₹320/mo', icon: '📝', color: '#F0FDF4', border: '#22C55E' },
  { title: 'Network Outreach Engine', value: 'Outreach & Follow-ups — ₹400/mo', icon: '⚡', color: '#FFF7ED', border: '#F59E0B' },
]

export default function HeroSection() {
  return (
    <Box
      sx={{
        pt: { xs: 10, sm: 12, md: 14 },
        pb: { xs: 8, sm: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: brandColors.background,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${alpha(brandColors.primary, 0.07)} 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, ${alpha(brandColors.secondary, 0.04)} 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            {/* Pill Badge & Live Visitor Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: 3, gap: 1 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 1, sm: 1.25 },
                    fontSize: { xs: '0.775rem', sm: '0.85rem' },
                    fontWeight: 700,
                    backgroundColor: alpha(brandColors.primary, 0.08),
                    color: brandColors.primary,
                    border: `1px solid ${alpha(brandColors.primary, 0.2)}`,
                    borderRadius: '100px',
                    maxWidth: '100%',
                    lineHeight: 1.45,
                    boxShadow: `0 2px 12px ${alpha(brandColors.primary, 0.06)}`,
                    wordBreak: 'break-word',
                    textAlign: 'left',
                  }}
                >
                  ⚡ Your Profile, Your Brand, Your Opportunity — Plans From ₹99
                </Box>
                <LiveVisitorBadge variant="full" />
              </Stack>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography
                variant="h1"
                sx={{
                  mb: 3,
                  fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.5rem' },
                  lineHeight: { xs: 1.15, md: 1.1 },
                  letterSpacing: '-0.03em',
                }}
              >
                Build Your Personal Brand &{' '}
                <Box
                  component="span"
                  sx={{
                    color: brandColors.primary,
                  }}
                >
                  Network Engine.
                </Box>
              </Typography>
            </motion.div>

            {/* Subheading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: brandColors.muted,
                  mb: 4,
                  maxWidth: 520,
                  lineHeight: 1.7,
                  fontSize: { xs: '0.95rem', sm: '1.05rem' },
                }}
              >
                From profile setup to 8 monthly strategy posts and active cold outreach campaigns. Clear, accessible packages built to turn your LinkedIn profile into opportunities.
              </Typography>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 4 }}>
                {highlights.map((h) => (
                  <Box key={h} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <FiCheckCircle size={15} color={brandColors.success} />
                    <Typography variant="body2" sx={{ color: brandColors.muted, fontWeight: 500, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>{h}</Typography>
                  </Box>
                ))}
              </Stack>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                <Button
                  component={RouterLink}
                  to="/book"
                  variant="contained"
                  size="large"
                  endIcon={<FiArrowRight />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    width: { xs: '100%', sm: 'auto' },
                    minHeight: 48,
                    fontSize: '0.95rem',
                  }}
                >
                  Choose Your Package
                </Button>
                <Button
                  component={RouterLink}
                  to="/pricing"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    width: { xs: '100%', sm: 'auto' },
                    minHeight: 48,
                    fontSize: '0.95rem',
                  }}
                >
                  View Pricing Breakdown
                </Button>
              </Stack>
            </motion.div>

            {/* Core Feature Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Grid container spacing={2} sx={{ mt: 4 }}>
                {featurePillars.map((p) => (
                  <Grid item xs={12} sm={4} key={p.title}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '14px',
                        border: `1px solid ${brandColors.border}`,
                        backgroundColor: '#fff',
                        height: '100%',
                      }}
                    >
                      <Box sx={{ mb: 1 }}>{p.icon}</Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem', color: brandColors.text, mb: 0.25 }}>
                        {p.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted, lineHeight: 1.4, display: 'block' }}>
                        {p.desc}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Right: Floating Cards */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', height: { xs: 300, sm: 380, md: 480 }, mt: { xs: 2, md: 0 } }}>
              {floatingCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top: i === 0 ? '5%' : i === 1 ? '38%' : '70%',
                    left: i === 1 ? '10%' : '5%',
                    right: i === 0 ? '5%' : i === 2 ? '5%' : '10%',
                    zIndex: 3 - i,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, i % 2 === 0 ? -5 : 5, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                  >
                    <Box
                      sx={{
                        backgroundColor: '#fff',
                        border: `1px solid ${card.border}40`,
                        borderRadius: '16px',
                        p: { xs: 2, sm: 2.5 },
                        boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 38, sm: 44 },
                          height: { xs: 38, sm: 44 },
                          borderRadius: '12px',
                          backgroundColor: card.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          flexShrink: 0,
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mb: 0.25 }}>
                          {card.title}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: brandColors.text, fontWeight: 700, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                          {card.value}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </motion.div>
              ))}

              {/* Background accent */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: 240, md: 300 },
                  height: { xs: 240, md: 300 },
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(brandColors.primary, 0.08)} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
