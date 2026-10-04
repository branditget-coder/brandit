import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  alpha,
  Rating,
  Avatar,
  Chip,
  Stack,
  Tab,
  Tabs,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiLinkedin, FiTrendingUp, FiMessageSquare, FiUsers } from 'react-icons/fi'
import { brandColors } from '../../theme'

export interface TestimonialItem {
  id: string
  name: string
  role: string
  avatar: string
  avatarBg: string
  category: 'all' | 'marketing' | 'finance' | 'consulting' | 'ops'
  metric: string
  quote: string
  rating: number
}

const classmateTestimonials: TestimonialItem[] = [
  {
    id: 'jatin-budhwar',
    name: 'Jatin Budhwar',
    role: 'MBA Candidate • Marketing & Tech',
    avatar: 'JB',
    avatarBg: '#0A66C2',
    category: 'marketing',
    metric: '1,200+ Connections & 3x Reach',
    quote:
      "Before our internship placements started, my LinkedIn was basically dead with barely 200 connections. Raghav helped me fix my headline, clean up my about section, and showed me how to cold message alumni properly. Within two weeks my connection requests actually started getting accepted and my profile reach literally tripled. Really helped me stand out in college.",
    rating: 5,
  },
  {
    id: 'sachit-bhandari',
    name: 'Sachit Bhandari',
    role: 'MBA Candidate • Marketing & Strategy',
    avatar: 'SB',
    avatarBg: '#2563EB',
    category: 'marketing',
    metric: '3,000+ Post Impressions',
    quote:
      "In college literally everyone writes the exact same headline: 'MBA Candidate at XYZ'. BrandIt helped me reframe my profile to highlight my live projects and case competition decks. Started posting simple takeaways from class and my impressions jumped from 50 views to over 3,000 views per post. The profile reach is insane now.",
    rating: 5,
  },
  {
    id: 'harjot-singh',
    name: 'Harjot Singh',
    role: 'MBA Candidate • Analytics & Consulting',
    avatar: 'HS',
    avatarBg: '#059669',
    category: 'consulting',
    metric: '50% Cold DM Reply Rate',
    quote:
      "I used to send cold messages to recruiters and alumni on LinkedIn and was constantly left on seen. Raghav gave me simple, crisp cold messaging templates and tweaked my summary so people instantly understood what roles I was targeting. Started getting genuine replies from senior alumni within days.",
    rating: 5,
  },
  {
    id: 'aman-govind-rao',
    name: 'Aman Govind Rao',
    role: 'MBA Candidate • Sales & Business Dev',
    avatar: 'AG',
    avatarBg: '#D97706',
    category: 'marketing',
    metric: '800+ Targeted Industry Connections',
    quote:
      "Honestly my LinkedIn was completely empty before this. They helped me set up a professional banner, structure my previous internship points cleanly, and taught me how to network with industry folks without sounding awkward. Gained over 800 relevant industry connections in just one month.",
    rating: 5,
  },
  {
    id: 'nandini-dutt',
    name: 'Nandini Dutt',
    role: 'MBA Candidate • Product & Growth',
    avatar: 'ND',
    avatarBg: '#7C3AED',
    category: 'marketing',
    metric: '4x Profile Views During Placements',
    quote:
      "When placement week is around the corner, having a polished LinkedIn makes a huge difference. BrandIt helped me showcase my committee work, case competition presentations, and certifications. My profile looked 10x cleaner than other students' and profile views shot up 4x during placement drives.",
    rating: 5,
  },
  {
    id: 'anushka-sahu',
    name: 'Anushka Sahu',
    role: 'MBA Candidate • Human Resources',
    avatar: 'AS',
    avatarBg: '#DB2777',
    category: 'ops',
    metric: '+250% Search Appearances',
    quote:
      "Being in HR, I know how easily profiles blend in together. BrandIt helped me rewrite my summary with the right keywords that recruiters search for. My weekly search appearances went up by 250% and recruiters started sending connection requests on their own. Super practical advice without any high-fi fluff.",
    rating: 5,
  },
  {
    id: 'sambhav-kapoor',
    name: 'Sambhav Kapoor',
    role: 'MBA Candidate • Operations & Supply Chain',
    avatar: 'SK',
    avatarBg: '#0F766E',
    category: 'ops',
    metric: 'Alumni Referrals & Connection Growth',
    quote:
      "My biggest struggle was how to explain my pre-MBA work experience without making it sound boring. Raghav sat down with me, cut out all the extra clutter, and made the bullet points sharp and impact-driven. Got noticed by alumni in top supply chain firms when I reached out for referral guidance.",
    rating: 5,
  },
  {
    id: 'aaryan-kapoor',
    name: 'Aaryan Kapoor',
    role: 'MBA Candidate • Finance',
    avatar: 'AK',
    avatarBg: '#4F46E5',
    category: 'finance',
    metric: 'Grew from 150 to 1,500+ Connections',
    quote:
      "I had zero clue how to use LinkedIn for networking before college placements. BrandIt gave me clear tips on what to comment on finance posts, how to cold connect with alumni, and how to keep my profile active. Went from 150 dead connections to over 1,500 active connections in a few weeks. Best decision.",
    rating: 5,
  },
  {
    id: 'aman-sharma',
    name: 'Aman Sharma',
    role: 'MBA Candidate • General Management & Consulting',
    avatar: 'AS',
    avatarBg: '#1E293B',
    category: 'consulting',
    metric: 'Stood Out in Summer Placement Interviews',
    quote:
      "Simple, honest, and zero fluff. They didn't use any fancy buzzwords, just helped me sound like a sharp MBA student who knows what he brings to the table. Two of my summer placement interviewers actually brought up points directly from my LinkedIn profile during the interview.",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredTestimonials =
    selectedCategory === 'all'
      ? classmateTestimonials
      : classmateTestimonials.filter(item => item.category === selectedCategory)

  return (
    <Box
      id="testimonials"
      sx={{
        py: { xs: 10, md: 16 },
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: 350,
          background: `radial-gradient(ellipse at top, ${alpha(brandColors.primary, 0.05)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Chip
              icon={<FiUsers size={14} color={brandColors.primary} />}
              label="MBA CLASSMATES & CAMPUS SUCCESS"
              sx={{
                mb: 2,
                backgroundColor: alpha(brandColors.primary, 0.08),
                color: brandColors.primary,
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
                px: 1,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: brandColors.dark,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.9rem' },
                lineHeight: 1.2,
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              How Our MBA Classmates{' '}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Stand Out
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 640,
                mx: 'auto',
                color: brandColors.muted,
                fontSize: { xs: '0.98rem', md: '1.05rem' },
                lineHeight: 1.6,
              }}
            >
              Real stories from our college classmates. From fixing dead profiles and boosting connection growth, to getting replies on cold messages and standing out in campus placements.
            </Typography>

            {/* Practical Pillars Strip */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 3.5 }}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3, pt: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiUsers size={16} color={brandColors.primary} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.dark }}>
                  Connection Growth
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiTrendingUp size={16} color={brandColors.success} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.dark }}>
                  Profile Reach & Views
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiMessageSquare size={16} color="#D97706" />
                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.dark }}>
                  Cold Messaging That Gets Replies
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiCheckCircle size={16} color={brandColors.primary} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.dark }}>
                  Zero High-Fi Fluff
                </Typography>
              </Box>
            </Stack>
          </motion.div>
        </Box>

        {/* Filter Specialization Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 4, md: 6 } }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              backgroundColor: alpha(brandColors.background, 0.8),
              p: 0.6,
              borderRadius: '16px',
              border: `1px solid ${brandColors.border}`,
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTab-root': {
                minHeight: '36px',
                borderRadius: '12px',
                px: 2,
                py: 0.75,
                fontSize: '0.84rem',
                fontWeight: 600,
                textTransform: 'none',
                color: brandColors.muted,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  color: '#FFFFFF',
                  backgroundColor: brandColors.primary,
                  boxShadow: '0 4px 12px ' + alpha(brandColors.primary, 0.3),
                },
              },
            }}
          >
            <Tab label="All Classmates (9)" value="all" />
            <Tab label="Marketing & Sales" value="marketing" />
            <Tab label="Finance" value="finance" />
            <Tab label="Consulting & Strategy" value="consulting" />
            <Tab label="HR & Operations" value="ops" />
          </Tabs>
        </Box>

        {/* Testimonials Masonry / Grid */}
        <Grid container spacing={3.5}>
          <AnimatePresence mode="popLayout">
            {filteredTestimonials.map((item, index) => (
              <Grid item xs={12} sm={6} lg={4} key={item.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  style={{ height: '100%' }}
                >
                  <Box
                    sx={{
                      p: { xs: 3, md: 3.5 },
                      borderRadius: '22px',
                      border: `1px solid ${brandColors.border}`,
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 14px 35px -10px rgba(10, 102, 194, 0.12)',
                        borderColor: alpha(brandColors.primary, 0.35),
                      },
                    }}
                  >
                    {/* Top: Outcome & Verified badge */}
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                          <FiCheckCircle size={13} color={brandColors.success} />
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#059669',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              letterSpacing: '0.02em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Verified Classmate
                          </Typography>
                        </Box>
                        <Rating value={item.rating} readOnly size="small" />
                      </Stack>

                      {/* Practical Highlight Badge */}
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.8,
                          px: 1.4,
                          py: 0.5,
                          borderRadius: '8px',
                          backgroundColor: alpha(brandColors.primary, 0.06),
                          border: `1px solid ${alpha(brandColors.primary, 0.14)}`,
                        }}
                      >
                        <FiTrendingUp size={12} color={brandColors.primary} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: brandColors.primary,
                            fontSize: '0.75rem',
                          }}
                        >
                          {item.metric}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Realistic Review Body */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: brandColors.dark,
                        lineHeight: 1.7,
                        fontSize: '0.93rem',
                        flexGrow: 1,
                        mb: 3,
                        fontStyle: 'normal',
                      }}
                    >
                      "{item.quote}"
                    </Typography>

                    {/* Classmate Info Footer */}
                    <Box sx={{ pt: 2, borderTop: `1px solid ${alpha(brandColors.border, 0.7)}` }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 44,
                            height: 44,
                            bgcolor: item.avatarBg,
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          }}
                        >
                          {item.avatar}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={0.6}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: brandColors.text,
                                fontSize: '0.92rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.name}
                            </Typography>
                            <FiLinkedin size={13} color="#0A66C2" />
                          </Stack>
                          <Typography
                            variant="caption"
                            sx={{
                              color: brandColors.muted,
                              display: 'block',
                              fontSize: '0.78rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.role}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>
    </Box>
  )
}
