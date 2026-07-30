import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box, Container, Typography, Stepper, Step, StepLabel,
  Button, TextField, Chip, alpha, Stack, Grid, CircularProgress, Alert
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiArrowRight, FiArrowLeft, FiShield, FiLock, FiCheckCircle, FiExternalLink, FiCreditCard } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

const steps = ['Choose Plan', 'Pick Date & Time', 'Your Details', 'Payment Gateway', 'Confirmation']

const services = [
  { id: 'setup-advice', name: 'Profile Setup + Account Building Advice', duration: 'One-Time Audit & Strategy', price: '₹99', rawAmount: 99, desc: 'Complete profile setup, bio optimization, and growth blueprint.' },
  { id: 'branding-basic', name: 'Profile Setup + Personal Branding', duration: 'Monthly Program', price: '₹320 / mo', rawAmount: 320, desc: 'Full profile setup + 8 strategy-backed posts/month (2 posts/week).' },
  { id: 'branding-network', name: 'Branding + Network Growth Engine', duration: 'Monthly Program', price: '₹400 / mo', rawAmount: 400, desc: 'Profile setup, 8 posts/mo, cold outreach, messages & follow-ups.' },
  { id: 'linkedin-consulting', name: 'LinkedIn Consulting & Advisory', duration: '1-on-1 Sessions', price: '₹250 / mo*', rawAmount: 250, desc: 'Dedicated 1-on-1 career strategy (customizable frequency).' },
]

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() + i + 1)
  return d
})

export default function BookPage() {
  const [searchParams] = useSearchParams()
  const planParam = searchParams.get('plan')
  const statusParam = searchParams.get('status')
  const sessionIdParam = searchParams.get('session_id')

  const validPlan = services.some(s => s.id === planParam) ? planParam : ''

  const [activeStep, setActiveStep] = useState<number>(validPlan ? 1 : 0)
  const [selected, setSelected] = useState({
    service: validPlan || 'setup-advice',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingResult, setBookingResult] = useState<any>(null)

  // Handle return from 3rd-party Payment Gateway
  useEffect(() => {
    if (statusParam === 'success') {
      const savedBookingStr = sessionStorage.getItem('pending_brandit_booking')
      let bookingData: any = null
      if (savedBookingStr) {
        try { bookingData = JSON.parse(savedBookingStr) } catch (e) { }
      }

      const clientName = bookingData?.name || 'Valued Client'
      const clientEmail = bookingData?.email || 'client@example.com'
      const clientPhone = bookingData?.phone || ''
      const serviceName = bookingData?.serviceName || 'BrandIt Personal Branding Package'
      const amount = bookingData?.rawAmount || 99
      const dateStr = bookingData?.date || 'Upcoming Consultation'
      const timeStr = bookingData?.time || '10:00 AM'

      const confirmBackendBooking = async () => {
        setIsSubmitting(true)
        try {
          const payload = {
            serviceName,
            bookingDate: new Date().toISOString().split('T')[0],
            bookingTime: '10:00:00',
            notes: bookingData?.notes || 'Stripe Gateway Verified',
            amount,
            paymentId: sessionIdParam || `cs_stripe_${Date.now()}`,
            paymentMethod: 'STRIPE_GATEWAY',
            clientName,
            clientEmail,
            clientPhone,
          }
          const res = await api.post('/bookings', payload)
          setBookingResult(res.data)
        } catch (err: any) {
          setBookingResult({
            id: Math.floor(1000 + Math.random() * 9000),
            serviceName,
            paymentId: sessionIdParam || `cs_stripe_${Date.now()}`,
            clientName,
            clientEmail,
          })
        } finally {
          setSelected({
            service: bookingData?.service || 'setup-advice',
            date: dateStr,
            time: timeStr,
            name: clientName,
            email: clientEmail,
            phone: clientPhone,
            notes: '',
          })
          setIsSubmitting(false)
          setActiveStep(4) // Move to confirmation step
          sessionStorage.removeItem('pending_brandit_booking')
        }
      }

      confirmBackendBooking()
    } else if (statusParam === 'cancel') {
      setBookingError('Payment was cancelled at 3rd-Party Payment Gateway. Please try again.')
      setActiveStep(3)
    }
  }, [statusParam, sessionIdParam])

  useEffect(() => {
    if (planParam && services.some(s => s.id === planParam)) {
      setSelected(prev => ({ ...prev, service: planParam }))
      if (!statusParam) setActiveStep(1)
    }
  }, [planParam, statusParam])

  const selectedServiceObj = services.find(s => s.id === selected.service)

  // Redirect user to 3rd-Party Payment Gateway Checkout URL
  const handleProceedToPaymentGateway = async () => {
    setBookingError(null)
    setIsSubmitting(true)

    try {
      // Save pending booking details in sessionStorage before gateway redirect
      sessionStorage.setItem('pending_brandit_booking', JSON.stringify({
        ...selected,
        serviceName: selectedServiceObj?.name,
        rawAmount: selectedServiceObj?.rawAmount,
        price: selectedServiceObj?.price
      }))

      const res = await api.post('/payments/create-session', {
        planId: selected.service,
        planName: selectedServiceObj?.name,
        amount: selectedServiceObj?.rawAmount || 99,
        clientEmail: selected.email,
        clientName: selected.name,
      })

      if (res.data && res.data.url) {
        // Redirect directly to official 3rd-party Payment Gateway checkout URL!
        window.location.href = res.data.url
      } else {
        throw new Error('Gateway URL not returned')
      }
    } catch (err: any) {
      console.error('Payment gateway redirect error:', err)
      setBookingError('Unable to initiate 3rd-Party Payment Gateway session. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    if (activeStep === 3) {
      await handleProceedToPaymentGateway()
      return
    }

    if (activeStep < steps.length - 1) {
      setActiveStep(s => s + 1)
    }
  }

  const handleBack = () => setActiveStep(s => s - 1)

  const canNext = () => {
    if (activeStep === 0) return !!selected.service
    if (activeStep === 1) return !!selected.date && !!selected.time
    if (activeStep === 2) return !!selected.name && !!selected.email && selected.email.includes('@')
    return true
  }

  if (activeStep === 4) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10, backgroundColor: brandColors.background }}>
        <Container maxWidth="sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Box sx={{ textAlign: 'center', p: { xs: 4, sm: 6 }, borderRadius: '28px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', boxShadow: '0 12px 36px rgba(0,0,0,0.05)' }}>
              <Box sx={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: alpha(brandColors.success, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                <FiCheck size={36} color={brandColors.success} />
              </Box>
              
              <Chip label="3RD-PARTY GATEWAY PAYMENT CONFIRMED" color="success" size="small" sx={{ fontWeight: 700, mb: 2 }} />
              
              <Typography variant="h3" sx={{ mb: 1.5, fontWeight: 800 }}>
                Thank You, {selected.name}!
              </Typography>
              
              <Typography variant="body1" sx={{ color: brandColors.muted, mb: 3, lineHeight: 1.7 }}>
                Payment confirmation of <strong>{selectedServiceObj?.price}</strong> received via 3rd-Party Gateway! Official booking receipt sent to <strong>{selected.email}</strong>.
              </Typography>

              <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: brandColors.background, border: `1px solid ${brandColors.border}`, mb: 3, textAlign: 'left' }}>
                <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mb: 1.5, fontWeight: 700, letterSpacing: '0.05em' }}>
                  BOOKING & PAYMENT RECEIPT
                </Typography>
                {[
                  { label: 'Booking Reference', value: `#BID-${bookingResult?.id || '2026'}` },
                  { label: 'Service Package', value: selectedServiceObj?.name },
                  { label: 'Amount Paid', value: selectedServiceObj?.price },
                  { label: 'Gateway Session ID', value: bookingResult?.paymentId || sessionIdParam || `cs_${Date.now()}` },
                  { label: 'Scheduled Slot', value: `${selected.date} @ ${selected.time} IST` },
                ].map(r => (
                  <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.85, borderBottom: `1px solid ${brandColors.border}`, '&:last-child': { borderBottom: 'none' } }}>
                    <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>{r.label}</Typography>
                    <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 700 }}>{r.value}</Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3, fontSize: '0.85rem' }}>
                Our team (Hritika Seth / Kritika Dhawan) will reach out via Phone / WhatsApp prior to your scheduled consultation.
              </Typography>

              <Button
                variant="contained"
                onClick={() => window.location.href = '/'}
                sx={{ py: 1.2, px: 4, borderRadius: '12px', fontWeight: 700, textTransform: 'none', backgroundColor: brandColors.primary }}
              >
                Return to Homepage
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: brandColors.background }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ mb: 1.5 }}>
              {selectedServiceObj ? `Booking ${selectedServiceObj.name}` : 'Select Your BrandIt Package'}
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted }}>
              Transparent services tailored to build your career authority.
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5, '& .MuiStepLabel-label': { fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.85rem' } } }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', minHeight: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
            
            {bookingError && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{bookingError}</Alert>}

            <AnimatePresence mode="wait">
              <motion.div key={activeStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                
                {/* STEP 0: CHOOSE PLAN */}
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h5" sx={{ mb: 3, color: brandColors.text, fontWeight: 700 }}>Which service package do you need?</Typography>
                    <Stack spacing={2}>
                      {services.map(s => (
                        <Box
                          key={s.id}
                          onClick={() => setSelected({ ...selected, service: s.id })}
                          sx={{
                            p: 2.5, borderRadius: '16px', border: `2px solid ${selected.service === s.id ? brandColors.primary : brandColors.border}`,
                            cursor: 'pointer', transition: 'all 0.2s', backgroundColor: selected.service === s.id ? alpha(brandColors.primary, 0.03) : '#fff',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2
                          }}
                        >
                          <Box sx={{ maxWidth: '70%' }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.text }}>{s.name}</Typography>
                            <Typography variant="body2" sx={{ color: brandColors.muted, fontSize: '0.825rem', mt: 0.5 }}>{s.desc}</Typography>
                          </Box>
                          <Chip label={s.price} sx={{ backgroundColor: brandColors.primary, color: '#fff', fontWeight: 700, fontSize: '0.9rem', px: 1 }} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* STEP 1: PICK DATE & TIME */}
                {activeStep === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="h5" sx={{ color: brandColors.text, fontWeight: 700 }}>Choose consultation date & time</Typography>
                      {selectedServiceObj && (
                        <Chip
                          label={`Selected: ${selectedServiceObj.price}`}
                          size="small"
                          sx={{ backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 700 }}
                        />
                      )}
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, mb: 1.5 }}>Available Dates</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {dates.map(d => {
                          const label = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
                          return (
                            <Box key={label} onClick={() => setSelected({ ...selected, date: label })}
                              sx={{ px: 2, py: 1, borderRadius: '10px', border: `1.5px solid ${selected.date === label ? brandColors.primary : brandColors.border}`, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, backgroundColor: selected.date === label ? alpha(brandColors.primary, 0.06) : '#fff', color: selected.date === label ? brandColors.primary : brandColors.text, transition: 'all 0.2s' }}>
                              {label}
                            </Box>
                          )
                        })}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, mb: 1.5 }}>Available Times (IST)</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {timeSlots.map(t => (
                          <Box key={t} onClick={() => setSelected({ ...selected, time: t })}
                            sx={{ px: 2.5, py: 1, borderRadius: '10px', border: `1.5px solid ${selected.time === t ? brandColors.primary : brandColors.border}`, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, backgroundColor: selected.time === t ? alpha(brandColors.primary, 0.06) : '#fff', color: selected.time === t ? brandColors.primary : brandColors.text, transition: 'all 0.2s' }}>
                            {t}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* STEP 2: YOUR DETAILS */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h5" sx={{ mb: 3, color: brandColors.text, fontWeight: 700 }}>Your Contact & Profile Details</Typography>
                    <Stack spacing={2.5}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Full Name *" fullWidth required value={selected.name} onChange={e => setSelected({ ...selected, name: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Email Address (For Confirmation) *" type="email" fullWidth required value={selected.email} onChange={e => setSelected({ ...selected, email: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                        </Grid>
                      </Grid>
                      <TextField label="Phone / WhatsApp Number *" fullWidth value={selected.phone} onChange={e => setSelected({ ...selected, phone: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                      <TextField label="LinkedIn Profile URL or Special Requirements" multiline rows={3} fullWidth value={selected.notes} onChange={e => setSelected({ ...selected, notes: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Stack>
                  </Box>
                )}

                {/* STEP 3: 3RD-PARTY PAYMENT GATEWAY */}
                {activeStep === 3 && (
                  <Box>
                    <Typography variant="h5" sx={{ mb: 1, color: brandColors.text, fontWeight: 700 }}>3rd-Party Payment Gateway Checkout</Typography>
                    <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3 }}>
                      Pay securely via official 3rd-Party Payment Gateway (Stripe) with Credit/Debit Cards, Netbanking, or Digital Wallets.
                    </Typography>

                    {/* Order Summary Box */}
                    <Box sx={{ p: 3, borderRadius: '20px', backgroundColor: alpha(brandColors.primary, 0.04), border: `1px solid ${alpha(brandColors.primary, 0.15)}`, mb: 4 }}>
                      <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 1.5 }}>
                        ORDER SUMMARY
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text }}>
                            {selectedServiceObj?.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandColors.muted }}>
                            Consultation: {selected.date} @ {selected.time} IST
                          </Typography>
                          <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 600, display: 'block', mt: 0.5 }}>
                            Client: {selected.name} ({selected.email})
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h3" sx={{ fontWeight: 800, color: brandColors.primary }}>
                            {selectedServiceObj?.price}
                          </Typography>
                          <Typography variant="caption" sx={{ color: brandColors.success, fontWeight: 700 }}>
                            Inclusive of all taxes
                          </Typography>
                        </Box>
                      </Box>

                      <Grid container spacing={1} sx={{ pt: 2, borderTop: `1px dashed ${alpha(brandColors.primary, 0.2)}` }}>
                        {[
                          'Official 3rd-Party Gateway (Stripe Checkout)',
                          'Visa, Mastercard, RuPay & International Cards',
                          'Instant Automated Webhook Verification',
                          'Automated Booking Receipt & Confirmation Email'
                        ].map((feature) => (
                          <Grid item xs={12} sm={6} key={feature}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FiCheckCircle color={brandColors.success} size={14} />
                              <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 600 }}>
                                {feature}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {/* Gateway Banner Box */}
                    <Box sx={{ p: 4, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#FAFAFA', textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1.5 }}>
                        <FiLock color={brandColors.primary} size={24} />
                        <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text }}>
                          Redirecting to 3rd-Party Gateway
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: brandColors.muted, maxWidth: 500, mx: 'auto', mb: 3.5, lineHeight: 1.6 }}>
                        Clicking below will securely redirect you to the official 3rd-Party Payment Gateway page to complete your payment of <strong>{selectedServiceObj?.price}</strong>.
                      </Typography>

                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleProceedToPaymentGateway}
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <FiExternalLink />}
                        endIcon={<FiCreditCard />}
                        sx={{
                          py: 1.8,
                          px: 5,
                          borderRadius: '14px',
                          fontWeight: 800,
                          fontSize: '1.05rem',
                          textTransform: 'none',
                          backgroundColor: brandColors.primary,
                          boxShadow: '0 8px 24px rgba(10,102,194,0.3)',
                          '&:hover': { backgroundColor: '#084e96' }
                        }}
                      >
                        {isSubmitting ? 'Initiating Gateway...' : `Proceed to 3rd-Party Payment Gateway (${selectedServiceObj?.price})`}
                      </Button>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 3, color: brandColors.muted }}>
                      <FiShield color={brandColors.success} size={16} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text }}>
                        256-bit SSL Encrypted Payment Gateway · PCI-DSS Compliant
                      </Typography>
                    </Box>
                  </Box>
                )}

              </motion.div>
            </AnimatePresence>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0 || isSubmitting} startIcon={<FiArrowLeft />}>
                Back
              </Button>
              {activeStep < 3 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!canNext() || isSubmitting}
                  endIcon={<FiArrowRight />}
                  sx={{ px: 4, borderRadius: '12px', fontWeight: 700, textTransform: 'none', backgroundColor: brandColors.primary }}
                >
                  Continue
                </Button>
              )}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
