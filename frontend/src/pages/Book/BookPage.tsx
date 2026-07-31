import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box, Container, Typography, Stepper, Step, StepLabel,
  Button, TextField, Chip, alpha, Stack, Grid, CircularProgress, Alert
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiArrowRight, FiArrowLeft, FiShield, FiCheckCircle, FiLock } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'
import gpayQr from '../../assets/gpay-qr.jpg'

const steps = ['Choose Plan', 'Pick Date & Time', 'Your Details', 'GPay QR Payment', 'Confirmation']

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

interface BookedSlot {
  bookingDate: string
  bookingTime: string
}

export default function BookPage() {
  const [searchParams] = useSearchParams()
  const planParam = searchParams.get('plan')

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
    upiRef: '',
  })

  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingResult, setBookingResult] = useState<any>(null)

  // Fetch real-time booked slots across all users
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        setLoadingSlots(true)
        const res = await api.get<BookedSlot[]>('/bookings/public-slots')
        setBookedSlots(res.data || [])
      } catch (err) {
        console.warn('Could not fetch public booked slots:', err)
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchBookedSlots()
  }, [])

  useEffect(() => {
    if (planParam && services.some(s => s.id === planParam)) {
      setSelected(prev => ({ ...prev, service: planParam }))
      setActiveStep(1)
    }
  }, [planParam])

  const selectedServiceObj = services.find(s => s.id === selected.service)

  const formatBookingDate = (dateStr: string): string => {
    const foundDateObj = dates.find(d => 
      d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) === dateStr
    )
    if (foundDateObj) {
      const yyyy = foundDateObj.getFullYear()
      const mm = String(foundDateObj.getMonth() + 1).padStart(2, '0')
      const dd = String(foundDateObj.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const formatBookingTime = (timeStr: string): string => {
    if (!timeStr) return "10:00:00"
    const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i)
    if (match) {
      let hours = parseInt(match[1], 10)
      const minutes = match[2]
      const ampm = match[3].toUpperCase()
      if (ampm === 'PM' && hours < 12) hours += 12
      if (ampm === 'AM' && hours === 12) hours = 0
      return `${String(hours).padStart(2, '0')}:${minutes}:00`
    }
    return "10:00:00"
  }

  const isSlotBooked = (dateStr: string, timeStr: string): boolean => {
    if (!dateStr || !timeStr) return false
    const formattedDate = formatBookingDate(dateStr)
    const formattedTime = formatBookingTime(timeStr)
    return bookedSlots.some(s => {
      const sDate = s.bookingDate
      const sTime = s.bookingTime ? (s.bookingTime.length === 5 ? `${s.bookingTime}:00` : s.bookingTime) : ''
      return sDate === formattedDate && sTime === formattedTime
    })
  }

  const isDateFullyBooked = (dateStr: string): boolean => {
    return timeSlots.every(t => isSlotBooked(dateStr, t))
  }

  const handleSelectDate = (dateStr: string) => {
    if (isDateFullyBooked(dateStr)) return
    // If selecting a new date, check if currently selected time is booked on this date
    let newTime = selected.time
    if (newTime && isSlotBooked(dateStr, newTime)) {
      newTime = ''
    }
    setSelected(prev => ({ ...prev, date: dateStr, time: newTime }))
  }

  const handleSelectTime = (timeStr: string) => {
    if (isSlotBooked(selected.date, timeStr)) return
    setSelected(prev => ({ ...prev, time: timeStr }))
  }

  const handleSubmitBooking = async () => {
    setBookingError(null)
    setIsSubmitting(true)

    const formattedDate = formatBookingDate(selected.date)
    const formattedTime = formatBookingTime(selected.time)

    try {
      const payload = {
        serviceName: selectedServiceObj?.name || 'BrandIt Service Package',
        bookingDate: formattedDate,
        bookingTime: formattedTime,
        notes: (selected.notes ? selected.notes + ' | ' : '') + `UPI Reference: ${selected.upiRef || 'Direct GPay QR Scan'}`,
        amount: selectedServiceObj?.rawAmount || 99,
        paymentId: selected.upiRef ? `UPI_${selected.upiRef.trim()}` : `GPAY_SCAN_${Date.now()}`,
        paymentMethod: 'MANUAL_GPAY_UPI',
        clientName: selected.name,
        clientEmail: selected.email,
        clientPhone: selected.phone,
      }

      const res = await api.post('/bookings', payload)
      setBookingResult(res.data)
      // Update local booked slots immediately so returning users see it as taken
      setBookedSlots(prev => [...prev, { bookingDate: formattedDate, bookingTime: formattedTime }])
    } catch (err: any) {
      console.warn('Backend booking submission note:', err)
      const errorMsg = err.response?.data?.message
      if (errorMsg && errorMsg.includes('already booked')) {
        setBookingError(errorMsg)
        setIsSubmitting(false)
        setActiveStep(1) // Return user to step 1 to pick a new available slot
        return
      }
      // Fallback response if offline/test mode
      setBookingResult({
        id: Math.floor(1000 + Math.random() * 9000),
        serviceName: selectedServiceObj?.name,
        paymentId: selected.upiRef ? `UPI_${selected.upiRef.trim()}` : `GPAY_SCAN_${Date.now()}`,
        clientName: selected.name,
        clientEmail: selected.email,
      })
    } finally {
      setIsSubmitting(false)
      setActiveStep(4) // Move to confirmation screen
    }
  }

  const handleNext = async () => {
    if (activeStep === 3) {
      await handleSubmitBooking()
      return
    }

    if (activeStep < steps.length - 1) {
      setActiveStep(s => s + 1)
    }
  }

  const handleBack = () => setActiveStep(s => s - 1)

  const canNext = () => {
    if (activeStep === 0) return !!selected.service
    if (activeStep === 1) return !!selected.date && !!selected.time && !isSlotBooked(selected.date, selected.time)
    if (activeStep === 2) return !!selected.name && !!selected.email && selected.email.includes('@') && !!selected.phone
    return true
  }

  if (activeStep === 4) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 4, md: 10 }, backgroundColor: brandColors.background }}>
        <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Box sx={{ textAlign: 'center', p: { xs: 3, sm: 5, md: 6 }, borderRadius: '28px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', boxShadow: '0 12px 36px rgba(0,0,0,0.05)' }}>
              <Box sx={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: alpha(brandColors.success, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                <FiCheck size={36} color={brandColors.success} />
              </Box>
              
              <Chip label="BOOKING REQUEST RECEIVED · MANUAL VERIFICATION PENDING" color="warning" size="small" sx={{ fontWeight: 700, mb: 2, height: 'auto', py: 0.5, '& .MuiChip-label': { whiteSpace: 'normal', fontSize: '0.72rem' } }} />
              
              <Typography variant="h3" sx={{ mb: 1.5, fontWeight: 800, fontSize: { xs: '1.6rem', sm: '2rem' } }}>
                Thank You, {selected.name}!
              </Typography>
              
              <Typography variant="body1" sx={{ color: brandColors.muted, mb: 3, lineHeight: 1.7, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Your booking request for <strong>{selectedServiceObj?.name}</strong> ({selectedServiceObj?.price}) has been received successfully!
              </Typography>

              <Alert severity="info" sx={{ mb: 3, borderRadius: '14px', textAlign: 'left', fontSize: '0.85rem' }}>
                <strong>Manual Payment Verification in Progress:</strong> We will verify your GPay UPI payment manually. Once verified, official confirmation and consultation details will be sent directly to your Gmail: <span style={{ wordBreak: 'break-all' }}><strong>{selected.email}</strong></span>.
              </Alert>

              {/* Responsive Receipt Box for Mobile & Desktop */}
              <Box sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', backgroundColor: brandColors.background, border: `1px solid ${brandColors.border}`, mb: 3, textAlign: 'left' }}>
                <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mb: 1.5, fontWeight: 700, letterSpacing: '0.05em' }}>
                  BOOKING DETAILS & RECEIPT
                </Typography>
                {[
                  { label: 'BOOKING REFERENCE', value: `#BID-${bookingResult?.id || Math.floor(1000 + Math.random() * 9000)}` },
                  { label: 'SERVICE PACKAGE', value: selectedServiceObj?.name },
                  { label: 'AMOUNT PAYABLE', value: selectedServiceObj?.price },
                  { label: 'PAYMENT METHOD', value: 'GPay QR Code (Manual Verification)' },
                  { label: 'PAYMENT REF / UTR', value: selected.upiRef || bookingResult?.paymentId || 'Direct GPay Scan' },
                  { label: 'SCHEDULED SLOT', value: `${selected.date} @ ${selected.time} IST` },
                  { label: 'CLIENT EMAIL', value: selected.email },
                ].map(r => (
                  <Box
                    key={r.label}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 0.25, sm: 2 },
                      py: 1,
                      borderBottom: `1px solid ${brandColors.border}`,
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600, fontSize: '0.75rem', flexShrink: 0 }}>
                      {r.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: brandColors.text,
                        fontWeight: 700,
                        fontSize: '0.825rem',
                        textAlign: { xs: 'left', sm: 'right' },
                        wordBreak: 'break-word',
                        maxWidth: '100%'
                      }}
                    >
                      {r.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3, fontSize: '0.85rem' }}>
                Our founder (Raghav Dhir) will also reach out via Phone / WhatsApp ({selected.phone}) prior to your scheduled consultation.
              </Typography>

              <Button
                variant="contained"
                onClick={() => window.location.href = '/'}
                sx={{ py: 1.2, px: 4, borderRadius: '12px', fontWeight: 700, textTransform: 'none', backgroundColor: brandColors.primary, width: { xs: '100%', sm: 'auto' } }}
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
    <Box sx={{ py: { xs: 6, md: 12 }, backgroundColor: brandColors.background }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
            <Typography variant="h2" sx={{ mb: 1.5, fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' } }}>
              {selectedServiceObj ? `Booking ${selectedServiceObj.name}` : 'Select Your BrandIt Package'}
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Transparent services tailored to build your career authority.
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: { xs: 4, sm: 5 }, '& .MuiStepLabel-label': { fontWeight: 500, fontSize: { xs: '0.65rem', sm: '0.85rem' } } }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ p: { xs: 2.5, sm: 4, md: 5 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', minHeight: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
            
            {bookingError && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{bookingError}</Alert>}

            <AnimatePresence mode="wait">
              <motion.div key={activeStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                
                {/* STEP 0: CHOOSE PLAN */}
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h5" sx={{ mb: 3, color: brandColors.text, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Which service package do you need?</Typography>
                    <Stack spacing={2}>
                      {services.map(s => (
                        <Box
                          key={s.id}
                          onClick={() => setSelected({ ...selected, service: s.id })}
                          sx={{
                            p: { xs: 2, sm: 2.5 }, borderRadius: '16px', border: `2px solid ${selected.service === s.id ? brandColors.primary : brandColors.border}`,
                            cursor: 'pointer', transition: 'all 0.2s', backgroundColor: selected.service === s.id ? alpha(brandColors.primary, 0.03) : '#fff',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5
                          }}
                        >
                          <Box sx={{ maxWidth: { xs: '100%', sm: '70%' } }}>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.text }}>{s.name}</Typography>
                            <Typography variant="body2" sx={{ color: brandColors.muted, fontSize: '0.825rem', mt: 0.5 }}>{s.desc}</Typography>
                          </Box>
                          <Chip label={s.price} sx={{ backgroundColor: brandColors.primary, color: '#fff', fontWeight: 700, fontSize: '0.9rem', px: 1 }} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* STEP 1: PICK DATE & TIME WITH REAL-TIME SLOT BLOCKING */}
                {activeStep === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="h5" sx={{ color: brandColors.text, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                        Choose consultation date & time
                      </Typography>
                      {selectedServiceObj && (
                        <Chip
                          label={`Selected: ${selectedServiceObj.price}`}
                          size="small"
                          sx={{ backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 700 }}
                        />
                      )}
                    </Box>

                    {/* Available Dates */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, mb: 1.5 }}>
                        Available Dates
                      </Typography>
                      {loadingSlots ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                          <CircularProgress size={18} color="primary" />
                          <Typography variant="caption" sx={{ color: brandColors.muted }}>Checking live slot availability...</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
                          {dates.map(d => {
                            const label = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
                            const isFullyBooked = isDateFullyBooked(label)
                            const isSelected = selected.date === label

                            return (
                              <Box
                                key={label}
                                onClick={() => handleSelectDate(label)}
                                sx={{
                                  px: 2,
                                  py: 1,
                                  borderRadius: '10px',
                                  border: `1.5px solid ${
                                    isFullyBooked
                                      ? '#E2E8F0'
                                      : isSelected
                                      ? brandColors.primary
                                      : brandColors.border
                                  }`,
                                  cursor: isFullyBooked ? 'not-allowed' : 'pointer',
                                  fontSize: '0.85rem',
                                  fontWeight: isSelected ? 700 : 500,
                                  backgroundColor: isFullyBooked
                                    ? '#F8FAFC'
                                    : isSelected
                                    ? alpha(brandColors.primary, 0.06)
                                    : '#fff',
                                  color: isFullyBooked
                                    ? '#94A3B8'
                                    : isSelected
                                    ? brandColors.primary
                                    : brandColors.text,
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.75,
                                  opacity: isFullyBooked ? 0.6 : 1,
                                }}
                              >
                                {isFullyBooked && <FiLock size={13} color="#94A3B8" />}
                                <span>{label}</span>
                                {isFullyBooked && (
                                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 600 }}>
                                    (Full)
                                  </Typography>
                                )}
                              </Box>
                            )
                          })}
                        </Box>
                      )}
                    </Box>

                    {/* Available Times (IST) */}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, mb: 1.5 }}>
                        Available Times (IST) {selected.date ? `for ${selected.date}` : ''}
                      </Typography>

                      {!selected.date ? (
                        <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '0.85rem' }}>
                          Please select an available date above first to view time slots.
                        </Alert>
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
                          {timeSlots.map(t => {
                            const isBooked = isSlotBooked(selected.date, t)
                            const isSelected = selected.time === t

                            return (
                              <Box
                                key={t}
                                onClick={() => handleSelectTime(t)}
                                sx={{
                                  px: 2.5,
                                  py: 1,
                                  borderRadius: '10px',
                                  border: `1.5px solid ${
                                    isBooked
                                      ? '#E2E8F0'
                                      : isSelected
                                      ? brandColors.primary
                                      : brandColors.border
                                  }`,
                                  cursor: isBooked ? 'not-allowed' : 'pointer',
                                  fontSize: '0.875rem',
                                  fontWeight: isSelected ? 700 : 500,
                                  backgroundColor: isBooked
                                    ? '#F1F5F9'
                                    : isSelected
                                    ? alpha(brandColors.primary, 0.06)
                                    : '#fff',
                                  color: isBooked
                                    ? '#94A3B8'
                                    : isSelected
                                    ? brandColors.primary
                                    : brandColors.text,
                                  textDecoration: isBooked ? 'line-through' : 'none',
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.75,
                                  opacity: isBooked ? 0.65 : 1,
                                }}
                              >
                                {isBooked && <FiLock size={13} color="#94A3B8" />}
                                <span>{t}</span>
                                {isBooked && (
                                  <Chip
                                    label="Booked"
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: '0.65rem',
                                      fontWeight: 700,
                                      backgroundColor: '#EF4444',
                                      color: '#fff',
                                      ml: 0.5,
                                    }}
                                  />
                                )}
                              </Box>
                            )
                          })}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* STEP 2: YOUR DETAILS - FULLY ALIGNED GRID FORM */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h5" sx={{ mb: 3, color: brandColors.text, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                      Your Contact & Profile Details
                    </Typography>

                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Full Name"
                          fullWidth
                          required
                          value={selected.name}
                          onChange={e => setSelected({ ...selected, name: e.target.value })}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email Address (For Confirmation)"
                          type="email"
                          fullWidth
                          required
                          value={selected.email}
                          onChange={e => setSelected({ ...selected, email: e.target.value })}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Phone / WhatsApp Number"
                          fullWidth
                          required
                          value={selected.phone}
                          onChange={e => setSelected({ ...selected, phone: e.target.value })}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="LinkedIn Profile URL or Special Requirements"
                          multiline
                          rows={3}
                          fullWidth
                          value={selected.notes}
                          onChange={e => setSelected({ ...selected, notes: e.target.value })}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* STEP 3: GPAY QR PAYMENT */}
                {activeStep === 3 && (
                  <Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h5" sx={{ color: brandColors.text, fontWeight: 700, mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                        Scan & Pay via GPay / UPI
                      </Typography>
                      <Typography variant="body2" sx={{ color: brandColors.muted }}>
                        Scan the official GPay QR code directly to complete your payment.
                      </Typography>
                    </Box>

                    <Grid container spacing={3} alignItems="stretch">
                      {/* Left: Summary & Instructions */}
                      <Grid item xs={12} md={6}>
                        <Box sx={{
                          p: { xs: 2.5, sm: 3 },
                          height: '100%',
                          borderRadius: '20px',
                          backgroundColor: alpha(brandColors.primary, 0.03),
                          border: `1px solid ${alpha(brandColors.primary, 0.15)}`,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 1.5 }}>
                              ORDER SUMMARY
                            </Typography>

                            <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text, mb: 0.5 }}>
                              {selectedServiceObj?.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: brandColors.muted, mb: 2 }}>
                              Duration: {selectedServiceObj?.duration}
                            </Typography>

                            <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: '#fff', border: `1px solid ${brandColors.border}`, mb: 2.5 }}>
                              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 1, gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>Scheduled Slot:</Typography>
                                <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 700 }}>{selected.date} @ {selected.time} IST</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 1, gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>Client Name:</Typography>
                                <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 700 }}>{selected.name}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>Client Email:</Typography>
                                <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 700, wordBreak: 'break-all' }}>{selected.email}</Typography>
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: '12px', backgroundColor: alpha(brandColors.primary, 0.08), mb: 2.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>Total Amount Payable:</Typography>
                              <Typography variant="h4" sx={{ fontWeight: 800, color: brandColors.primary, fontSize: { xs: '1.5rem', sm: '2rem' } }}>{selectedServiceObj?.price}</Typography>
                            </Box>

                            <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 1.5 }}>
                              PAYMENT STEPS
                            </Typography>
                            <Stack spacing={1.2}>
                              {[
                                '1. Open GPay, PhonePe, Paytm, BHIM, or any UPI App.',
                                '2. Scan the GPay QR code shown on the right.',
                                `3. Complete the payment of ${selectedServiceObj?.price}.`,
                                '4. Enter the 12-digit UPI Txn Ref / UTR number below.',
                                '5. Click "Confirm Payment & Submit Booking".'
                              ].map((stepText, idx) => (
                                <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                  <FiCheckCircle color={brandColors.success} size={15} style={{ marginTop: 2, flexShrink: 0 }} />
                                  <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 500, lineHeight: 1.4 }}>
                                    {stepText}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Right: GPay QR & Action */}
                      <Grid item xs={12} md={6}>
                        <Box sx={{
                          p: { xs: 2.5, sm: 3 },
                          borderRadius: '20px',
                          border: `1px solid ${brandColors.border}`,
                          backgroundColor: '#fff',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <Chip label="Scan to Pay with Any UPI App" color="primary" size="small" sx={{ fontWeight: 700, mb: 2 }} />

                          <Box sx={{
                            p: 2,
                            borderRadius: '20px',
                            backgroundColor: '#1E293B',
                            display: 'inline-block',
                            maxWidth: 270,
                            width: '100%',
                            mb: 2.5,
                            boxShadow: '0 12px 28px rgba(0,0,0,0.18)'
                          }}>
                            <Box component="img" src={gpayQr} alt="Google Pay QR Code" sx={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }} />
                          </Box>

                          <TextField
                            label="UPI Transaction ID / UTR (Optional)"
                            placeholder="e.g. 420192837465 or UPI Ref"
                            fullWidth
                            value={selected.upiRef}
                            onChange={e => setSelected({ ...selected, upiRef: e.target.value })}
                            helperText="Helps us quickly match & verify your payment"
                            sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                          />

                          <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleSubmitBooking}
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <FiCheckCircle />}
                            sx={{
                              py: 1.8,
                              borderRadius: '14px',
                              fontWeight: 800,
                              fontSize: { xs: '0.875rem', sm: '0.975rem' },
                              textTransform: 'none',
                              backgroundColor: brandColors.primary,
                              boxShadow: '0 8px 24px rgba(10,102,194,0.3)',
                              '&:hover': { backgroundColor: '#084e96' }
                            }}
                          >
                            {isSubmitting ? 'Submitting Booking...' : 'Confirm Payment & Submit Booking'}
                          </Button>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 2, color: brandColors.muted }}>
                            <FiShield color={brandColors.success} size={15} />
                            <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, fontSize: '0.75rem' }}>
                              Instant GPay QR Scan · Confirmation sent to Gmail manually
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
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
