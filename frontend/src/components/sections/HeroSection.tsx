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
    to: '/book?plan=starter',
    featured: false,
  },
  {
    icon: <FiTarget size={18} />,
    title: 'Personal Branding',
    desc: '8 strategy-backed posts & custom content monthly',
    tag: 'Best Value',
    badge: '📈 5x Reach Engine',
    price: '₹320',
    unit: '/mo',
    color: '#0D9488',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
    to: '/book?plan=growth',
    featured: true,
  },
  {
    icon: <FiUsers size={18} />,
    title: 'Outreach Engine',
    desc: '8 posts/mo + cold messaging & follow-ups',
    tag: 'Full Scale',
    badge: '🎯 Direct Inbounds',
    price: '₹400',
    unit: '/mo',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    to: '/book?plan=scale',
    featured: false,
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
        pt: { xs: 10, sm: 12, md: 14 },
        pb: { xs: 8, sm: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: brandColors.background,
        // Engineering dot-grid ambient backdrop
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
          width: { xs: 320, md: 540 },
          height: { xs: 320, md: 540 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(brandColors.primary, 0.1)} 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 5, md: 6 }} alignItems="center">
          {/* Left Column: Copy & Actions */}
          <Grid item xs={12} md={6}>
            {/* Pill Badge */}
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
                    gap: 1,
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 1, sm: 1.25 },
                    fontSize: { xs: '0.775rem', sm: '0.85rem' },
                    fontWeight: 700,
                    backgroundColor: alpha(brandColors.primary, 0.08),
                    color: brandColors.primary,
                    border: `1px solid ${alpha(brandColors.primary, 0.22)}`,
                    borderRadius: '100px',
                    maxWidth: '100%',
                    lineHeight: 1.45,
                    boxShadow: `0 4px 16px ${alpha(brandColors.primary, 0.08)}`,
                    wordBreak: 'break-word',
                    textAlign: 'left',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: brandColors.success,
                      display: 'inline-block',
                      boxShadow: `0 0 8px ${brandColors.success}`,
                    }}
                  />
                  Your Profile, Your Brand, Your Opportunity — Plans From ₹99
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
                From profile overhaul to 8 monthly strategy posts and active cold outreach campaigns. Clear, accessible packages built to turn your LinkedIn profile into continuous inbound opportunities.
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
                  <Box
                    key={h}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.25,
                      py: 0.5,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                    }}
                  >
                    <FiCheckCircle size={15} color={brandColors.success} />
                    <Typography variant="body2" sx={{ color: brandColors.text, fontWeight: 600, fontSize: { xs: '0.82rem', sm: '0.88rem' } }}>
                      {h}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </motion.div>

            {/* Luminous CTAs */}
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
                    py: 1.6,
                    width: { xs: '100%', sm: 'auto' },
                    minHeight: 50,
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #0A66C2 0%, #2563EB 100%)',
                    boxShadow: '0 8px 24px -2px rgba(10, 102, 194, 0.38), 0 2px 6px rgba(10, 102, 194, 0.18)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0850A0 0%, #1D4ED8 100%)',
                      boxShadow: '0 14px 32px -2px rgba(10, 102, 194, 0.52), 0 4px 12px rgba(10, 102, 194, 0.24)',
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
                    px: 4,
                    py: 1.6,
                    width: { xs: '100%', sm: 'auto' },
                    minHeight: 50,
                    fontSize: '0.98rem',
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
                      boxShadow: '0 8px 22px -2px rgba(15, 23, 42, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  View Pricing Breakdown
                </Button>
              </Stack>
            </motion.div>

            {/* Core Feature Pillars (Upgraded with Featured Ribbon & Micro-Badges) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Grid container spacing={{ xs: 1.75, sm: 2 }} sx={{ mt: { xs: 3.5, sm: 4.5 } }}>
                {featurePillars.map((p) => (
                  <Grid item xs={12} sm={4} key={p.title}>
                    <motion.div
                      whileHover={{ y: -5 }}
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
                          border: p.featured
                            ? `1.5px solid ${p.color}`
                            : '1px solid rgba(226, 232, 240, 0.9)',
                          background: p.featured
                            ? 'linear-gradient(180deg, #FFFFFF 0%, #F0FDFA 100%)'
                            : 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
                          boxShadow: p.featured
                            ? `0 6px 20px -2px ${alpha(p.color, 0.18)}, 0 2px 6px rgba(15, 23, 42, 0.04)`
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
                            boxShadow: `0 14px 28px -4px ${alpha(p.color, 0.22)}, 0 2px 8px -1px rgba(15, 23, 42, 0.04)`,
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
                                boxShadow: `0 2px 6px ${alpha(p.color, 0.12)}`,
                              }}
                            >
                              {p.icon}
                            </Box>
                            <Box
                              sx={{
                                px: 1,
                                py: 0.35,
                                borderRadius: '6px',
                                backgroundColor: p.featured ? p.color : alpha(p.color, 0.08),
                                color: p.featured ? '#FFFFFF' : p.color,
                                fontSize: '0.66rem',
                                fontWeight: 750,
                                letterSpacing: '0.03em',
                                textTransform: 'uppercase',
                                boxShadow: p.featured ? `0 2px 8px ${alpha(p.color, 0.3)}` : 'none',
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
                              mb: 1,
                            }}
                          >
                            {p.desc}
                          </Typography>

                          {/* Micro benefit badge */}
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: 0.85,
                              py: 0.25,
                              borderRadius: '4px',
                              backgroundColor: alpha(p.color, 0.06),
                              color: p.color,
                              fontSize: '0.68rem',
                              fontWeight: 600,
                            }}
                          >
                            {p.badge}
                          </Box>
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

          {/* Right Column: Premium Creator Growth & Analytics Showcase */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', py: { xs: 2, md: 4 } }}>
              {/* Main Dashboard Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.92) 100%)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '24px',
                    p: { xs: 2.5, sm: 3.5 },
                    border: '1.5px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: `0 24px 60px -12px ${alpha(brandColors.primary, 0.18)}, 0 8px 24px -4px rgba(15, 23, 42, 0.06)`,
                    position: 'relative',
                  }}
                >
                  {/* Card Header: Creator Profile */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1.75} alignItems="center">
                      <Box
                        sx={{
                          position: 'relative',
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0A66C2 0%, #3B82F6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          boxShadow: '0 4px 14px rgba(10, 102, 194, 0.3)',
                        }}
                      >
                        AS
                        {/* Live active indicator */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 1,
                            right: 1,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: '#22C55E',
                            border: '2px solid #FFFFFF',
                          }}
                        />
                      </Box>
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: brandColors.text }}>
                            Arjun Sharma
                          </Typography>
                          <FiAward size={15} color="#0A66C2" title="LinkedIn Top Voice" />
                        </Stack>
                        <Typography sx={{ fontSize: '0.75rem', color: brandColors.muted, fontWeight: 500 }}>
                          Tech Founder • LinkedIn Top Voice
                        </Typography>
                      </Box>
                    </Stack>

                    <Box
                      sx={{
                        px: 1.25,
                        py: 0.5,
                        borderRadius: '100px',
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        color: brandColors.primary,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <FiZap size={13} />
                      Engine Active
                    </Box>
                  </Stack>

                  {/* 3-Column Key Growth Metrics */}
                  <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '14px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(226, 232, 240, 0.8)',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.7rem', color: brandColors.muted, fontWeight: 600, mb: 0.25 }}>
                          Impressions
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em' }}>
                          148.5K
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.25, mt: 0.25 }}>
                          <FiTrendingUp size={11} /> +340%
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '14px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(226, 232, 240, 0.8)',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.7rem', color: brandColors.muted, fontWeight: 600, mb: 0.25 }}>
                          Profile Visits
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em' }}>
                          14.2K
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.25, mt: 0.25 }}>
                          <FiTrendingUp size={11} /> +185%
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '14px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(226, 232, 240, 0.8)',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.7rem', color: brandColors.muted, fontWeight: 600, mb: 0.25 }}>
                          Inbound Leads
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em' }}>
                          38 Leads
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.25, mt: 0.25 }}>
                          <FiTrendingUp size={11} /> +92%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Growth Curve Chart Graphic */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      mb: 2.5,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: brandColors.text }}>
                        30-Day Reach Growth
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: brandColors.primary, fontWeight: 700 }}>
                        +5.2x Faster
                      </Typography>
                    </Stack>

                    {/* SVG Sparkline Curve */}
                    <Box sx={{ width: '100%', height: 60 }}>
                      <svg viewBox="0 0 320 60" width="100%" height="100%" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0A66C2" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#0A66C2" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area fill */}
                        <path
                          d="M0,52 Q40,48 80,42 T160,32 T240,16 T320,4 L320,60 L0,60 Z"
                          fill="url(#growthGradient)"
                        />
                        {/* Stroke Line */}
                        <path
                          d="M0,52 Q40,48 80,42 T160,32 T240,16 T320,4"
                          fill="none"
                          stroke="#0A66C2"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {/* Pulsing peak dot */}
                        <circle cx="318" cy="4" r="4.5" fill="#0A66C2" />
                        <circle cx="318" cy="4" r="8" fill="#0A66C2" fillOpacity="0.25" />
                      </svg>
                    </Box>
                  </Box>

                  {/* Strategy Post Preview Snippet */}
                  <Box
                    sx={{
                      p: 1.75,
                      borderRadius: '14px',
                      backgroundColor: '#F8FAFC',
                      border: '1px dashed rgba(203, 213, 225, 0.8)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', color: brandColors.text, fontWeight: 500, lineHeight: 1.45, mb: 1 }}>
                      &ldquo;Just closed 3 enterprise contracts through structured personal branding on LinkedIn. BrandIt transformed my organic inbound engine.&rdquo;
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ fontSize: '0.7rem', color: brandColors.muted, fontWeight: 600 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#E11D48' }}>
                        <FiHeart size={12} /> 1,482
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FiMessageSquare size={12} /> 294 comments
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FiRepeat size={12} /> 86 reposts
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </motion.div>

              {/* Floating Glassmorphic Pill 1: Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: [0, -6, 0],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.4 },
                  scale: { duration: 0.6, delay: 0.4 },
                  y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '-12px',
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: '100px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #FED7AA',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)',
                    color: '#9A3412',
                    fontSize: '0.78rem',
                    fontWeight: 750,
                  }}
                >
                  🔥 +1.2K profile views this week
                </Box>
              </motion.div>

              {/* Floating Glassmorphic Pill 2: Bottom Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: [0, 6, 0],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.55 },
                  scale: { duration: 0.6, delay: 0.55 },
                  y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                }}
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: '-14px',
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: '100px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #BBF7D0',
                    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.15)',
                    color: '#166534',
                    fontSize: '0.78rem',
                    fontWeight: 750,
                  }}
                >
                  🤝 14 Warm Lead Inquiries
                </Box>
              </motion.div>

              {/* Floating Glassmorphic Pill 3: Bottom Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -5, 0],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.7 },
                  scale: { duration: 0.6, delay: 0.7 },
                  y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                }}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  right: '-18px',
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.75,
                    py: 0.9,
                    borderRadius: '100px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #DDD6FE',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.14)',
                    color: '#5B21B6',
                    fontSize: '0.76rem',
                    fontWeight: 750,
                  }}
                >
                  ⚡ 8 Strategy Posts Queued
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
