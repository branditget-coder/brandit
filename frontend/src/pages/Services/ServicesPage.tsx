import { Box, Container, Typography, Grid, Button, Chip, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiArrowRight, FiLinkedin, FiFeather, FiUsers, FiCompass } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'

const services = [
  {
    icon: FiLinkedin, id: 'setup-advice', title: 'Profile Setup + Account Building Advice',
    price: '₹99', period: 'one-time fee',
    description: 'A complete structural profile overhaul for professionals and freshers. Includes headline optimization, bio alignment, keyword insertion, and a step-by-step account building roadmap.',
    deliverables: ['LinkedIn Profile Audit & Diagnostics', 'Optimized Headline & Custom Bio', 'Banner & Visual Alignment', 'ATS & Industry Keyword Tagging', 'Account Growth & Strategy Blueprint'],
    color: '#EFF6FF', iconColor: brandColors.primary,
  },
  {
    icon: FiFeather, id: 'branding-basic', title: 'Profile Setup + Personal Branding',
    price: '₹320', period: '/ month',
    description: 'Combines the complete profile setup package with monthly content publishing. We craft and schedule 8 strategy-backed posts every month (2 posts/week) to establish your industry authority.',
    deliverables: ['Everything in Profile Setup Plan', '8 Thought Leadership Posts / month', 'Brand Voice & Tone Calibration', 'Visual Formatting & Carousels', 'Monthly Performance Insights'],
    color: '#F0FDF4', iconColor: brandColors.success,
  },
  {
    icon: FiUsers, id: 'branding-network', title: 'Profile Setup + Personal Branding + Network Growth',
    price: '₹400', period: '/ month',
    description: 'Our most popular end-to-end growth package. Includes profile setup, 8 posts/month, plus proactive cold messaging, targeted outreach, and follow-ups to turn profile views into opportunities.',
    deliverables: ['Everything in Profile Setup + Branding Plan', '8 Strategy-Backed Posts / month', 'Cold Messaging & Outreach Campaign', 'Connection Growth & Lead Follow-ups', '1-on-1 Strategic Network Positioning'],
    color: '#FFF7ED', iconColor: '#F59E0B',
  },
  {
    icon: FiCompass, id: 'linkedin-consulting', title: 'LinkedIn Consulting & Advisory',
    price: '₹250', period: '/ month*',
    description: 'Dedicated 1-on-1 strategic consulting for executives, founders, and ambitious career seekers. Note: Pricing amendments can be made depending on how frequently you need consulting.',
    deliverables: ['1-on-1 Strategic Consultation Sessions', 'Career Brand Positioning Review', 'Content Strategy & Campaign Feedback', 'Customized Frequency & Schedule Options'],
    color: '#F5F3FF', iconColor: '#7C3AED',
  },
]

export default function ServicesPage() {
  return (
    <Box>
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: brandColors.background, textAlign: 'center' }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Chip label="OUR 4 EXCLUSIVE SERVICES" sx={{ mb: 2.5, backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 700 }} />
            <Typography variant="h1" sx={{ mb: 2.5 }}>
              Transparent Packages.{' '}
              <Box component="span" sx={{ color: brandColors.primary }}>
                Guaranteed Clarity.
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, maxWidth: 540, mx: 'auto' }}>
              No fluff, no vague quotes. Explore our 4 dedicated service packages designed to build your personal brand and launch your career.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {services.map((s, i) => (
              <Grid item xs={12} md={6} key={s.id} id={s.id}>
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                  <Box sx={{ p: 4, borderRadius: '24px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.25s', '&:hover': { boxShadow: '0 12px 40px rgba(0,0,0,0.08)' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ width: 52, height: 52, borderRadius: '14px', backgroundColor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <s.icon size={24} color={s.iconColor} />
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip label={`${s.price} ${s.period}`} size="medium" sx={{ backgroundColor: alpha(s.iconColor, 0.08), color: s.iconColor, fontWeight: 700, fontSize: '0.9rem' }} />
                      </Box>
                    </Box>
                    <Typography variant="h5" sx={{ mb: 1.5, color: brandColors.text, fontWeight: 700 }}>{s.title}</Typography>
                    <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.8, mb: 3 }}>{s.description}</Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 700, display: 'block', mb: 1.5, letterSpacing: '0.05em' }}>WHAT'S INCLUDED</Typography>
                      {s.deliverables.map((d) => (
                        <Box key={d} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.85 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: s.iconColor, flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ color: brandColors.text, fontSize: '0.85rem' }}>{d}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ mt: 3.5 }}>
                      <Button component={RouterLink} to={`/book?plan=${s.id}`} variant="contained" size="large" fullWidth endIcon={<FiArrowRight />}>
                        Select Package
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
