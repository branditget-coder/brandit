import { Box, Container, Typography, Chip, Avatar, Divider, Button, alpha } from '@mui/material'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { brandColors } from '../../theme'

export default function BlogDetailPage() {
  const { slug } = useParams()

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: brandColors.background }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Button component={RouterLink} to="/blog" startIcon={<FiArrowLeft />} sx={{ mb: 4, color: brandColors.muted, '&:hover': { color: brandColors.primary, backgroundColor: 'transparent', boxShadow: 'none', transform: 'none' } }}>
            Back to Blog
          </Button>

          <Chip label="LinkedIn" size="small" sx={{ mb: 3, backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 600 }} />

          <Typography variant="h1" sx={{ mb: 3, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
            10 LinkedIn Profile Mistakes That Cost You Job Offers
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 700 }}>AK</Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>Arjun Kapoor</Typography>
                <Typography variant="caption" sx={{ color: brandColors.muted }}>Founder & Lead Strategist</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FiClock size={14} color={brandColors.muted} />
              <Typography variant="caption" sx={{ color: brandColors.muted }}>8 min read</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: brandColors.muted }}>January 15, 2025</Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 3, md: 5 }, borderRadius: '20px', border: `1px solid ${brandColors.border}`,
              backgroundColor: '#fff', mb: 5,
              '& h2': { ...{}, fontWeight: 700, fontSize: '1.4rem', color: brandColors.text, mt: 4, mb: 1.5 },
              '& p': { color: brandColors.muted, lineHeight: 1.8, mb: 2 },
              '& ul': { pl: 3, mb: 2 },
              '& li': { color: brandColors.muted, lineHeight: 1.8, mb: 0.5 },
            }}
          >
            <Typography variant="body1" sx={{ color: brandColors.muted, lineHeight: 1.9, mb: 3, fontSize: '1.05rem' }}>
              Your LinkedIn profile is working for you 24/7 — or against you. Most professionals set it up once and forget about it, losing hundreds of opportunities in the process.
            </Typography>

            <Typography variant="h3" sx={{ mb: 2, fontSize: '1.3rem', color: brandColors.text }}>
              1. A Generic, Keyword-Stuffed Headline
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, lineHeight: 1.9, mb: 3 }}>
              Most people use their job title as their headline: "Software Engineer at Infosys." This wastes prime LinkedIn real estate. Your headline should communicate your value proposition, not just your role. Example: "Senior Software Engineer | Scaling Fintech Platforms | Ex-Razorpay" — this tells a story.
            </Typography>

            <Typography variant="h3" sx={{ mb: 2, fontSize: '1.3rem', color: brandColors.text }}>
              2. No Profile Photo or a Poor Quality One
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, lineHeight: 1.9, mb: 3 }}>
              Profiles with photos get 21x more profile views and 36x more messages. Your photo should be professional, recent, high-resolution, and show your face clearly. Skip the group photo crops — they look unprofessional.
            </Typography>

            <Typography variant="h3" sx={{ mb: 2, fontSize: '1.3rem', color: brandColors.text }}>
              3. An Empty or Boring "About" Section
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, lineHeight: 1.9, mb: 3 }}>
              The About section is your chance to tell your story in the first person. Most professionals either leave it blank or write a dry, third-person bio. Use this space to share your professional journey, what you're passionate about, and what you're looking for next.
            </Typography>

            <Box sx={{ p: 3, borderRadius: '14px', backgroundColor: alpha(brandColors.primary, 0.04), border: `1px solid ${alpha(brandColors.primary, 0.15)}`, my: 3 }}>
              <Typography variant="body1" sx={{ color: brandColors.text, fontWeight: 600, mb: 0.5 }}>
                Quick Win:
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.8 }}>
                Start your About section with a hook — a bold statement or achievement that makes the reader want to scroll. Then add your story, skills, and end with a clear call to action.
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: brandColors.muted, lineHeight: 1.9 }}>
              The remaining 7 mistakes cover: weak experience descriptions, missing skills endorsements, no recommendations, ignoring the Featured section, not engaging with content, a generic connection request, and neglecting your custom URL. Each of these can be fixed in under an hour — and the results can be dramatic.
            </Typography>
          </Box>

          <Box sx={{ p: 4, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: brandColors.dark, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#fff', mb: 1.5 }}>Want us to audit your LinkedIn profile?</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>Book a free 30-minute consultation and we'll identify your biggest improvement opportunities.</Typography>
            <Button component={RouterLink} to="/book" variant="contained" endIcon={<FiArrowRight />} sx={{ backgroundColor: '#fff', color: brandColors.primary, '&:hover': { backgroundColor: '#f8fafc' } }}>
              Book Free Consultation
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
