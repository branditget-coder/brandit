import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Stepper, Step, StepLabel, Button, Alert, Paper } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiArrowLeft, FiLock, FiUserCheck, FiLogIn } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

import { StepChoosePlan, ServicePackage } from './components/StepChoosePlan'
import { StepPickDateTime } from './components/StepPickDateTime'
import { StepContactDetails } from './components/StepContactDetails'
import { StepPaymentGPay } from './components/StepPaymentGPay'
import { StepConfirmation, BookingResult } from './components/StepConfirmation'
import SEO from '../../components/common/SEO'

const steps = ['Choose Plan', 'Pick Date & Time', 'Your Details', 'GPay QR Payment', 'Confirmation']

const services: ServicePackage[] = [
  { id: 'setup-advice', name: 'Profile Setup + Account Building Advice', duration: 'One-Time Audit & Strategy', price: '₹99', rawAmount: 99, desc: 'Complete profile setup, bio optimization, and growth blueprint.' },
  { id: 'branding-basic', name: 'Profile Setup + Personal Branding', duration: 'Monthly Program', price: '₹320 / mo', rawAmount: 320, desc: 'Full profile setup + 8 strategy-backed posts/month (2 posts/week).' },
  { id: 'branding-network', name: 'Branding + Network Growth Engine', duration: 'Monthly Program', price: '₹400 / mo', rawAmount: 400, desc: 'Profile setup, 8 posts/mo, cold outreach, messages & follow-ups.' },
  { id: 'linkedin-consulting', name: 'LinkedIn Consulting & Advisory', duration: '1-on-1 Sessions', price: '₹250 / mo*', rawAmount: 250, desc: 'Dedicated 1-on-1 career strategy (customizable frequency).' },
]

const planAliases: Record<string, string> = {
  starter: 'setup-advice',
  'setup-advice': 'setup-advice',
  'profile-setup': 'setup-advice',
  '99': 'setup-advice',
  growth: 'branding-basic',
  'branding-basic': 'branding-basic',
  'personal-branding': 'branding-basic',
  '320': 'branding-basic',
  scale: 'branding-network',
  'growth-engine': 'branding-network',
  'branding-network': 'branding-network',
  'outreach-engine': 'branding-network',
  '400': 'branding-network',
  consulting: 'linkedin-consulting',
  'linkedin-consulting': 'linkedin-consulting',
  '250': 'linkedin-consulting',
}

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
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const planParam = searchParams.get('plan')

  const resolvedPlanId = planParam
    ? (planAliases[planParam.toLowerCase()] || (services.some(s => s.id === planParam) ? planParam : ''))
    : ''
  const validPlan = resolvedPlanId

  const [activeStep, setActiveStep] = useState<number>(0)
  const [selected, setSelected] = useState({
    service: validPlan || 'setup-advice',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    upiRef: '',
    paymentScreenshot: '' as string | null,
  })

  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)
  const [showAuthRequired, setShowAuthRequired] = useState(false)

  // Pre-populate logged-in user profile details
  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
      setSelected(prev => ({
        ...prev,
        name: prev.name || fullName,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }))
    }
  }, [user])

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
    if (resolvedPlanId) {
      setSelected(prev => ({ ...prev, service: resolvedPlanId }))
    }
  }, [resolvedPlanId])

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

  const handleChangeField = (field: string, value: string) => {
    setSelected(prev => ({ ...prev, [field]: value }))
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
        paymentScreenshot: selected.paymentScreenshot || undefined,
      }

      const res = await api.post('/bookings', payload)
      setBookingResult(res.data)
      setBookedSlots(prev => [...prev, { bookingDate: formattedDate, bookingTime: formattedTime }])
    } catch (err: any) {
      console.warn('Backend booking submission note:', err)
      const errorMsg = err.response?.data?.message
      if (errorMsg && errorMsg.includes('already booked')) {
        setBookingError(errorMsg)
        setIsSubmitting(false)
        setActiveStep(1)
        return
      }
      setBookingResult({
        id: Math.floor(1000 + Math.random() * 9000),
        serviceName: selectedServiceObj?.name,
        paymentId: selected.upiRef ? `UPI_${selected.upiRef.trim()}` : `GPAY_SCAN_${Date.now()}`,
        clientName: selected.name,
        clientEmail: selected.email,
      })
    } finally {
      setIsSubmitting(false)
      setActiveStep(4)
    }
  }

  const topRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    // Scroll the window to the absolute top
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Also scroll the ref element into view as a fallback
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNext = async () => {
    if (!isAuthenticated) {
      setShowAuthRequired(true)
      scrollToTop()
      return
    }

    if (activeStep === 3) {
      await handleSubmitBooking()
      return
    }

    if (activeStep < steps.length - 1) {
      setActiveStep(s => s + 1)
      scrollToTop()
    }
  }

  const handleBack = () => {
    setActiveStep(s => s - 1)
    scrollToTop()
  }

  const canNext = () => {
    if (activeStep === 0) return !!selected.service
    if (activeStep === 1) return !!selected.date && !!selected.time && !isSlotBooked(selected.date, selected.time)
    if (activeStep === 2) return !!selected.name && !!selected.email && selected.email.includes('@') && !!selected.phone
    if (activeStep === 3) return !!selected.upiRef && selected.upiRef.trim() !== '' && !!selected.paymentScreenshot
    return true
  }

  if (!isAuthenticated && (showAuthRequired || activeStep > 0)) {
    return (
      <Box ref={topRef} sx={{ py: { xs: 6, md: 12 }, backgroundColor: brandColors.background, minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${brandColors.border}`, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: brandColors.primary }}>
              <FiLock size={32} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, color: brandColors.text, fontSize: { xs: '1.5rem', sm: '1.8rem' } }}>
              Registration Required
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, mb: 4, fontSize: '0.95rem', lineHeight: 1.6 }}>
              To enforce 100% security, verified booking records, and instant confirmation tracking, you must register or log in to your BrandIt account before booking a consultation.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="contained"
                startIcon={<FiUserCheck />}
                onClick={() => navigate('/register?redirect=/book')}
                sx={{ px: 3, py: 1.3, borderRadius: '12px', textTransform: 'none', fontWeight: 700, backgroundColor: brandColors.primary }}
              >
                Register Account
              </Button>
              <Button
                variant="outlined"
                startIcon={<FiLogIn />}
                onClick={() => navigate('/login?redirect=/book')}
                sx={{ px: 3, py: 1.3, borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
              >
                Log In
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    )
  }

  if (activeStep === 4) {
    return (
      <StepConfirmation
        clientName={selected.name}
        clientEmail={selected.email}
        clientPhone={selected.phone}
        selectedDate={selected.date}
        selectedTime={selected.time}
        upiRef={selected.upiRef}
        selectedServiceObj={selectedServiceObj}
        bookingResult={bookingResult || undefined}
      />
    )
  }

  return (
    <Box ref={topRef} sx={{ py: { xs: 6, md: 12 }, backgroundColor: brandColors.background }}>
      <SEO
        title={selectedServiceObj ? `Book ${selectedServiceObj.name}` : 'Book Your Personal Branding Plan'}
        description="Book your LinkedIn profile optimization, monthly personal branding, or outreach growth session with BrandIt."
        canonicalUrl="https://go-brandit.vercel.app/book"
      />
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
                  <StepChoosePlan
                    services={services}
                    selectedService={selected.service}
                    onSelectService={(serviceId) => handleChangeField('service', serviceId)}
                  />
                )}

                {/* STEP 1: PICK DATE & TIME */}
                {activeStep === 1 && (
                  <StepPickDateTime
                    selectedServiceObj={selectedServiceObj}
                    dates={dates}
                    timeSlots={timeSlots}
                    selectedDate={selected.date}
                    selectedTime={selected.time}
                    loadingSlots={loadingSlots}
                    isSlotBooked={isSlotBooked}
                    isDateFullyBooked={isDateFullyBooked}
                    onSelectDate={handleSelectDate}
                    onSelectTime={handleSelectTime}
                  />
                )}

                {/* STEP 2: YOUR DETAILS */}
                {activeStep === 2 && (
                  <StepContactDetails
                    name={selected.name}
                    email={selected.email}
                    phone={selected.phone}
                    notes={selected.notes}
                    onChangeField={handleChangeField}
                  />
                )}

                {/* STEP 3: GPAY QR PAYMENT */}
                {activeStep === 3 && (
                  <StepPaymentGPay
                    selectedServiceObj={selectedServiceObj}
                    selectedDate={selected.date}
                    selectedTime={selected.time}
                    clientName={selected.name}
                    clientEmail={selected.email}
                    upiRef={selected.upiRef}
                    paymentScreenshot={selected.paymentScreenshot}
                    isSubmitting={isSubmitting}
                    onChangeUpiRef={(val) => handleChangeField('upiRef', val)}
                    onChangePaymentScreenshot={(val) => handleChangeField('paymentScreenshot', val || '')}
                    onSubmitBooking={handleSubmitBooking}
                  />
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
