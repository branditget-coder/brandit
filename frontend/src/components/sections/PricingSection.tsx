import { Box, Container, Typography, Grid, Button, Chip, Divider, Stack, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiCheck, FiArrowRight, FiZap, FiInfo } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'

const plans = [
  {
    id: 'setup-advice',
    name: 'Profile Setup & Advice',
    tagline: 'Complete profile setup & growth advice',
    priceText: '₹99',
    billingPeriod: 'one-time fee',
    popular: false,
    color: brandColors.muted,
    features: [
      'Complete LinkedIn Profile Audit',
      'Structural Profile & Banner Setup',
      'Headline & Bio Optimization',
      'Account Building & Content Advice',
      'ATS & Industry Keyword Alignment',
    ],
  },
  {
    id: 'branding-basic',
    name: 'Profile Setup + Branding',
    tagline: 'Profile setup with monthly content publishing',
    priceText: '₹320',
    billingPeriod: '/ month',
    popular: false,
    color: brandColors.primary,
    features: [
      'Everything in Profile Setup Plan',
      '8 High-Impact Posts / month (2 posts/week)',
      'Personal Brand Strategy & Tone Definition',
      'Engaging Formatting & Visual Guidance',
      'Monthly Brand Performance Insights',
    ],
  },
  {
    id: 'branding-network',
    name: 'Branding + Network Growth',
    tagline: 'Full profile, 8 posts/mo & outreach engine',
    priceText: '₹400',
    billingPeriod: '/ month',
    popular: true,
    color: brandColors.dark,
    features: [
      'Everything in Profile Setup + Branding Plan',
      '8 Strategy-Backed Posts / month',
      'Targeted Cold Messages & Outreach',
      'Connection Strategy & Follow-up Execution',
      '1-on-1 Strategic Network Positioning',
    ],
  },
  {
    id: 'linkedin-consulting',
    name: 'LinkedIn Consulting',
    tagline: 'Strategic 1-on-1 career & branding guidance',
    priceText: '₹250',
    billingPeriod: '/ month*',
    popular: false,
    color: brandColors.muted,
    notes: '* Pricing amendments can be made depending on how frequently you need consulting.',
    features: [
      'Dedicated 1-on-1 Strategic Sessions',
      'Custom Positioning & Career Brand Strategy',
      'Profile Review & Content Q&A',
      'Flexible frequency options based on goals',
    ],
  },
]

export default function PricingSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 14 }, backgroundColor: '#fff' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography variant="caption" sx={{ color: brandColors.primary, display: 'block', mb: 1.5, letterSpacing: '0.1em', fontWeight: 700 }}>
              TRANSPARENT PRICING
            </Typography>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Simple Plans.{' '}
              <Box component="span" sx={{ color: brandColors.primary }}>
                Real Career Results.
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 580, mx: 'auto', color: brandColors.muted }}>
              Choose the exact service level you need. Clear pricing with zero hidden fees or fluff.
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3} alignItems="stretch">
          {plans.map((plan, i) => (
            <Grid item xs={12} sm={6} md={3} key={plan.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ height: '100%' }}
              >
                <Box
                  sx={{
                    p: { xs: 3, sm: 3.5 },
                    borderRadius: '20px',
                    border: plan.popular ? `2px solid ${brandColors.primary}` : `1px solid ${brandColors.border}`,
                    backgroundColor: plan.popular ? brandColors.dark : '#fff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    boxShadow: plan.popular ? '0 16px 48px rgba(10,102,194,0.18)' : 'none',
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="Best Value"
                      icon={<FiZap size={12} />}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -13,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: brandColors.primary,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        px: 1,
                      }}
                    />
                  )}

                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="h6" sx={{ color: plan.popular ? '#fff' : brandColors.text, fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: plan.popular ? 'rgba(255,255,255,0.65)' : brandColors.muted, fontSize: '0.8rem', minHeight: 36 }}>
                      {plan.tagline}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography variant="h3" sx={{ color: plan.popular ? '#fff' : brandColors.text, fontWeight: 800 }}>
                        {plan.priceText}
                      </Typography>
                      <Typography variant="caption" sx={{ color: plan.popular ? 'rgba(255,255,255,0.6)' : brandColors.muted, fontWeight: 600 }}>
                        {plan.billingPeriod}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: plan.popular ? 'rgba(255,255,255,0.12)' : brandColors.border, mb: 2.5 }} />

                  <Stack spacing={1.5} sx={{ flexGrow: 1, mb: 3 }}>
                    {plan.features.map((f) => (
                      <Box key={f} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                        <Box sx={{ pt: 0.2 }}>
                          <FiCheck size={15} color={plan.popular ? brandColors.success : brandColors.primary} />
                        </Box>
                        <Typography variant="body2" sx={{ color: plan.popular ? 'rgba(255,255,255,0.85)' : brandColors.text, fontSize: '0.825rem', lineHeight: 1.4 }}>
                          {f}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  {plan.notes && (
                    <Box sx={{ mb: 2.5, p: 1.2, borderRadius: '8px', backgroundColor: plan.popular ? 'rgba(255,255,255,0.06)' : alpha(brandColors.primary, 0.04), display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <FiInfo size={14} color={plan.popular ? brandColors.primary : brandColors.primary} style={{ marginTop: 2, flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ color: plan.popular ? 'rgba(255,255,255,0.7)' : brandColors.muted, fontSize: '0.75rem', lineHeight: 1.3 }}>
                        {plan.notes}
                      </Typography>
                    </Box>
                  )}

                  <Button
                    component={RouterLink}
                    to={`/book?plan=${plan.id}`}
                    variant={plan.popular ? 'contained' : 'outlined'}
                    fullWidth
                    size="medium"
                    endIcon={<FiArrowRight />}
                    sx={plan.popular ? {
                      backgroundColor: '#fff',
                      color: brandColors.primary,
                      fontWeight: 700,
                      '&:hover': { backgroundColor: '#f8fafc', boxShadow: '0 4px 12px rgba(255,255,255,0.3)' },
                    } : {
                      borderColor: brandColors.border,
                      color: brandColors.text,
                      fontWeight: 600,
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
