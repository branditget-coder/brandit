import PricingSection from '../../components/sections/PricingSection'
import CTABannerSection from '../../components/sections/CTABannerSection'
import { Box, Container, Typography, Chip, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { brandColors } from '../../theme'

export default function PricingPage() {
  return (
    <Box>
      <Box sx={{ py: { xs: 10, md: 14 }, backgroundColor: brandColors.background, textAlign: 'center' }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Chip label="PRICING" sx={{ mb: 3, backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 600 }} />
            <Typography variant="h1" sx={{ mb: 3 }}>
              Simple, Transparent{' '}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Pricing
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, maxWidth: 480, mx: 'auto' }}>
              No surprises. No hidden fees. Choose the plan that fits your goals — upgrade or cancel anytime.
            </Typography>
          </motion.div>
        </Container>
      </Box>
      <PricingSection />
      <CTABannerSection />
    </Box>
  )
}
