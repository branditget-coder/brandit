import {
  Box,
  Container,
  Typography,
  alpha,
  Rating,
  Avatar,
  Chip,
  Stack,
} from '@mui/material'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiLinkedin, FiTrendingUp, FiMessageSquare, FiUsers } from 'react-icons/fi'
import { brandColors } from '../../theme'

export interface TestimonialItem {
  id: string
  name: string
  role: string
  avatar: string
  avatarBg: string
  metric: string
  quote: string
  rating: number
}

// Row 1: 5 Classmates
const row1Testimonials: TestimonialItem[] = [
  {
    id: 'jatin-budhwar',
    name: 'Jatin Budhwar',
    role: 'MBA Candidate • Marketing & Tech',
    avatar: 'JB',
    avatarBg: '#0A66C2',
    metric: '1,200+ Connections & 3x Reach',
    quote:
      "Before our internship placements started, my LinkedIn was basically dead with barely 200 connections. Brandit helped me fix my headline, clean up my about section, and showed me how to cold message alumni properly. Within two weeks my connection requests actually started getting accepted and my profile reach literally tripled. Really helped me stand out in college.",
    rating: 5,
  },
  {
    id: 'sachit-bhandari',
    name: 'Sachit Bhandari',
    role: 'MBA Candidate • Marketing & Strategy',
    avatar: 'SB',
    avatarBg: '#2563EB',
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
    metric: '50% Cold DM Reply Rate',
    quote:
      "I used to send cold messages to recruiters and alumni on LinkedIn and was constantly left on seen. Brandit gave me simple, crisp cold messaging templates and tweaked my summary so people instantly understood what roles I was targeting. Started getting genuine replies from senior alumni within days.",
    rating: 5,
  },
  {
    id: 'aman-govind-rao',
    name: 'Aman Govind Rao',
    role: 'MBA Candidate • Sales & Business Dev',
    avatar: 'AG',
    avatarBg: '#D97706',
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
    metric: '4x Profile Views During Placements',
    quote:
      "When placement week is around the corner, having a polished LinkedIn makes a huge difference. BrandIt helped me showcase my committee work, case competition presentations, and certifications. My profile looked 10x cleaner than other students' and profile views shot up 4x during placement drives.",
    rating: 5,
  },
]

// Row 2: 4 Classmates
const row2Testimonials: TestimonialItem[] = [
  {
    id: 'anushka-sahu',
    name: 'Anushka Sahu',
    role: 'MBA Candidate • Human Resources',
    avatar: 'AS',
    avatarBg: '#DB2777',
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
    metric: 'Alumni Referrals & Connection Growth',
    quote:
      "My biggest struggle was how to explain my pre-MBA work experience without making it sound boring. Brandit sat down with me, cut out all the extra clutter, and made the bullet points sharp and impact-driven. Got noticed by alumni in top supply chain firms when I reached out for referral guidance.",
    rating: 5,
  },
  {
    id: 'aaryan-kapoor',
    name: 'Aaryan Kapoor',
    role: 'MBA Candidate • Finance',
    avatar: 'AK',
    avatarBg: '#4F46E5',
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
    metric: 'Stood Out in Summer Placement Interviews',
    quote:
      "Simple, honest, and zero fluff. They didn't use any fancy buzzwords, just helped me sound like a sharp MBA student who knows what he brings to the table. Two of my summer placement interviewers actually brought up points directly from my LinkedIn profile during the interview.",
    rating: 5,
  },
]

interface MarqueeRowProps {
  items: TestimonialItem[]
  speedSeconds?: number
}

function MarqueeRow({ items, speedSeconds = 48 }: MarqueeRowProps) {
  // Duplicate array 3 times to guarantee a seamless, gap-free infinite loop on any screen resolution
  const duplicated = [...items, ...items, ...items]

  return (
    <Box
      sx={{
        overflow: 'hidden',
        py: 1.5,
        display: 'flex',
        width: '100%',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 2.5, md: 3 },
          width: 'max-content',
          animation: `marqueeScroll ${speedSeconds}s linear infinite`,
          willChange: 'transform',
          '&:hover': {
            animationPlayState: 'paused',
          },
          '@keyframes marqueeScroll': {
            '0%': {
              transform: 'translate3d(0, 0, 0)',
            },
            '100%': {
              transform: 'translate3d(-33.333%, 0, 0)',
            },
          },
        }}
      >
        {duplicated.map((item, idx) => (
          <Box
            key={`${item.id}-${idx}`}
            sx={{
              width: { xs: 300, sm: 350, md: 380 },
              flexShrink: 0,
              p: { xs: 2.8, md: 3.2 },
              borderRadius: '24px',
              border: `1px solid ${brandColors.border}`,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 16px 36px -10px rgba(10, 102, 194, 0.16)',
                borderColor: alpha(brandColors.primary, 0.4),
              },
            }}
          >
            {/* Header: Verified Tag & Stars */}
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

              {/* Metric Tag */}
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
                    fontSize: '0.74rem',
                  }}
                >
                  {item.metric}
                </Typography>
              </Box>
            </Box>

            {/* Testimonial Quote */}
            <Typography
              variant="body2"
              sx={{
                color: brandColors.dark,
                lineHeight: 1.68,
                fontSize: '0.91rem',
                flexGrow: 1,
                mb: 3,
                fontStyle: 'normal',
              }}
            >
              "{item.quote}"
            </Typography>

            {/* Footer: Classmate Info */}
            <Box sx={{ pt: 2, borderTop: `1px solid ${alpha(brandColors.border, 0.7)}` }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 42,
                    height: 42,
                    bgcolor: item.avatarBg,
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.92rem',
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
                        fontSize: '0.91rem',
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
                      fontSize: '0.76rem',
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
        ))}
      </Box>
    </Box>
  )
}

export default function TestimonialsSection() {
  return (
    <Box
      id="testimonials"
      sx={{
        py: { xs: 9, md: 14 },
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient lighting */}
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

      <Container maxWidth="lg" sx={{ mb: { xs: 4, md: 6 } }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center' }}>
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
      </Container>

      {/* Infinite Horizontal Smooth Marquee Wrapper */}
      <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {/* Left & Right Smooth Edge Fade Masks */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: { xs: 36, sm: 80, md: 140 },
            background: 'linear-gradient(to right, #FFFFFF 20%, rgba(255,255,255,0) 100%)',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: { xs: 36, sm: 80, md: 140 },
            background: 'linear-gradient(to left, #FFFFFF 20%, rgba(255,255,255,0) 100%)',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        {/* Marquee Row 1 (Right to Left - Slow and Smooth) */}
        <MarqueeRow items={row1Testimonials} speedSeconds={46} />

        {/* Marquee Row 2 (Right to Left - Gently Offset Speed for Parallax Motion) */}
        <MarqueeRow items={row2Testimonials} speedSeconds={40} />
      </Box>
    </Box>
  )
}
