import { Box, Container, Typography, Button, Stack, Grid, alpha } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCheckCircle, FiTrendingUp, FiTarget, FiUsers, FiArrowUpRight } from 'react-icons/fi'
import { brandColors } from '../../theme'


const featurePillars = [
  {
    icon: <FiTrendingUp size={18} />,
    title: 'Profile Setup & Advice',
    desc: 'Complete structural overhaul & growth blueprint',
    tag: 'One-Time',
    price: '₹99',
    unit: 'setup',
    color: '#0A66C2',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    to: '/book?plan=starter',
  },
  {
    icon: <FiTarget size={18} />,
    title: 'Personal Branding',
    desc: '8 strategy-backed posts & custom content monthly',
    tag: 'Popular',
    price: '₹320',
    unit: '/mo',
    color: '#0D9488',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
    to: '/book?plan=growth',
  },
  {
    icon: <FiUsers size={18} />,
    title: 'Outreach Engine',
    desc: '8 posts/mo + cold messaging & follow-ups',
    tag: 'Full Engine',
    price: '₹400',
    unit: '/mo',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    to: '/book?plan=scale',
  },
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
                  fontSize: { xs: '2.2rem', sm: '3rem', md: '3.75rem' },
                  lineHeight: { xs: 1.2, md: 1.15 },
                  letterSpacing: '-0.035em',
                  fontWeight: 800,
                }}
              >
                Build Your Personal Brand &{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #0A66C2 0%, #2563EB 50%, #3B82F6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                    pb: '0.15em',
                    mb: '-0.15em',
                    pr: '0.05em',
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
              <Grid container spacing={{ xs: 1.75, sm: 2 }} sx={{ mt: { xs: 3.5, sm: 4.5 } }}>
                {featurePillars.map((p) => (
                  <Grid item xs={12} sm={4} key={p.title}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      style={{ height: '100%' }}
                    >
                      <Box
                        component={RouterLink}
                        to={p.to}
                        sx={{
                          textDecoration: 'none',
                          p: { xs: 2, sm: 2 },
                          borderRadius: '16px',
                          border: '1px solid rgba(226, 232, 240, 0.9)',
                          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
                          boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.04)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: p.borderColor,
                            boxShadow: `0 12px 24px -4px ${alpha(p.color, 0.16)}, 0 2px 6px -1px rgba(15, 23, 42, 0.04)`,
                            background: '#FFFFFF',
                            '& .arrow-icon': {
                              transform: 'translate(2px, -2px)',
                              color: p.color,
                            },
                          },
                        }}
                      >
                        {/* Top Row: Icon Badge + Category Tag */}
                        <Box sx={{ mb: 1.5 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.25 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '10px',
                                backgroundColor: p.bgColor,
                                color: p.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `1px solid ${p.borderColor}`,
                                flexShrink: 0,
                              }}
                            >
                              {p.icon}
                            </Box>
                            <Box
                              sx={{
                                px: 1,
                                py: 0.35,
                                borderRadius: '6px',
                                backgroundColor: alpha(p.color, 0.08),
                                color: p.color,
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase',
                              }}
                            >
                              {p.tag}
                            </Box>
                          </Stack>

                          {/* Title */}
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 750,
                              fontSize: { xs: '0.88rem', sm: '0.9rem' },
                              color: brandColors.text,
                              mb: 0.5,
                              lineHeight: 1.3,
                            }}
                          >
                            {p.title}
                          </Typography>

                          {/* Description */}
                          <Typography
                            variant="caption"
                            sx={{
                              color: brandColors.muted,
                              lineHeight: 1.45,
                              display: 'block',
                              fontSize: { xs: '0.76rem', sm: '0.78rem' },
                            }}
                          >
                            {p.desc}
                          </Typography>
                        </Box>

                        {/* Bottom Row: Price & Action */}
                        <Box
                          sx={{
                            pt: 1.25,
                            mt: 1,
                            borderTop: '1px dashed rgba(226, 232, 240, 0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Stack direction="row" alignItems="baseline" spacing={0.5}>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: '0.98rem',
                                color: brandColors.text,
                                letterSpacing: '-0.02em',
                              }}
                            >
                              {p.price}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.7rem',
                                color: brandColors.muted,
                                fontWeight: 500,
                              }}
                            >
                              {p.unit}
                            </Typography>
                          </Stack>

                          <Box
                            className="arrow-icon"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: brandColors.muted,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <FiArrowUpRight size={16} />
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
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
