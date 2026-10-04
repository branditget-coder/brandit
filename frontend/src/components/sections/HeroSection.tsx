import { useState } from 'react'
import { Box, Container, Typography, Button, Stack, Grid, alpha } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowRight,
  FiCheckCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiUsers,
  FiArrowUpRight,
  FiZap,
  FiAward,
  FiMessageSquare,
  FiHeart,
  FiRepeat,
  FiAlertTriangle,
  FiCheck,
  FiX,
} from 'react-icons/fi'
import { brandColors } from '../../theme'

const featurePillars = [
  {
    icon: <FiTrendingUp size={18} />,
    title: 'Profile Setup & Advice',
    desc: 'Complete structural overhaul & growth blueprint',
    tag: 'One-Time',
    badge: '⚡ 48-hr Turnaround',
    price: '₹129',
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
    price: '₹349',
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
    price: '₹499',
    unit: '/mo',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    to: '/book?plan=branding-network',
    featured: true,
  },
]

const highlights = [
  '₹129 One-Time Setup',
  '8 Strategy Posts / month',
  'Cold Outreach & Growth Engine',
  '1-on-1 LinkedIn Advisory',
]

export default function HeroSection() {
  const [teardownMode, setTeardownMode] = useState<'after' | 'before'>('after')
  const [replied, setReplied] = useState(false)

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
                  Your Profile, Your Brand, Your Opportunity — Plans From ₹129
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

          {/* Right Column: Interactive Before vs After Profile Teardown */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                pt: { xs: 1, sm: 1.5, md: 2 },
                pb: { xs: 1.5, sm: 2, md: 0 },
                px: { xs: 0.5, sm: 1 },
                maxWidth: { xs: '100%', md: 470 },
                mx: 'auto',
              }}
            >
              {/* Interactive Teardown Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(165deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: { xs: '18px', sm: '22px' },
                    p: { xs: 1.5, sm: 2, md: 2.25 },
                    border: '1.5px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: teardownMode === 'after'
                      ? `0 18px 45px -10px ${alpha(brandColors.primary, 0.16)}, 0 4px 16px -2px rgba(15, 23, 42, 0.05)`
                      : '0 16px 40px -10px rgba(239, 68, 68, 0.1), 0 4px 14px -2px rgba(15, 23, 42, 0.04)',
                    position: 'relative',
                    transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                  }}
                >
                  {/* Top Interactive Switcher Bar */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 1,
                      mb: { xs: 1.25, sm: 1.5 },
                      pb: 1,
                      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          backgroundColor: teardownMode === 'after' ? '#10B981' : '#EF4444',
                          boxShadow: teardownMode === 'after' ? '0 0 6px #10B981' : '0 0 6px #EF4444',
                        }}
                      />
                      <Typography sx={{ fontSize: { xs: '0.68rem', sm: '0.72rem' }, fontWeight: 750, color: brandColors.text, letterSpacing: '-0.01em' }}>
                        Live Teardown Simulator
                      </Typography>
                    </Box>

                    {/* Mode Toggle Switch */}
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 0.35,
                        borderRadius: '100px',
                        backgroundColor: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        alignSelf: { xs: 'center', sm: 'auto' },
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() => {
                          setTeardownMode('before')
                          setReplied(false)
                        }}
                        sx={{
                          px: { xs: 1.2, sm: 1.5 },
                          py: 0.35,
                          borderRadius: '100px',
                          fontSize: { xs: '0.66rem', sm: '0.7rem' },
                          fontWeight: 750,
                          minWidth: 'auto',
                          textTransform: 'none',
                          backgroundColor: teardownMode === 'before' ? '#EF4444' : 'transparent',
                          color: teardownMode === 'before' ? '#FFFFFF' : '#64748B',
                          boxShadow: teardownMode === 'before' ? '0 2px 8px rgba(239, 68, 68, 0.3)' : 'none',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            backgroundColor: teardownMode === 'before' ? '#DC2626' : 'rgba(0,0,0,0.04)',
                          },
                        }}
                      >
                        ❌ Before BrandIt
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setTeardownMode('after')}
                        sx={{
                          px: { xs: 1.2, sm: 1.5 },
                          py: 0.35,
                          borderRadius: '100px',
                          fontSize: { xs: '0.66rem', sm: '0.7rem' },
                          fontWeight: 750,
                          minWidth: 'auto',
                          textTransform: 'none',
                          backgroundColor: teardownMode === 'after' ? '#0A66C2' : 'transparent',
                          color: teardownMode === 'after' ? '#FFFFFF' : '#64748B',
                          boxShadow: teardownMode === 'after' ? '0 2px 8px rgba(10, 102, 194, 0.3)' : 'none',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            backgroundColor: teardownMode === 'after' ? '#084e96' : 'rgba(0,0,0,0.04)',
                          },
                        }}
                      >
                        ✨ With BrandIt
                      </Button>
                    </Box>
                  </Box>

                  {/* Animated Profile Card Content */}
                  <AnimatePresence mode="wait">
                    {teardownMode === 'before' ? (
                      <motion.div
                        key="before-view"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                      >
                        {/* Profile Header (Before State: Bland & Ignored) */}
                        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.25 }}>
                          <Box
                            sx={{
                              width: { xs: 36, sm: 40 },
                              height: { xs: 36, sm: 40 },
                              borderRadius: '50%',
                              backgroundColor: '#94A3B8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              flexShrink: 0,
                              position: 'relative',
                            }}
                          >
                            RD
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 9,
                                height: 9,
                                borderRadius: '50%',
                                backgroundColor: '#94A3B8',
                                border: '2px solid #FFFFFF',
                              }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
                              <Typography sx={{ fontWeight: 800, fontSize: { xs: '0.86rem', sm: '0.92rem' }, color: brandColors.text }}>
                                Raghav Dhir
                              </Typography>
                              <Box
                                sx={{
                                  px: 0.85,
                                  py: 0.15,
                                  borderRadius: '100px',
                                  backgroundColor: '#FEF2F2',
                                  border: '1px solid #FECACA',
                                  color: '#DC2626',
                                  fontSize: '0.6rem',
                                  fontWeight: 700,
                                }}
                              >
                                Needs Update
                              </Box>
                            </Stack>
                            <Typography noWrap sx={{ fontSize: { xs: '0.68rem', sm: '0.72rem' }, color: '#94A3B8', fontWeight: 500, mt: 0.2 }}>
                              College Student • Actively Seeking Internships
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Weak Headline Box */}
                        <Box
                          sx={{
                            px: 1.25,
                            py: 0.85,
                            borderRadius: '9px',
                            backgroundColor: '#F8FAFC',
                            border: '1px dashed #CBD5E1',
                            mb: 1.25,
                          }}
                        >
                          <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.74rem' }, color: '#64748B', fontStyle: 'italic', lineHeight: 1.4 }}>
                            &ldquo;MBA Student looking for internships | Open to work | Actively applying&rdquo;
                          </Typography>
                        </Box>

                        {/* 3 Low Metric Stats */}
                        <Grid container spacing={1} sx={{ mb: 1.25 }}>
                          <Grid item xs={4}>
                            <Box sx={{ p: 0.85, borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                              <Typography sx={{ fontSize: '0.64rem', color: brandColors.muted, fontWeight: 600 }}>Weekly Views</Typography>
                              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1.05rem' }, fontWeight: 800, color: '#64748B', letterSpacing: '-0.02em' }}>
                                18
                              </Typography>
                              <Typography sx={{ fontSize: '0.62rem', color: '#DC2626', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.2 }}>
                                <FiTrendingDown size={10} /> -24%
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ p: 0.85, borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                              <Typography sx={{ fontSize: '0.64rem', color: brandColors.muted, fontWeight: 600 }}>Recruiter DMs</Typography>
                              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1.05rem' }, fontWeight: 800, color: '#64748B', letterSpacing: '-0.02em' }}>
                                0
                              </Typography>
                              <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.2 }}>
                                No calls
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ p: 0.85, borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                              <Typography sx={{ fontSize: '0.64rem', color: brandColors.muted, fontWeight: 600 }}>Campus Rank</Typography>
                              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1.05rem' }, fontWeight: 800, color: '#64748B', letterSpacing: '-0.02em' }}>
                                Bottom 80%
                              </Typography>
                              <Typography sx={{ fontSize: '0.62rem', color: '#DC2626', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.2 }}>
                                Hard to Find
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Profile Strength Bar */}
                        <Box sx={{ p: 1.1, borderRadius: '10px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', mb: 1.25 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.4 }}>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#92400E' }}>
                              Profile Strength
                            </Typography>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#B45309' }}>
                              38 / 100 (Needs Work)
                            </Typography>
                          </Stack>
                          <Box sx={{ height: 5, borderRadius: '4px', backgroundColor: '#FDE68A', overflow: 'hidden' }}>
                            <Box sx={{ width: '38%', height: '100%', backgroundColor: '#F59E0B', borderRadius: '4px' }} />
                          </Box>
                        </Box>

                        {/* Teardown Warning Insights */}
                        <Box sx={{ p: 1.1, borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                          <Stack spacing={0.4}>
                            <Typography sx={{ fontSize: '0.68rem', color: '#991B1B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <FiAlertTriangle size={12} color="#DC2626" /> No skills or college achievements highlighted
                            </Typography>
                            <Typography sx={{ fontSize: '0.68rem', color: '#991B1B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <FiAlertTriangle size={12} color="#DC2626" /> Passed over by 18 recruiters this week
                            </Typography>
                          </Stack>
                        </Box>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="after-view"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                      >
                        {/* Profile Header (After State: Clean & Decluttered) */}
                        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.25 }}>
                          <Box
                            sx={{
                              width: { xs: 36, sm: 40 },
                              height: { xs: 36, sm: 40 },
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #0A66C2 0%, #2563EB 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              flexShrink: 0,
                              position: 'relative',
                              boxShadow: '0 3px 10px rgba(10, 102, 194, 0.25)',
                            }}
                          >
                            RD
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 9,
                                height: 9,
                                borderRadius: '50%',
                                backgroundColor: '#10B981',
                                border: '2px solid #FFFFFF',
                                boxShadow: '0 0 5px #10B981',
                              }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
                              <Typography sx={{ fontWeight: 800, fontSize: { xs: '0.86rem', sm: '0.92rem' }, color: brandColors.text }}>
                                Raghav Dhir
                              </Typography>
                              <Box
                                sx={{
                                  px: 0.85,
                                  py: 0.15,
                                  borderRadius: '100px',
                                  backgroundColor: '#ECFDF5',
                                  border: '1px solid #A7F3D0',
                                  color: '#065F46',
                                  fontSize: '0.6rem',
                                  fontWeight: 750,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 0.35,
                                }}
                              >
                                <Box component="span" sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#10B981' }} />
                                Open to Work
                              </Box>
                            </Stack>
                            <Typography noWrap sx={{ fontSize: { xs: '0.68rem', sm: '0.72rem' }, color: brandColors.primary, fontWeight: 700, mt: 0.2 }}>
                              MBA Candidate &apos;26 • Placement & Internship Ready 🎯
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Clean High-Converting Headline Box */}
                        <Box
                          sx={{
                            px: 1.25,
                            py: 0.85,
                            borderRadius: '9px',
                            backgroundColor: '#F0F9FF',
                            border: '1px solid #BAE6FD',
                            mb: 1.25,
                          }}
                        >
                          <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.74rem' }, color: brandColors.text, fontWeight: 600, lineHeight: 1.4 }}>
                            &ldquo;Strategy & Ops Enthusiast | Standout Projects & Problem Solver 🚀&rdquo;
                          </Typography>
                        </Box>

                        {/* 3 High Growth Metric Stats */}
                        <Grid container spacing={1} sx={{ mb: 1.25 }}>
                          <Grid item xs={4}>
                            <Box sx={{ p: 0.85, borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.9)', textAlign: 'center', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)' }}>
                              <Typography sx={{ fontSize: '0.64rem', color: brandColors.muted, fontWeight: 600 }}>Weekly Views</Typography>
                              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1.05rem' }, fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em' }}>
                                2,450+
                              </Typography>
                              <Typography sx={{ fontSize: '0.62rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.2 }}>
                                <FiTrendingUp size={10} /> +320% this mo
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ p: 0.85, borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.9)', textAlign: 'center', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)' }}>
                              <Typography sx={{ fontSize: '0.64rem', color: brandColors.muted, fontWeight: 600 }}>Recruiter DMs</Typography>
                              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1.05rem' }, fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em' }}>
                                8 new
                              </Typography>
                              <Typography sx={{ fontSize: '0.62rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.3 }}>
                                ✨ Direct Calls
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ p: 0.85, borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid rgba(226, 232, 240, 0.9)', textAlign: 'center', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)' }}>
                              <Typography sx={{ fontSize: '0.64rem', color: brandColors.muted, fontWeight: 600 }}>Campus Rank</Typography>
                              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1.05rem' }, fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em' }}>
                                Top 5%
                              </Typography>
                              <Typography sx={{ fontSize: '0.62rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.2 }}>
                                ⚡ Standout
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Profile Strength Bar */}
                        <Box sx={{ p: 1.1, borderRadius: '10px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', mb: 1.25 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.4 }}>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#065F46' }}>
                              Profile Strength
                            </Typography>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#047857' }}>
                              98 / 100 (Placement Ready)
                            </Typography>
                          </Stack>
                          <Box sx={{ height: 5, borderRadius: '4px', backgroundColor: '#A7F3D0', overflow: 'hidden' }}>
                            <Box sx={{ width: '98%', height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: '4px' }} />
                          </Box>
                        </Box>

                        {/* Interactive Recruiter InMail Message Box */}
                        <Box
                          sx={{
                            p: 1.15,
                            borderRadius: '10px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #BFDBFE',
                            boxShadow: '0 3px 10px rgba(10, 102, 194, 0.06)',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.6 }}>
                            <Stack direction="row" spacing={0.85} alignItems="center">
                              <Box
                                sx={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  backgroundColor: '#1E293B',
                                  color: '#FFFFFF',
                                  fontSize: '0.58rem',
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                PR
                              </Box>
                              <Box>
                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 750, color: brandColors.text, lineHeight: 1.1 }}>
                                  Pooja Roy • Campus Hiring Lead
                                </Typography>
                                <Typography sx={{ fontSize: '0.6rem', color: brandColors.muted }}>
                                  Top Tech & Consulting • Today at 2:15 PM
                                </Typography>
                              </Box>
                            </Stack>
                            <Box
                              sx={{
                                px: 0.7,
                                py: 0.15,
                                borderRadius: '4px',
                                backgroundColor: '#EFF6FF',
                                color: brandColors.primary,
                                fontSize: '0.58rem',
                                fontWeight: 750,
                              }}
                            >
                              New InMail
                            </Box>
                          </Stack>

                          <Typography sx={{ fontSize: '0.68rem', color: brandColors.text, lineHeight: 1.4, mb: 1 }}>
                            {replied
                              ? '“Thanks Pooja! I’d love to connect. Thursday afternoon works great for me. Excited to discuss the internship role!”'
                              : '“Hey Raghav, saw your profile and college projects—super impressive work! We’re hiring for our summer internship cohort. Free for a quick chat this week?”'}
                          </Typography>

                          {/* Interactive Action Buttons */}
                          <Stack direction="row" spacing={0.8} alignItems="center">
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => setReplied(!replied)}
                              sx={{
                                py: 0.35,
                                px: 1.1,
                                fontSize: '0.64rem',
                                fontWeight: 750,
                                textTransform: 'none',
                                borderRadius: '7px',
                                backgroundColor: replied ? '#16A34A' : brandColors.primary,
                                '&:hover': {
                                  backgroundColor: replied ? '#15803D' : '#084e96',
                                },
                              }}
                            >
                              {replied ? '✓ Reply Sent!' : '⚡ Quick AI Reply'}
                            </Button>
                            <Button
                              component={RouterLink}
                              to="/book?plan=branding-network"
                              size="small"
                              sx={{
                                py: 0.35,
                                px: 1.1,
                                fontSize: '0.64rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                color: brandColors.text,
                                backgroundColor: '#F1F5F9',
                                borderRadius: '7px',
                                '&:hover': { backgroundColor: '#E2E8F0' },
                              }}
                            >
                              View Internship Details
                            </Button>
                          </Stack>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </motion.div>

              {/* Floating Dynamic Badges */}
              {/* Top Right Floating Pill */}
              <motion.div
                key={`badge-top-${teardownMode}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -4, 0],
                }}
                transition={{
                  opacity: { duration: 0.35 },
                  scale: { duration: 0.35 },
                  y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '6px',
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 0.6,
                    px: 1.4,
                    py: 0.55,
                    borderRadius: '100px',
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(12px)',
                    border: teardownMode === 'after' ? '1px solid #BFDBFE' : '1px solid #FECACA',
                    boxShadow: teardownMode === 'after'
                      ? '0 6px 20px rgba(10, 102, 194, 0.14)'
                      : '0 6px 20px rgba(239, 68, 68, 0.1)',
                    color: teardownMode === 'after' ? '#0A66C2' : '#DC2626',
                    fontSize: '0.7rem',
                    fontWeight: 750,
                  }}
                >
                  {teardownMode === 'after' ? '🔥 8 Recruiter Messages This Week' : '😴 0 Recruiter Messages'}
                </Box>
              </motion.div>

              {/* Bottom Left Floating Pill */}
              <motion.div
                key={`badge-bot-${teardownMode}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, 4, 0],
                }}
                transition={{
                  opacity: { duration: 0.35 },
                  scale: { duration: 0.35 },
                  y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                }}
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '6px',
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 0.6,
                    px: 1.4,
                    py: 0.55,
                    borderRadius: '100px',
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(12px)',
                    border: teardownMode === 'after' ? '1px solid #BBF7D0' : '1px solid #FED7AA',
                    boxShadow: teardownMode === 'after'
                      ? '0 6px 20px rgba(34, 197, 94, 0.12)'
                      : '0 6px 20px rgba(245, 158, 11, 0.1)',
                    color: teardownMode === 'after' ? '#166534' : '#B45309',
                    fontSize: '0.7rem',
                    fontWeight: 750,
                  }}
                >
                  {teardownMode === 'after' ? '🎯 98/100 Placement Ready' : '📉 Profile Score: 38/100'}
                </Box>
              </motion.div>

              {/* Mobile-Only Summary Bar (Visible only on xs screens) */}
              <Box
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  mt: 1.25,
                  p: 1,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                }}
              >
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 750, color: teardownMode === 'after' ? brandColors.primary : '#DC2626' }}>
                  {teardownMode === 'after' ? '🔥 8 Messages / Wk' : '😴 0 Messages'}
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 750, color: teardownMode === 'after' ? '#166534' : '#B45309' }}>
                  {teardownMode === 'after' ? '⚡ Score: 98/100' : '⚠️ Score: 38/100'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
