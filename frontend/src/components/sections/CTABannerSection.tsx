import { Box, Container, Typography, Button, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'

export default function CTABannerSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#fff' }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 5, md: 8 },
              borderRadius: '28px',
              backgroundColor: brandColors.dark,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-30%',
                left: '-10%',
                width: '60%',
                height: '120%',
                background: `radial-gradient(circle, ${alpha(brandColors.primary, 0.3)} 0%, transparent 60%)`,
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-30%',
                right: '-10%',
                width: '50%',
                height: '100%',
                background: `radial-gradient(circle, ${alpha(brandColors.secondary, 0.2)} 0%, transparent 60%)`,
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: alpha('#fff', 0.6), display: 'block', mb: 2, letterSpacing: '0.1em', fontWeight: 700 }}
              >
                START BUILDING YOUR BRAND
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color: '#fff',
                  mb: 2.5,
                  background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ready to Select Your BrandIt Package?
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: alpha('#fff', 0.65), mb: 4, maxWidth: 520, mx: 'auto' }}
              >
                Choose from our transparent services starting at ₹99. Tailored personal branding and outreach built to open real opportunities.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={RouterLink}
                  to="/book"
                  variant="contained"
                  size="large"
                  startIcon={<FiCheckCircle />}
                  endIcon={<FiArrowRight />}
                  sx={{
                    backgroundColor: '#fff',
                    color: brandColors.primary,
                    fontWeight: 700,
                    px: 4,
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      boxShadow: '0 8px 32px rgba(255,255,255,0.25)',
                    },
                  }}
                >
                  Choose Package
                </Button>
                <Button
                  component={RouterLink}
                  to="/pricing"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    borderColor: alpha('#fff', 0.3),
                    color: '#fff',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: alpha('#fff', 0.6),
                      backgroundColor: alpha('#fff', 0.08),
                    },
                  }}
                >
                  View Pricing
                </Button>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
