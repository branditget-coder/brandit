import { Box, Container, Grid, Typography, Button, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiLinkedin, FiFeather, FiUsers, FiCompass, FiArrowRight } from 'react-icons/fi'
import { brandColors } from '../../theme'
import { Link as RouterLink } from 'react-router-dom'

const services = [
  {
    icon: FiLinkedin,
    title: 'Profile Setup + Account Building Advice',
    price: '₹99',
    period: 'one-time',
    description: 'Complete LinkedIn profile overhaul, high-impact banner alignment, headline optimization, and tailored growth blueprint advice.',
    color: '#EFF6FF',
    iconColor: brandColors.primary,
    id: 'setup-advice',
  },
  {
    icon: FiFeather,
    title: 'Profile Setup + Personal Branding',
    price: '₹320',
    period: '/ month',
    description: 'Full profile setup combined with 8 strategy-backed posts/month (2 posts/week) to consistently build your industry authority.',
    color: '#F0FDF4',
    iconColor: brandColors.success,
    id: 'branding-basic',
  },
  {
    icon: FiUsers,
    title: 'Branding + Network Growth Engine',
    price: '₹400',
    period: '/ month',
    description: 'Full profile setup, 8 monthly posts, plus cold messaging, targeted outreach, and follow-up management to land opportunities.',
    color: '#FFF7ED',
    iconColor: '#F59E0B',
    id: 'branding-network',
  },
  {
    icon: FiCompass,
    title: 'LinkedIn Advisory & Consulting',
    price: '₹250',
    period: '/ month*',
    description: 'Dedicated 1-on-1 strategic consulting sessions. Note: Pricing amendments can be made depending on how frequently you need consulting.',
    color: '#F5F3FF',
    iconColor: '#7C3AED',
    id: 'linkedin-consulting',
  },
]

export default function ServicesSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 14 }, backgroundColor: '#fff' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography variant="caption" sx={{ color: brandColors.primary, display: 'block', mb: 1.5, letterSpacing: '0.1em', fontWeight: 700 }}>
              CORE SERVICE PACKAGES
            </Typography>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Everything You Need to{' '}
              <Box component="span" sx={{ color: brandColors.primary }}>
                Dominate LinkedIn
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 560, mx: 'auto', color: brandColors.muted }}>
              Four specialized, high-ROI programs designed specifically for career professionals and job seekers.
            </Typography>
          </Box>
        </motion.div>

        {/* Cards */}
        <Grid container spacing={3}>
          {services.map((service, i) => (
            <Grid item xs={12} sm={6} key={service.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Box
                  sx={{
                    p: { xs: 3.5, sm: 4 },
                    borderRadius: '20px',
                    border: `1px solid ${brandColors.border}`,
                    backgroundColor: '#fff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
                      borderColor: alpha(service.iconColor, 0.4),
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        backgroundColor: service.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <service.icon size={22} color={service.iconColor} />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h4" sx={{ color: brandColors.text, fontWeight: 800, lineHeight: 1 }}>
                        {service.price}
                      </Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>
                        {service.period}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h5" sx={{ mb: 1, color: brandColors.text, fontWeight: 700 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.7, flexGrow: 1, mb: 3 }}>
                    {service.description}
                  </Typography>

                  <Button
                    component={RouterLink}
                    to={`/book?plan=${service.id}`}
                    variant="outlined"
                    size="medium"
                    endIcon={<FiArrowRight />}
                    sx={{
                      borderColor: brandColors.border,
                      color: brandColors.text,
                      fontWeight: 600,
                      alignSelf: 'flex-start',
                      '&:hover': { borderColor: brandColors.primary, color: brandColors.primary, backgroundColor: alpha(brandColors.primary, 0.04) },
                    }}
                  >
                    Select Plan
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
