import { Box, Container, Typography, Button, Chip, Alert, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { brandColors } from '../../../theme'
import { ServicePackage } from './StepChoosePlan'

export interface BookingResult {
  id?: number
  serviceName?: string
  paymentId?: string
  clientName?: string
  clientEmail?: string
}

interface StepConfirmationProps {
  clientName: string
  clientEmail: string
  clientPhone: string
  selectedDate: string
  selectedTime: string
  upiRef: string
  selectedServiceObj?: ServicePackage
  bookingResult?: BookingResult
}

export function StepConfirmation({
  clientName,
  clientEmail,
  clientPhone,
  selectedDate,
  selectedTime,
  upiRef,
  selectedServiceObj,
  bookingResult
}: StepConfirmationProps) {
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
              Thank You, {clientName}!
            </Typography>
            
            <Typography variant="body1" sx={{ color: brandColors.muted, mb: 3, lineHeight: 1.7, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Your booking request for <strong>{selectedServiceObj?.name}</strong> ({selectedServiceObj?.price}) has been received successfully!
            </Typography>

            <Alert severity="info" sx={{ mb: 3, borderRadius: '14px', textAlign: 'left', fontSize: '0.85rem' }}>
              <strong>Manual Payment Verification in Progress:</strong> We will verify your GPay UPI payment manually. Once verified, official confirmation and consultation details will be sent directly to your Gmail: <span style={{ wordBreak: 'break-all' }}><strong>{clientEmail}</strong></span>.
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
                { label: 'PAYMENT REF / UTR', value: upiRef || bookingResult?.paymentId || 'Direct GPay Scan' },
                { label: 'SCHEDULED SLOT', value: `${selectedDate} @ ${selectedTime} IST` },
                { label: 'CLIENT EMAIL', value: clientEmail },
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
              Our founder (Raghav Dhir) will also reach out via Phone / WhatsApp ({clientPhone}) prior to your scheduled consultation.
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
