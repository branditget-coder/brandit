import { Box, Container, Typography, Button, Stack, Grid, alpha } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowRight,
  FiCheckCircle,
  FiTrendingUp,
  FiTarget,
  FiUsers,
  FiArrowUpRight,
  FiZap,
  FiAward,
  FiMessageSquare,
  FiHeart,
  FiRepeat,
} from 'react-icons/fi'
import { brandColors } from '../../theme'

const featurePillars = [
  {
    icon: <FiTrendingUp size={18} />,
    title: 'Profile Setup & Advice',
    desc: 'Complete structural overhaul & growth blueprint',
    tag: 'One-Time',
    badge: '⚡ 48-hr Turnaround',
    price: '₹99',
    unit: 'setup',
    color: '#0A66C2',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    to: '/book?plan=setup-advice',
    featured: false,
  },
  {
    icon: <FiTarget size={18} />,
    title: 'Personal Branding',
    desc: '8 strategy-backed posts & custom content monthly',
    tag: 'Monthly',
    badge: '📈 Steady Reach Growth',
    price: '₹320',
    unit: '/mo',
    color: '#0D9488',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
    to: '/book?plan=branding-basic',
    featured: false,
  },
  {
    icon: <FiUsers size={18} />,
    title: 'Outreach Engine',
    desc: '8 posts/mo + cold messaging & follow-ups',
    tag: 'Best Value',
    badge: '🎯 Direct Inbounds',
    price: '₹400',
    unit: '/mo',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    to: '/book?plan=branding-network',
    featured: true,
  },
]

const highlights = [
  '₹99 One-Time Setup',
  '8 Strategy Posts / month',
  'Cold Outreach & Growth Engine',
  '1-on-1 LinkedIn Advisory',
]

export default function HeroSection() {
  return (
    <Box
      sx={{
        pt: { xs: 8, sm: 11, md: 14 },
        pb: { xs: 7, sm: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: brandColors.background,
        // Ambient engineering dot-grid
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(${alpha(brandColors.primary, 0.12)} 1.25px, transparent 1.25px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: { xs: 260, sm: 380, md: 540 },
          height: { xs: 260, sm: 380, md: 540 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(brandColors.primary, 0.08)} 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, sm: 5, md: 6 }} alignItems={{ xs: 'center', md: 'flex-start' }}>
          {/* Left Column: Copy & Actions */}
          <Grid item xs={12} md={6}>
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mb: { xs: 2.5, sm: 3 }, gap: 1 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: { xs: 1.75, sm: 2.5 },
                    py: { xs: 0.85, sm: 1.15 },
                    fontSize: { xs: '0.74rem', sm: '0.84rem' },
                    fontWeight: 700,
                    backgroundColor: alpha(brandColors.primary, 0.08),
                    color: brandColors.primary,
                    border: `1px solid ${alpha(brandColors.primary, 0.22)}`,
                    borderRadius: '100px',
                    maxWidth: '100%',
                    lineHeight: 1.4,
                    boxShadow: `0 4px 16px ${alpha(brandColors.primary, 0.06)}`,
                    wordBreak: 'break-word',
                    textAlign: 'left',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: brandColors.success,
                      display: 'inline-block',
                      boxShadow: `0 0 6px ${brandColors.success}`,
                      flexShrink: 0,
                    }}
                  />
                  Your Profile, Your Brand, Your Opportunity — Plans From ₹99
                </Box>
              </Stack>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography
                variant="h1"
                sx={{
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '2rem', sm: '2.85rem', md: '3.6rem' },
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: brandColors.muted,
                  mb: { xs: 3, sm: 4 },
                  maxWidth: 520,
                  lineHeight: 1.65,
                  fontSize: { xs: '0.9rem', sm: '1.02rem' },
                }}
              >
                From profile overhaul to 8 monthly strategy posts and active cold outreach campaigns. Clear, accessible packages built to turn your LinkedIn profile into continuous inbound opportunities.
              </Typography>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Stack direction="row" flexWrap="wrap" gap={{ xs: 1, sm: 1.5 }} sx={{ mb: { xs: 3, sm: 4 } }}>
                {highlights.map((h) => (
                  <Box
                    key={h}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: { xs: 1, sm: 1.25 },
                      py: 0.45,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      border: '1px solid rgba(226, 232, 240, 0.85)',
                    }}
                  >
                    <FiCheckCircle size={14} color={brandColors.success} style={{ flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: brandColors.text, fontWeight: 600, fontSize: { xs: '0.78rem', sm: '0.86rem' } }}>
                      {h}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </motion.div>

            {/* Luminous CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.75} sx={{ width: '100%' }}>
                <Button
                  component={RouterLink}
                  to="/book"
                  variant="contained"
                  size="large"
                  endIcon={<FiArrowRight />}
                  sx={{
                    px: { xs: 3, sm: 4 },
                    py: 1.5,
                    width: { xs: '100%', sm: 'auto' },
                    minHeight: 48,
                    fontSize: { xs: '0.92rem', sm: '0.98rem' },
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #0A66C2 0%, #2563EB 100%)',
                    boxShadow: '0 8px 24px -2px rgba(10, 102, 194, 0.35)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0850A0 0%, #1D4ED8 100%)',
                      boxShadow: '0 14px 30px -2px rgba(10, 102, 194, 0.48)',
                      transform: 'translateY(-2px)',
                    },
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
                    px: { xs: 3, sm: 4 },
                    py: 1.5,
                    width: { xs: '100%', sm: 'auto' },
                    minHeight: 48,
                    fontSize: { xs: '0.92rem', sm: '0.98rem' },
                    fontWeight: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1.5px solid rgba(203, 213, 225, 0.9)',
                    color: brandColors.text,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: brandColors.primary,
                      backgroundColor: '#FFFFFF',
                      color: brandColors.primary,
                      boxShadow: '0 8px 20px -2px rgba(15, 23, 42, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  View Pricing Breakdown
                </Button>
              </Stack>
            </motion.div>

            {/* Core Feature Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: { xs: 3, sm: 4 } }}>
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
                          p: { xs: 1.75, sm: 2 },
                          borderRadius: '16px',
                          border: p.featured
                            ? `1.5px solid ${p.color}`
                            : '1px solid rgba(226, 232, 240, 0.9)',
                          background: p.featured
                            ? 'linear-gradient(180deg, #FFFFFF 0%, #F0FDFA 100%)'
                            : 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
                          boxShadow: p.featured
                            ? `0 6px 20px -2px ${alpha(p.color, 0.16)}, 0 2px 6px rgba(15, 23, 42, 0.04)`
                            : '0 2px 8px -2px rgba(15, 23, 42, 0.04)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: p.color,
                            boxShadow: `0 12px 24px -4px ${alpha(p.color, 0.2)}, 0 2px 8px -1px rgba(15, 23, 42, 0.04)`,
                            background: '#FFFFFF',
                            '& .arrow-icon': {
                              transform: 'translate(2px, -2px)',
                              color: p.color,
                            },
                          },
                        }}
                      >
                        {/* Top Row: Icon Badge + Category Tag */}
                        <Box sx={{ mb: 1.25 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Box
                              sx={{
                                width: 34,
                                height: 34,
                                borderRadius: '9px',
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
                                px: 0.9,
                                py: 0.3,
                                borderRadius: '6px',
                                backgroundColor: p.featured ? p.color : alpha(p.color, 0.08),
                                color: p.featured ? '#FFFFFF' : p.color,
                                fontSize: '0.64rem',
                                fontWeight: 750,
                                letterSpacing: '0.03em',
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
                              fontSize: { xs: '0.86rem', sm: '0.88rem' },
                              color: brandColors.text,
                              mb: 0.4,
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
                              lineHeight: 1.4,
                              display: 'block',
                              fontSize: { xs: '0.74rem', sm: '0.76rem' },
                              mb: 0.9,
                            }}
                          >
                            {p.desc}
                          </Typography>

                          {/* Micro benefit badge */}
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: 0.8,
                              py: 0.2,
                              borderRadius: '4px',
                              backgroundColor: alpha(p.color, 0.06),
                              color: p.color,
                              fontSize: '0.66rem',
                              fontWeight: 600,
                            }}
                          >
                            {p.badge}
                          </Box>
                        </Box>

                        {/* Bottom Row: Price & Action */}
                        <Box
                          sx={{
                            pt: 1,
                            mt: 0.75,
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
                                fontSize: '0.95rem',
                                color: brandColors.text,
                                letterSpacing: '-0.02em',
                              }}
                            >
                              {p.price}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.68rem',
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
                            <FiArrowUpRight size={15} />
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Right Column: Mobile-Responsive Creator Growth Card Showcase */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                pt: { xs: 1.5, sm: 2.5, md: 5 },
                pb: { xs: 2, sm: 2.5, md: 0 },
                px: { xs: 0.5, sm: 1 },
                maxWidth: '100%',
              }}
            >
              {/* Main Dashboard Card */}
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.65, delay: 0.25, ease: 'easeOut' }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(165deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.94) 100%)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: { xs: '18px', sm: '24px' },
                    p: { xs: 2, sm: 2.75, md: 3.25 },
                    border: '1.5px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: `0 20px 50px -12px ${alpha(brandColors.primary, 0.16)}, 0 4px 16px -2px rgba(15, 23, 42, 0.05)`,
                    position: 'relative',
                  }}
                >
                  {/* Card Header: Creator Profile */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 2, sm: 2.75 } }}>
                    <Stack direction="row" spacing={{ xs: 1.25, sm: 1.75 }} alignItems="center">
                      <Box
                        sx={{
                          position: 'relative',
                          width: { xs: 40, sm: 46 },
                          height: { xs: 40, sm: 46 },
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0A66C2 0%, #3B82F6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: { xs: '0.95rem', sm: '1.05rem' },
                          boxShadow: '0 4px 12px rgba(10, 102, 194, 0.25)',
                          flexShrink: 0,
                        }}
                      >
                        AS
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: '#22C55E',
                            border: '2px solid #FFFFFF',
                          }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Typography noWrap sx={{ fontWeight: 800, fontSize: { xs: '0.88rem', sm: '0.96rem' }, color: brandColors.text }}>
                            Arjun Sharma
                          </Typography>
                          <FiAward size={14} color="#0A66C2" />
                        </Stack>
                        <Typography noWrap sx={{ fontSize: { xs: '0.7rem', sm: '0.74rem' }, color: brandColors.muted, fontWeight: 500 }}>
                          Founder • LinkedIn Top Voice
                        </Typography>
                      </Box>
                    </Stack>

                    <Box
                      sx={{
                        px: { xs: 1, sm: 1.25 },
                        py: 0.4,
                        borderRadius: '100px',
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        color: brandColors.primary,
                        fontSize: { xs: '0.66rem', sm: '0.72rem' },
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      <FiZap size={12} />
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Engine Active</Box>
                      <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Active</Box>
                    </Box>
                  </Stack>

                  {/* 3-Column Grounded Growth Metrics (Realistic Percentages) */}
                  <Grid container spacing={{ xs: 1, sm: 1.5 }} sx={{ mb: { xs: 2, sm: 2.5 } }}>
                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: { xs: 1, sm: 1.35 },
                          borderRadius: '12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(226, 232, 240, 0.8)',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                          textAlign: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: { xs: '0.64rem', sm: '0.7rem' }, color: brandColors.muted, fontWeight: 600, mb: 0.2 }}>
                          Reach
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1.15rem' }, fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em' }}>
                          +45%
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.62rem', sm: '0.68rem' }, color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25, mt: 0.2 }}>
                          <FiTrendingUp size={10} /> MoM
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: { xs: 1, sm: 1.35 },
                          borderRadius: '12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(226, 232, 240, 0.8)',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                          textAlign: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: { xs: '0.64rem', sm: '0.7rem' }, color: brandColors.muted, fontWeight: 600, mb: 0.2 }}>
                          Profile Views
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1.15rem' }, fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em' }}>
                          +58%
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.62rem', sm: '0.68rem' }, color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25, mt: 0.2 }}>
                          <FiTrendingUp size={10} /> MoM
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: { xs: 1, sm: 1.35 },
                          borderRadius: '12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(226, 232, 240, 0.8)',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                          textAlign: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: { xs: '0.64rem', sm: '0.7rem' }, color: brandColors.muted, fontWeight: 600, mb: 0.2 }}>
                          Inbounds
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1.15rem' }, fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em' }}>
                          +35%
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.62rem', sm: '0.68rem' }, color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25, mt: 0.2 }}>
                          <FiTrendingUp size={10} /> MoM
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Growth Curve Chart Graphic */}
                  <Box
                    sx={{
                      p: { xs: 1.5, sm: 1.75 },
                      borderRadius: '14px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      mb: { xs: 1.75, sm: 2.25 },
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography sx={{ fontSize: { xs: '0.72rem', sm: '0.76rem' }, fontWeight: 700, color: brandColors.text }}>
                        Monthly Engagement Trend
                      </Typography>
                      <Typography sx={{ fontSize: { xs: '0.66rem', sm: '0.7rem' }, color: brandColors.primary, fontWeight: 700 }}>
                        +45% Consistent Growth
                      </Typography>
                    </Stack>

                    {/* SVG Sparkline Curve */}
                    <Box sx={{ width: '100%', height: { xs: 44, sm: 54 } }}>
                      <svg viewBox="0 0 320 54" width="100%" height="100%" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0A66C2" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#0A66C2" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,46 Q40,42 80,38 T160,28 T240,16 T320,6 L320,54 L0,54 Z"
                          fill="url(#growthGradient)"
                        />
                        <path
                          d="M0,46 Q40,42 80,38 T160,28 T240,16 T320,6"
                          fill="none"
                          stroke="#0A66C2"
                          strokeWidth="2.75"
                          strokeLinecap="round"
                        />
                        <circle cx="318" cy="6" r="3.5" fill="#0A66C2" />
                        <circle cx="318" cy="6" r="7" fill="#0A66C2" fillOpacity="0.22" />
                      </svg>
                    </Box>
                  </Box>

                  {/* Strategy Post Preview Snippet */}
                  <Box
                    sx={{
                      p: { xs: 1.35, sm: 1.6 },
                      borderRadius: '12px',
                      backgroundColor: '#F8FAFC',
                      border: '1px dashed rgba(203, 213, 225, 0.8)',
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: '0.72rem', sm: '0.74rem' }, color: brandColors.text, fontWeight: 500, lineHeight: 1.45, mb: 0.8 }}>
                      &ldquo;Optimized my LinkedIn profile and started posting weekly strategy content with BrandIt. Organic inbound inquiries grew by 45%.&rdquo;
                    </Typography>
                    <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} sx={{ fontSize: '0.68rem', color: brandColors.muted, fontWeight: 600 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: '#E11D48' }}>
                        <FiHeart size={11} /> 48
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <FiMessageSquare size={11} /> 14 comments
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <FiRepeat size={11} /> 6 reposts
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </motion.div>

              {/* Floating Notification Pills (Cleanly Responsive) */}
              {/* Floating Pill 1: Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -5, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.4 },
                  scale: { duration: 0.5, delay: 0.4 },
                  y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '4px',
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.75,
                    py: 0.75,
                    borderRadius: '100px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #FED7AA',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.12)',
                    color: '#9A3412',
                    fontSize: '0.74rem',
                    fontWeight: 750,
                  }}
                >
                  🔥 +35% Profile Visibility
                </Box>
              </motion.div>

              {/* Floating Pill 2: Bottom Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, 5, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.55 },
                  scale: { duration: 0.5, delay: 0.55 },
                  y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                }}
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '4px',
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.75,
                    py: 0.75,
                    borderRadius: '100px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #BBF7D0',
                    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.12)',
                    color: '#166534',
                    fontSize: '0.74rem',
                    fontWeight: 750,
                  }}
                >
                  🤝 Inbound Inquiries Active
                </Box>
              </motion.div>

              {/* Mobile-Only Summary Bar (Visible only on xs screens) */}
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  mt: 1.5,
                  p: 1.2,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                }}
              >
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: brandColors.primary }}>
                  🔥 +35% Profile Visibility
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534' }}>
                  🤝 Active Inbounds
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
