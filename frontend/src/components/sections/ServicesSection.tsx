import { Box, Container, Grid, Typography, Button, Stack, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiLinkedin, FiFeather, FiUsers, FiCompass, FiArrowRight, FiCheck } from 'react-icons/fi'
import { brandColors } from '../../theme'
import { Link as RouterLink } from 'react-router-dom'

const services = [
  {
    icon: FiLinkedin,
    title: 'Profile Setup + Account Building Advice',
    badge: 'Profile Foundation',
    description: 'Complete LinkedIn profile overhaul, high-impact banner alignment, headline optimization, and tailored growth blueprint advice.',
    highlights: [
      'Complete LinkedIn Profile Audit & Overhaul',
      'High-Impact Banner & Bio Optimization',
      'Keyword & Search Algorithm Alignment',
    ],
    color: '#EFF6FF',
    iconColor: brandColors.primary,
    id: 'setup-advice',
  },
  {
    icon: FiFeather,
    title: 'Profile Setup + Personal Branding',
    badge: 'Content & Authority',
    description: 'Full profile setup combined with 8 strategy-backed posts/month (2 posts/week) to consistently build your industry authority.',
    highlights: [
      'Everything in Profile Setup',
      '8 High-Impact Posts / Month (2/week)',
      'Brand Voice, Hooks & Engagement Blueprint',
    ],
    color: '#F0FDFA',
    iconColor: '#0D9488',
    id: 'branding-basic',
  },
  {
    icon: FiUsers,
    title: 'Branding + Network Growth Engine',
    badge: 'Outreach & Pipeline',
    description: 'Full profile setup, 8 monthly posts, plus cold messaging, targeted outreach, and follow-up management to land opportunities.',
    highlights: [
      'Full Profile Setup + 8 Monthly Strategy Posts',
      'Targeted Cold Messaging & Outbound Sequences',
      'Follow-Up Execution & Inbound Opportunity Management',
    ],
    color: '#F5F3FF',
    iconColor: '#7C3AED',
    id: 'branding-network',
  },
  {
    icon: FiCompass,
    title: 'LinkedIn Advisory & Consulting',
    badge: '1-on-1 Advisory',
    description: 'Dedicated 1-on-1 strategic consulting sessions. Personalized advisory tailored to your exact career and industry growth trajectory.',
    highlights: [
      'Dedicated 1-on-1 Strategic Consulting Sessions',
      'Career Positioning & Authority Playbook',
      'Customized Session Schedule & Action Items',
    ],
    color: '#FFF7ED',
    iconColor: '#D97706',
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
              CORE SERVICE CAPABILITIES
            </Typography>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Everything You Need to{' '}
              <Box component="span" sx={{ color: brandColors.primary }}>
                Dominate LinkedIn
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 560, mx: 'auto', color: brandColors.muted }}>
              Four specialized, high-ROI programs designed specifically for career professionals, founders, and creators.
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
                style={{ height: '100%' }}
              >
                <Box
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: '20px',
                    border: `1px solid ${brandColors.border}`,
                    backgroundColor: '#fff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      boxShadow: `0 14px 36px -4px ${alpha(service.iconColor, 0.12)}, 0 4px 12px rgba(15, 23, 42, 0.04)`,
                      borderColor: alpha(service.iconColor, 0.4),
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Box>
                    {/* Header Row: Icon + Deliverables Badge */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: '12px',
                          backgroundColor: service.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${alpha(service.iconColor, 0.2)}`,
                        }}
                      >
                        <service.icon size={22} color={service.iconColor} />
                      </Box>
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '100px',
                          backgroundColor: service.color,
                          border: `1px solid ${alpha(service.iconColor, 0.25)}`,
                          color: service.iconColor,
                          fontSize: '0.72rem',
                          fontWeight: 750,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {service.badge}
                      </Box>
                    </Box>

                    {/* Title & Description */}
                    <Typography variant="h5" sx={{ mb: 1, color: brandColors.text, fontWeight: 750, fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.65, mb: 2.5 }}>
                      {service.description}
                    </Typography>

                    {/* Deliverables Checklist */}
                    <Box sx={{ mb: 3, pt: 2, borderTop: `1px dashed ${brandColors.border}` }}>
                      <Stack spacing={1.2}>
                        {service.highlights.map((h) => (
                          <Box key={h} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FiCheck size={14} color={service.iconColor} style={{ flexShrink: 0 }} />
                            <Typography sx={{ fontSize: '0.82rem', color: brandColors.text, fontWeight: 550, lineHeight: 1.35 }}>
                              {h}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Box>

                  {/* Action Button */}
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
                      borderRadius: '10px',
                      px: 2.5,
                      py: 1,
                      '&:hover': {
                        borderColor: service.iconColor,
                        color: service.iconColor,
                        backgroundColor: alpha(service.iconColor, 0.04),
                      },
                    }}
                  >
                    Select Program
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
