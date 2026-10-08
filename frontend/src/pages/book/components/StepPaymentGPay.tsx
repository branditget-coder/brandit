import { useState } from 'react'
import {
  Box, Typography, Grid, Button, Chip, CircularProgress, alpha, Alert, Paper, Stack, Divider
} from '@mui/material'
import {
  FiCheckCircle, FiShield, FiLock, FiCreditCard, FiArrowRight, FiAlertCircle, FiRefreshCw, FiCalendar, FiClock, FiUser
} from 'react-icons/fi'
import { brandColors } from '../../../theme'
import { ServicePackage } from './StepChoosePlan'
import { loadCashfreeSDK, createCashfreeOrder, verifyCashfreeOrder } from '../../../services/cashfree'

export interface CashfreeSuccessDetails {
  orderId: string
  amount: number
  serviceName: string
}

interface StepPaymentGPayProps {
  selectedServiceObj?: ServicePackage
  selectedDate: string
  selectedTime: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  upiRef?: string
  paymentScreenshot?: string | null
  isSubmitting?: boolean
  onChangeUpiRef?: (val: string) => void
  onChangePaymentScreenshot?: (base64: string | null) => void
  onSubmitBooking?: () => void
  onCashfreeSuccess?: (details: CashfreeSuccessDetails) => void
}

export function StepPaymentGPay({
  selectedServiceObj,
  selectedDate,
  selectedTime,
  clientName,
  clientEmail,
  clientPhone,
  isSubmitting = false,
  onCashfreeSuccess
}: StepPaymentGPayProps) {
  const [isCashfreeLoading, setIsCashfreeLoading] = useState(false)
  const [cashfreeError, setCashfreeError] = useState<string | null>(null)

  // Plan amount payable
  const payableAmount = selectedServiceObj?.rawAmount && selectedServiceObj.rawAmount > 0
    ? selectedServiceObj.rawAmount
    : 129

  // Handle Cashfree Hosted Web Checkout Flow (Popup Modal)
  const handleCashfreePayment = async () => {
    setIsCashfreeLoading(true)
    setCashfreeError(null)

    try {
      // 1. Ensure Cashfree SDK is initialized
      const cashfree = await loadCashfreeSDK('production')

      // 2. Request backend order creation
      const orderResp = await createCashfreeOrder({
        serviceName: selectedServiceObj?.name || 'BrandIt Package',
        amount: payableAmount,
        clientName: clientName || 'BrandIt Client',
        clientEmail: clientEmail || '',
        clientPhone: clientPhone || '',
        notes: `Consultation Slot: ${selectedDate} at ${selectedTime}`,
      })

      if (!orderResp.success || !orderResp.paymentSessionId) {
        throw new Error(orderResp.message || 'Could not obtain payment session from Cashfree')
      }

      // 3. Open Cashfree Popup Checkout Modal
      const checkoutOptions = {
        paymentSessionId: orderResp.paymentSessionId,
        redirectTarget: '_modal',
      }

      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result?.error) {
          console.warn('Cashfree payment modal dismissed or encountered error:', result.error)
          setCashfreeError('Payment popup was closed or cancelled. Please try again to complete your booking.')
          setIsCashfreeLoading(false)
          return
        }

        if (result?.redirect) {
          console.info('Cashfree checkout requires browser redirection')
          return
        }

        // 4. Verify payment with backend
        try {
          const verifyResp = await verifyCashfreeOrder({
            orderId: orderResp.orderId,
            clientEmail,
            clientName,
            clientPhone,
            serviceName: selectedServiceObj?.name,
            bookingDate: selectedDate,
            bookingTime: selectedTime,
            notes: `Booked via Cashfree modal for ${selectedDate} at ${selectedTime}`,
          })
          if (verifyResp.paid) {
            if (onCashfreeSuccess) {
              onCashfreeSuccess({
                orderId: orderResp.orderId,
                amount: payableAmount,
                serviceName: selectedServiceObj?.name || 'BrandIt Package',
              })
            }
          } else {
            setCashfreeError('Payment status is pending. If your account was debited, your booking will be confirmed momentarily.')
          }
        } catch (vErr) {
          console.warn('Cashfree backend verification note:', vErr)
          if (onCashfreeSuccess) {
            onCashfreeSuccess({
              orderId: orderResp.orderId,
              amount: payableAmount,
              serviceName: selectedServiceObj?.name || 'BrandIt Package',
            })
          }
        } finally {
          setIsCashfreeLoading(false)
        }
      })
    } catch (err: any) {
      console.error('Error starting Cashfree checkout:', err)
      const msg = err.response?.data?.message || err.message || 'Unable to open Cashfree payment gateway. Please try again.'
      setCashfreeError(msg)
      setIsCashfreeLoading(false)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3.5, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h5" sx={{ color: brandColors.text, fontWeight: 800, mb: 0.5, fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
          Complete Payment
        </Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted, fontSize: '0.95rem' }}>
          Instant, encrypted payment processing powered by official Cashfree Payment Gateway.
        </Typography>
      </Box>

      {/* Main Payment Container */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: '24px',
          border: `1.5px solid ${alpha(brandColors.primary, 0.2)}`,
          background: 'linear-gradient(145deg, #ffffff 0%, #F8FAFC 100%)',
          boxShadow: '0 16px 40px rgba(10,102,194,0.07)',
        }}
      >
        {cashfreeError && (
          <Alert
            severity="warning"
            icon={<FiAlertCircle />}
            sx={{ mb: 3.5, borderRadius: '16px', fontSize: '0.88rem' }}
            action={
              <Button color="inherit" size="small" onClick={handleCashfreePayment} startIcon={<FiRefreshCw />}>
                Try Again
              </Button>
            }
          >
            {cashfreeError}
          </Alert>
        )}

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
          {/* Left Column: Plan & Booking Overview */}
          <Grid item xs={12} md={7}>
            <Box sx={{ pr: { md: 2 } }}>
              {/* Security Pill Badges */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  icon={<FiShield color="#0A66C2" />}
                  label="PCI-DSS Level 1 Encrypted"
                  size="small"
                  sx={{
                    backgroundColor: alpha(brandColors.primary, 0.08),
                    color: brandColors.primary,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    py: 0.5
                  }}
                />
                <Chip
                  icon={<FiCheckCircle color="#10B981" />}
                  label="Instant Automated Activation"
                  size="small"
                  sx={{
                    backgroundColor: '#ECFDF5',
                    color: '#065F46',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    py: 0.5
                  }}
                />
                <Chip
                  icon={<FiLock color="#6366F1" />}
                  label="256-bit SSL"
                  size="small"
                  sx={{
                    backgroundColor: '#EEF2FF',
                    color: '#4338CA',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    py: 0.5
                  }}
                />
              </Box>

              {/* Package Title */}
              <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text, mb: 1.5, fontSize: { xs: '1.2rem', sm: '1.45rem' } }}>
                {selectedServiceObj?.name || 'BrandIt Consultation Package'}
              </Typography>

              {/* Booking Context Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: '#fff',
                  border: `1px solid ${brandColors.border}`,
                }}
              >
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: brandColors.text }}>
                      <FiCalendar size={16} color={brandColors.primary} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedDate || 'Upcoming Session'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: brandColors.text }}>
                      <FiClock size={16} color={brandColors.primary} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedTime || 'Scheduled Slot'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 0.5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: brandColors.muted, mt: 0.5 }}>
                      <FiUser size={15} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        Booked for: <strong>{clientName || 'Client'}</strong> ({clientEmail || 'Verified Email'})
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Accepted Payment Modes Badges */}
              <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.text, display: 'block', mb: 1, letterSpacing: '0.04em' }}>
                ACCEPTED PAYMENT METHODS VIA CASHFREE:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 3 }}>
                {[
                  'Google Pay',
                  'PhonePe',
                  'Paytm',
                  'BHIM UPI',
                  'Visa / Mastercard',
                  'RuPay Cards',
                  'Net Banking (50+ Banks)',
                  'CRED & Wallets'
                ].map(m => (
                  <Chip
                    key={m}
                    label={m}
                    size="small"
                    sx={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: brandColors.text
                    }}
                  />
                ))}
              </Box>

              {/* Footer Trust Guarantee */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: brandColors.muted }}>
                <FiLock size={15} color={brandColors.success} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Official Merchant Account • Powered by Cashfree Payments India Pvt. Ltd.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Checkout Pricing & Payment Action */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: { xs: 3, sm: 3.5 },
                borderRadius: '22px',
                backgroundColor: '#fff',
                border: `1px solid ${brandColors.border}`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Payable Amount
              </Typography>
              
              <Typography variant="h3" sx={{ fontWeight: 900, color: brandColors.text, my: 0.8, fontSize: { xs: '2.5rem', sm: '3rem' } }}>
                ₹{payableAmount}
              </Typography>

              <Typography variant="body2" sx={{ color: brandColors.success, fontWeight: 700, mb: 3 }}>
                ✓ All taxes &amp; platform fees included
              </Typography>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCashfreePayment}
                disabled={isCashfreeLoading || isSubmitting}
                startIcon={isCashfreeLoading ? <CircularProgress size={22} color="inherit" /> : <FiCreditCard />}
                endIcon={!isCashfreeLoading && <FiArrowRight />}
                sx={{
                  py: 1.8,
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: { xs: '1rem', sm: '1.05rem' },
                  textTransform: 'none',
                  backgroundColor: brandColors.primary,
                  boxShadow: '0 10px 25px rgba(10,102,194,0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#084e96',
                    boxShadow: '0 14px 30px rgba(10,102,194,0.4)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {isCashfreeLoading ? 'Opening Cashfree...' : `Pay ₹${payableAmount} via Cashfree`}
              </Button>

              <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mt: 2, fontSize: '0.74rem' }}>
                Opens secure popup checkout. Your session remains uninterrupted.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}