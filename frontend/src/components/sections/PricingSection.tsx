import { useState } from 'react'
import {
  Box, Container, Typography, Grid, Button, Chip, Divider, Stack,
  TextField, InputAdornment, alpha, Paper
} from '@mui/material'
import { motion } from 'framer-motion'
import { FiCheck, FiArrowRight, FiZap, FiInfo, FiSliders, FiRefreshCw } from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { brandColors } from '../../theme'

const plans = [
  {
    id: 'setup-advice',
    name: 'Profile Setup & Advice',
    tagline: 'Complete profile setup & growth advice',
    priceText: '₹99',
    rawPrice: 99,
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
    rawPrice: 320,
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
    rawPrice: 400,
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
    rawPrice: 250,
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

const upgradeScenarios = [
  { from: '₹250 Consulting', to: '₹320 Setup + Branding', diff: 70, note: 'Upgrade from ₹250 Consulting to ₹320 Branding Plan' },
  { from: '₹99 Profile Setup', to: '₹320 Setup + Branding', diff: 221, note: 'Upgrade from ₹99 Setup to ₹320 Branding Plan' },
  { from: '₹320 Setup + Branding', to: '₹400 Network Growth', diff: 80, note: 'Upgrade from ₹320 Branding to ₹400 Network Growth' },
  { from: '₹99 Profile Setup', to: '₹400 Network Growth', diff: 301, note: 'Upgrade from ₹99 Setup to ₹400 Network Growth' },
]

export default function PricingSection() {
  const navigate = useNavigate()
  const [customAmount, setCustomAmount] = useState<string>('70')
  const [customNote, setCustomNote] = useState<string>('Plan Upgrade Difference (₹250 to ₹320)')

  const parsedAmount = Math.max(1, parseInt(customAmount, 10) || 0)

  const handleApplyPreset = (diff: number, note: string) => {
    setCustomAmount(diff.toString())
    setCustomNote(note)
  }

  const handleProceedCustom = () => {
    const encodedNote = encodeURIComponent(customNote.trim() || 'Custom Plan Upgrade / Differential Payment')
    navigate(`/book?plan=custom-amount&amount=${parsedAmount}&note=${encodedNote}`)
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

        {/* ── INTERACTIVE CUSTOM AMOUNT & PLAN UPGRADE SECTION ── */}
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
              borderRadius: '24px',
              border: `1.5px solid ${alpha(brandColors.primary, 0.25)}`,
              background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
              boxShadow: '0 12px 36px rgba(10, 102, 194, 0.06)',
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
                    Switching Plans or Need a Custom Top-Up?
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3, lineHeight: 1.6 }}>
                  If you already purchased a plan (e.g. <strong>₹250 Consulting</strong>) and wish to switch to the <strong>₹320 Branding Plan</strong>, you only need to pay the remaining <strong>₹70</strong> difference. Choose a quick upgrade below or enter your exact custom amount.
                </Typography>

                {/* Quick Upgrade Presets */}
                <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.text, letterSpacing: '0.04em', display: 'block', mb: 1.5 }}>
                  POPULAR PLAN SWITCH SCENARIOS:
                </Typography>
                <Grid container spacing={1.5}>
                  {upgradeScenarios.map((sc, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box
                        onClick={() => handleApplyPreset(sc.diff, sc.note)}
                        sx={{
                          p: 1.5,
                          borderRadius: '14px',
                          border: customAmount === sc.diff.toString()
                            ? `2px solid ${brandColors.primary}`
                            : `1px solid ${brandColors.border}`,
                          backgroundColor: customAmount === sc.diff.toString()
                            ? alpha(brandColors.primary, 0.08)
                            : '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          '&:hover': {
                            borderColor: brandColors.primary,
                            backgroundColor: alpha(brandColors.primary, 0.04),
                          },
                        }}
                      >
                        <Box sx={{ overflow: 'hidden', mr: 1 }}>
                          <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', fontSize: '0.72rem' }}>
                            {sc.from} → {sc.to}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text, fontSize: '0.85rem' }}>
                            Pay ₹{sc.diff} difference
                          </Typography>
                        </Box>
                        <FiRefreshCw size={14} color={brandColors.primary} style={{ flexShrink: 0 }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
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
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, display: 'block', mb: 0.8 }}>
                      AMOUNT PAYABLE (INR)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 70"
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

                  {/* Upgrade Note / Reason */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, display: 'block', mb: 0.8 }}>
                      REASON / PREVIOUS PLAN (OPTIONAL)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="e.g. Upgraded from ₹250 plan to ₹320 plan"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          fontSize: '0.85rem',
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
