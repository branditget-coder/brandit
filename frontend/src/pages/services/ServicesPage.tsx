import { Box, Container, Typography, Grid, Button, Chip, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiArrowRight, FiLinkedin, FiFeather, FiUsers, FiCompass, FiStar } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'
import SEO from '../../components/common/SEO'

const services = [
  {
    icon: FiLinkedin, id: 'setup-advice', title: 'Profile Setup + Account Building Advice',
    price: '₹129', period: 'one-time fee',
    description: 'A complete structural profile overhaul for professionals and freshers. Includes headline optimization, bio alignment, keyword insertion, and a step-by-step account building roadmap.',
    deliverables: ['LinkedIn Profile Audit & Diagnostics', 'Optimized Headline & Custom Bio', 'Banner & Visual Alignment', 'ATS & Industry Keyword Tagging', 'Account Growth & Strategy Blueprint'],
    color: '#EFF6FF', iconColor: brandColors.primary,
  },
  {
    icon: FiFeather, id: 'branding-basic', title: 'Profile Setup + Personal Branding',
    price: '₹349', period: '/ month',
    description: 'Combines the complete profile setup package with monthly content publishing. We craft and schedule 8 strategy-backed posts every month (2 posts/week) to establish your industry authority.',
    deliverables: ['Everything in Profile Setup Plan', '8 Thought Leadership Posts / month', 'Brand Voice & Tone Calibration', 'Visual Formatting & Carousels', 'Monthly Performance Insights'],
    color: '#F0FDF4', iconColor: brandColors.success,
  },
  {
    icon: FiUsers, id: 'branding-network', title: 'Profile Setup + Personal Branding + Network Growth',
    price: '₹499', period: '/ month',
    description: 'Our most popular end-to-end growth package. Includes profile setup, 8 posts/month, plus proactive cold messaging, targeted outreach, and follow-ups to turn profile views into opportunities.',
    deliverables: ['Everything in Profile Setup + Branding Plan', '8 Strategy-Backed Posts / month', 'Cold Messaging & Outreach Campaign', 'Connection Growth & Lead Follow-ups', '1-on-1 Strategic Network Positioning'],
    color: '#FFF7ED', iconColor: '#F59E0B',
  },
  {
    icon: FiCompass, id: 'linkedin-consulting', title: 'LinkedIn Consulting & Advisory',
    price: '₹249', period: '/ month*',
    description: 'Dedicated 1-on-1 strategic consulting for executives, founders, and ambitious career seekers. Note: Pricing amendments can be made depending on how frequently you need consulting.',
    deliverables: ['1-on-1 Strategic Consultation Sessions', 'Career Brand Positioning Review', 'Content Strategy & Campaign Feedback', 'Customized Frequency & Schedule Options'],
    color: '#F5F3FF', iconColor: '#7C3AED',
  },
]

export default function ServicesPage() {
  return (
    <Box>
      <SEO
        title="Our Services — LinkedIn Optimization, Content & Growth"
        description="Explore BrandIt's 4 core service packages: Profile Setup & Audit, Monthly Strategy Content Publishing, Network Growth & Outreach, and 1-on-1 Consulting."
        keywords="LinkedIn optimization services, LinkedIn content writing, personal branding services, executive career consulting"
        canonicalUrl="https://go-brandit.vercel.app/services"
      />
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
                  <Box
                    sx={{
                      p: 4,
                      borderRadius: '24px',
                      border: s.id === 'branding-network'
                        ? '2px solid rgba(124, 58, 237, 0.5)'
                        : `1px solid ${brandColors.border}`,
                      backgroundColor: s.id === 'branding-network' ? '#FAF5FF' : '#fff',
                      boxShadow: s.id === 'branding-network' ? '0 16px 45px rgba(124, 58, 237, 0.12)' : 'none',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        boxShadow: s.id === 'branding-network' ? '0 20px 50px rgba(124, 58, 237, 0.22)' : '0 12px 40px rgba(0,0,0,0.08)',
                        transform: 'translateY(-3px)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ width: 52, height: 52, borderRadius: '14px', backgroundColor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <s.icon size={24} color={s.iconColor} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {s.id === 'branding-network' && (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              px: 1.3,
                              py: 0.4,
                              borderRadius: '100px',
                              background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                              color: '#fff',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              letterSpacing: '0.04em',
                              boxShadow: '0 2px 10px rgba(124, 58, 237, 0.35)',
                            }}
                          >
                            <FiStar size={11} fill="#FDE047" color="#FDE047" />
                            <span>BEST SELLER</span>
                          </Box>
                        )}
                        <Chip
                          label={`${s.price} ${s.period}`}
                          size="medium"
                          sx={{
                            backgroundColor: s.id === 'branding-network' ? 'rgba(124, 58, 237, 0.12)' : alpha(s.iconColor, 0.08),
                            color: s.id === 'branding-network' ? '#7C3AED' : s.iconColor,
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            border: s.id === 'branding-network' ? '1px solid rgba(124, 58, 237, 0.3)' : 'none',
                          }}
                        />
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
                      <Button
                        component={RouterLink}
                        to={`/book?plan=${s.id}`}
                        variant="contained"
                        size="large"
                        fullWidth
                        endIcon={<FiArrowRight />}
                        sx={{
                          ...(s.id === 'branding-network' ? {
                            background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
                            fontWeight: 800,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #6D28D9 0%, #1D4ED8 100%)',
                              boxShadow: '0 10px 28px rgba(124, 58, 237, 0.5)',
                            }
                          } : {
                            backgroundColor: brandColors.primary,
                          })
                        }}
                      >
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
