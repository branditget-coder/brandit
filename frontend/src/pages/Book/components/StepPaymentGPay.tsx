import { Box, Typography, Grid, Button, TextField, Chip, Stack, CircularProgress, alpha } from '@mui/material'
import { FiCheckCircle, FiShield } from 'react-icons/fi'
import { brandColors } from '../../../theme'
import { ServicePackage } from './StepChoosePlan'
import gpayQr from '../../../assets/gpay-qr.jpg'

interface StepPaymentGPayProps {
  selectedServiceObj?: ServicePackage
  selectedDate: string
  selectedTime: string
  clientName: string
  clientEmail: string
  upiRef: string
  isSubmitting: boolean
  onChangeUpiRef: (val: string) => void
  onSubmitBooking: () => void
}

export function StepPaymentGPay({
  selectedServiceObj,
  selectedDate,
  selectedTime,
  clientName,
  clientEmail,
  upiRef,
  isSubmitting,
  onChangeUpiRef,
  onSubmitBooking
}: StepPaymentGPayProps) {
  return (
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
                  <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 700 }}>{selectedDate} @ {selectedTime} IST</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 1, gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>Client Name:</Typography>
                  <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 700 }}>{clientName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>Client Email:</Typography>
                  <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 700, wordBreak: 'break-all' }}>{clientEmail}</Typography>
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
              value={upiRef}
              onChange={e => onChangeUpiRef(e.target.value)}
              helperText="Helps us quickly match & verify your payment"
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={onSubmitBooking}
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
  )
}
