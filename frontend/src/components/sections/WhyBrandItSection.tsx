import { Box, Container, Grid, Typography, alpha, Stack } from '@mui/material'
import { motion } from 'framer-motion'
import { FiSearch, FiTarget, FiZap, FiEye, FiTrendingUp } from 'react-icons/fi'
import { brandColors } from '../../theme'

const steps = [
  {
    icon: FiSearch,
    step: '01',
    title: 'Assessment',
    description: 'Deep-dive audit of your current LinkedIn profile, resume, and overall digital presence.',
    color: '#EFF6FF',
    iconColor: brandColors.primary,
  },
  {
    icon: FiTarget,
    step: '02',
    title: 'Strategy',
    description: 'Custom roadmap built around your career goals, target industry, and unique value proposition.',
    color: '#F0FDF4',
    iconColor: brandColors.success,
  },
  {
    icon: FiZap,
    step: '03',
    title: 'Optimization',
    description: 'Expert rewriting and restructuring of your profile, resume, and brand messaging.',
    color: '#FFF7ED',
    iconColor: '#F59E0B',
  },
  {
    icon: FiEye,
    step: '04',
    title: 'Review',
    description: 'Collaborative feedback sessions to ensure everything aligns with your vision perfectly.',
    color: '#F5F3FF',
    iconColor: '#7C3AED',
  },
  {
    icon: FiTrendingUp,
    step: '05',
    title: 'Success',
    description: 'Launch your new brand with confidence and start attracting the right opportunities.',
    color: '#FDF2F8',
    iconColor: '#EC4899',
  },
]

export default function WhyBrandItSection() {
  return (
    <Box sx={{ py: { xs: 10, md: 16 }, backgroundColor: brandColors.background }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography variant="caption" sx={{ color: brandColors.primary, display: 'block', mb: 1.5, letterSpacing: '0.1em' }}>
              OUR PROCESS
            </Typography>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Your Journey to a{' '}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Powerful Brand
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 500, mx: 'auto', color: brandColors.muted }}>
              A structured, proven process that delivers consistent results for every client, every time.
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ position: 'relative' }}>
          {/* Connector Line */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: 36,
              left: '10%',
              right: '10%',
              height: 2,
              background: `linear-gradient(90deg, ${brandColors.primary}20, ${brandColors.primary}60, ${brandColors.primary}20)`,
              zIndex: 0,
            }}
          />

          <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
            {steps.map((step, i) => (
              <Grid item xs={12} sm={6} md={12 / 5} key={step.step}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Box sx={{ textAlign: 'center', px: 1 }}>
                    {/* Icon Circle */}
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        backgroundColor: step.color,
                        border: `2px solid ${alpha(step.iconColor, 0.2)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        position: 'relative',
                        boxShadow: `0 4px 20px ${alpha(step.iconColor, 0.15)}`,
                      }}
                    >
                      <step.icon size={26} color={step.iconColor} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: step.iconColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          color: '#fff',
                        }}
                      >
                        {step.step}
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, color: brandColors.text }}>{step.title}</Typography>
                    <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.7, fontSize: '0.85rem' }}>
                      {step.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}
