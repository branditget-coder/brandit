import { useState } from 'react'
import {
  Box, Container, Typography, Grid, Button, Chip, Divider, Stack,
  TextField, InputAdornment, alpha, Paper
} from '@mui/material'
import { motion } from 'framer-motion'
import { FiCheck, FiArrowRight, FiZap, FiInfo, FiSliders, FiStar } from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { brandColors } from '../../theme'

const plans = [
  {
    id: 'setup-advice',
    name: 'Profile Setup & Advice',
    tagline: 'Complete one-time profile makeover to impress recruiters',
    priceText: '₹129',
    rawPrice: 129,
    billingPeriod: 'one-time fee',
    popular: false,
    color: brandColors.muted,
    features: [
      'Full Profile Audit & Health Review (Find what needs fixing)',
      'Custom Header Banner Design (Clean, high-impact visuals)',
      'Recruiter-Friendly Headline & Bio (Stand out in searches)',
      'Keyword Optimization (Get found when HRs search your role)',
      'Step-by-Step Growth Blueprint (Clear guide to get more views)',
    ],
  },
  {
    id: 'branding-basic',
    name: 'Profile Setup + Branding',
    tagline: 'Full profile makeover + 8 posts written for you every month',
    priceText: '₹349',
    rawPrice: 349,
    billingPeriod: '/ month',
    popular: false,
    color: brandColors.primary,
    features: [
      'Everything in Profile Setup (₹129 plan included free)',
      '8 Done-For-You Posts / Month (We write 2 posts every week)',
      'Tailored Content Strategy (Written in your voice & industry)',
      'Engaging Formatting & Hooks (Carousels & ideas that get likes)',
      'Monthly Progress Report (Track your views, reach & growth)',
    ],
  },
  {
    id: 'branding-network',
    name: 'Branding + Network Growth',
    tagline: 'Done-for-you growth: profile, content & recruiter outreach',
    priceText: '₹499',
    rawPrice: 499,
    billingPeriod: '/ month',
    popular: true,
    color: brandColors.dark,
    features: [
      'Everything in Setup + Branding (₹349 plan included free)',
      '8 Strategy-Backed Posts / Month (Build your industry authority)',
      'Targeted Cold Messaging (Intro messages sent to HRs & leaders)',
      'Connection Growth & Follow-ups (Expand with relevant contacts)',
      'Turn Views into Opportunities (Convert profile reach into interviews)',
    ],
  },
  {
    id: 'linkedin-consulting',
    name: 'LinkedIn Consulting',
    tagline: 'Private 1-on-1 live call for personalized career guidance',
    priceText: '₹249',
    rawPrice: 249,
    billingPeriod: '/ month*',
    popular: false,
    color: brandColors.muted,
    notes: '* Pricing amendments can be made depending on how frequently you need consulting.',
    features: [
      'Dedicated 1-on-1 Live Strategy Call (Direct with an expert)',
      'Live Profile & Resume Review (Instant, actionable feedback)',
      'Career Strategy & Job Search Q&A (Personalized advice)',
      'Clear Post-Call Action Plan (Step-by-step roadmap to execute)',
    ],
  },
]

const quickTopupAmounts = [50, 100, 200, 500, 1000]

export default function PricingSection() {
  const navigate = useNavigate()
  const [customAmount, setCustomAmount] = useState<string>('100')

  const parsedAmount = Math.max(1, parseInt(customAmount, 10) || 0)

  const handleProceedCustom = () => {
    navigate(`/book?plan=custom-amount&amount=${parsedAmount}`)
  }

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

        {/* Standard Tier Grid */}
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: { xs: 6, md: 8 } }}>
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
                    borderRadius: '24px',
                    border: plan.popular
                      ? `1.5px solid ${brandColors.primary}`
                      : `1px solid rgba(255, 255, 255, 0.9)`,
                    backgroundColor: plan.popular
                      ? '#0F172A'
                      : 'rgba(255, 255, 255, 0.82)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    boxShadow: plan.popular
                      ? '0 20px 50px -10px rgba(10, 102, 194, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                      : '0 10px 30px -4px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: plan.popular
                        ? '0 28px 60px -10px rgba(10, 102, 194, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                        : '0 20px 40px -8px rgba(10, 102, 194, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
                      borderColor: plan.popular
                        ? brandColors.secondary
                        : alpha(brandColors.primary, 0.35),
                    }
                  }}
                >
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.6,
                        px: 1.8,
                        py: 0.45,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #0A66C2 0%, #2563EB 100%)',
                        boxShadow: '0 8px 20px -2px rgba(10, 102, 194, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        letterSpacing: '0.04em',
                        whiteSpace: 'nowrap',
                        zIndex: 2,
                      }}
                    >
                      <FiStar size={12} fill="#FDE047" color="#FDE047" />
                      <span>BEST SELLER</span>
                    </Box>
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

        {/* ── INTERACTIVE CUSTOM TOP-UP SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: '26px',
              border: `1.5px solid rgba(255, 255, 255, 0.95)`,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(239, 246, 255, 0.78) 100%)',
              backdropFilter: 'blur(24px) saturate(190%)',
              WebkitBackdropFilter: 'blur(24px) saturate(190%)',
              boxShadow: '0 16px 45px -8px rgba(10, 102, 194, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
            }}
          >
            <Grid container spacing={4} alignItems="center">
              {/* Left Column: Context & Quick Select */}
              <Grid item xs={12} md={7}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      backgroundColor: brandColors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <FiSliders size={20} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text }}>
                    Custom Top-Up for Any Amount
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3, lineHeight: 1.6 }}>
                  Need custom advisory hours, tailored services, or want to pay an agreed amount? Enter any price you wish and pay directly with instant confirmation.
                </Typography>

                {/* Quick Select Chips */}
                <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.text, letterSpacing: '0.04em', display: 'block', mb: 1.5 }}>
                  QUICK SELECT AMOUNT:
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                  {quickTopupAmounts.map((amt) => {
                    const isSelected = customAmount === amt.toString()
                    return (
                      <Chip
                        key={amt}
                        label={`₹${amt}`}
                        clickable
                        onClick={() => setCustomAmount(amt.toString())}
                        variant={isSelected ? 'filled' : 'outlined'}
                        color="primary"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          px: 1,
                          py: 2,
                          borderRadius: '10px',
                          borderWidth: isSelected ? '2px' : '1px',
                        }}
                      />
                    )
                  })}
                </Stack>

                <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap sx={{ color: brandColors.muted, fontSize: '0.85rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <FiCheck color={brandColors.primary} />
                    <span>Any price accepted</span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <FiCheck color={brandColors.primary} />
                    <span>Instant booking sync</span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <FiCheck color={brandColors.primary} />
                    <span>Official receipt</span>
                  </Box>
                </Stack>
              </Grid>

              {/* Right Column: Interactive Custom Amount Input & Checkout */}
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    p: { xs: 3, sm: 3.5 },
                    borderRadius: '20px',
                    backgroundColor: '#fff',
                    border: `1px solid ${brandColors.border}`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: brandColors.text, mb: 2 }}>
                    Enter Custom Amount
                  </Typography>

                  {/* Amount Input */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, display: 'block', mb: 0.8 }}>
                      AMOUNT PAYABLE (INR)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 100"
                      inputProps={{ min: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontWeight: 800, color: brandColors.primary, fontSize: '1.3rem' }}>
                              ₹
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '14px',
                          fontSize: '1.25rem',
                          fontWeight: 800,
                        },
                      }}
                    />
                  </Box>

                  {/* Action Button */}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleProceedCustom}
                    disabled={!parsedAmount || parsedAmount < 1}
                    endIcon={<FiArrowRight />}
                    sx={{
                      py: 1.6,
                      borderRadius: '14px',
                      fontWeight: 800,
                      fontSize: '1rem',
                      textTransform: 'none',
                      backgroundColor: brandColors.primary,
                      boxShadow: '0 8px 24px rgba(10,102,194,0.25)',
                      '&:hover': { backgroundColor: '#084e96' },
                    }}
                  >
                    Proceed to Pay ₹{parsedAmount || '0'}
                  </Button>

                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: brandColors.muted, mt: 1.5, fontSize: '0.75rem' }}>
                    🔒 Secure GPay UPI verification & direct booking confirmation
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
}
