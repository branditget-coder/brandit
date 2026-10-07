import { useState, useRef } from 'react'
import {
  Box, Typography, Grid, Button, TextField, Chip, Stack, CircularProgress, alpha, IconButton, Alert, Tooltip
} from '@mui/material'
import {
  FiCheckCircle, FiShield, FiUploadCloud, FiTrash2, FiAlertCircle,
  FiLock, FiCopy, FiCheck, FiExternalLink, FiRefreshCw
} from 'react-icons/fi'
import { QRCodeSVG } from 'qrcode.react'
import { brandColors } from '../../../theme'
import { ServicePackage } from './StepChoosePlan'
import gpayQr from '../../../assets/gpay-qr.jpg'

// Verified Beneficiary Account Details (from original GPay QR)
const UPI_VPA = 'raghavdhir1510-4@okhdfcbank'
const PAYEE_NAME = 'Raghav Dhir'
const GPAY_AID = 'uGICAgMDEmsmiLg'

interface StepPaymentGPayProps {
  selectedServiceObj?: ServicePackage
  selectedDate: string
  selectedTime: string
  clientName: string
  clientEmail: string
  upiRef: string
  paymentScreenshot: string | null
  isSubmitting: boolean
  onChangeUpiRef: (val: string) => void
  onChangePaymentScreenshot: (base64: string | null) => void
  onSubmitBooking: () => void
}

export function StepPaymentGPay({
  selectedServiceObj,
  selectedDate,
  selectedTime,
  clientName,
  clientEmail,
  upiRef,
  paymentScreenshot,
  isSubmitting,
  onChangeUpiRef,
  onChangePaymentScreenshot,
  onSubmitBooking
}: StepPaymentGPayProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [showBackupQr, setShowBackupQr] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Determine exact plan amount payable
  const payableAmount = selectedServiceObj?.rawAmount && selectedServiceObj.rawAmount > 0
    ? selectedServiceObj.rawAmount
    : 129

  const formattedAmount = payableAmount.toFixed(2)
  const txnNote = `BrandIt - ${(selectedServiceObj?.name || 'Service Plan').slice(0, 30)}`

  // Standard NPCI UPI URI with exact locked amount:
  // am = exact amount, mam = minimum amount equal to am (enforces locked read-only mode across UPI apps)
  const upiUri = `upi://pay?pa=${encodeURIComponent(UPI_VPA)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${formattedAmount}&mam=${formattedAmount}&cu=INR&tn=${encodeURIComponent(txnNote)}&aid=${GPAY_AID}`

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_VPA)
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2000)
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WebP).')
      return
    }

    setUploadError(null)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX_WIDTH = 600
        const MAX_HEIGHT = 600
        let width = img.width
        let height = img.height

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          } else {
            width = Math.round((width * MAX_HEIGHT) / height)
            height = MAX_HEIGHT
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6)
          onChangePaymentScreenshot(compressedDataUrl)
        } else {
          onChangePaymentScreenshot(e.target?.result as string)
        }
      }
      img.onerror = () => {
        onChangePaymentScreenshot(e.target?.result as string)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleRemoveScreenshot = () => {
    setFileName(null)
    onChangePaymentScreenshot(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isUpiValid = upiRef.trim().length > 0
  const isScreenshotValid = Boolean(paymentScreenshot)
  const canSubmit = isUpiValid && isScreenshotValid

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: brandColors.text, fontWeight: 700, mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Scan & Pay via GPay / UPI
        </Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted }}>
          The QR code is automatically locked to your chosen plan amount (₹{payableAmount}). Scan to pay, enter your reference, and upload the screenshot.
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

              {/* Amount Payable Box with Read-Only Lock Status */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: '12px', backgroundColor: alpha(brandColors.primary, 0.08), mb: 2.5 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                    Total Amount Payable:
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                    <FiLock size={12} /> Read-only mode • Locked in QR
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: brandColors.primary, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  ₹{payableAmount}
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 1.5 }}>
                MANDATORY VERIFICATION STEPS
              </Typography>
              <Stack spacing={1.2}>
                {[
                  '1. Open GPay, PhonePe, Paytm, BHIM, or any UPI App.',
                  `2. Scan the QR code on the right (₹${payableAmount} locked in read-only mode).`,
                  `3. Confirm payment of exactly ₹${payableAmount} to ${PAYEE_NAME}.`,
                  '4. Fill in the 12-digit Txn Ref / UTR number (*Mandatory).',
                  '5. Upload payment confirmation screenshot (*Mandatory).',
                  '6. Click "Confirm Payment & Submit Booking".'
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

        {/* Right: GPay Dynamic QR & Mandatory Fields */}
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
            <Chip
              icon={<FiLock size={12} />}
              label={`Exact Plan Amount: ₹${payableAmount} (Read-Only)`}
              color="primary"
              size="small"
              sx={{ fontWeight: 700, mb: 2 }}
            />

            {/* Dynamic UPI QR Code Card */}
            <Box sx={{
              p: 2,
              borderRadius: '20px',
              backgroundColor: '#0F172A',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 270,
              mb: 2,
              boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {showBackupQr ? (
                <Box
                  component="img"
                  src={gpayQr}
                  alt="Static Google Pay QR Code"
                  sx={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block', backgroundColor: '#fff', p: 1 }}
                />
              ) : (
                <Box sx={{
                  backgroundColor: '#ffffff',
                  p: 1.5,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  aspectRatio: '1/1'
                }}>
                  <QRCodeSVG
                    value={upiUri}
                    size={220}
                    level="M"
                    includeMargin={false}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </Box>
              )}

              {/* Read-Only Badge below QR */}
              <Box sx={{
                mt: 1.5,
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.7
              }}>
                <FiLock size={12} color="#38BDF8" />
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.02em' }}>
                  ₹{payableAmount} Locked in QR
                </Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.72rem', mt: 0.4 }}>
                Directly credits: {PAYEE_NAME}
              </Typography>
            </Box>

            {/* Beneficiary & UPI ID Card */}
            <Box sx={{
              width: '100%',
              p: 1.5,
              mb: 1.5,
              borderRadius: '12px',
              backgroundColor: alpha(brandColors.primary, 0.03),
              border: `1px solid ${alpha(brandColors.primary, 0.15)}`,
              textAlign: 'left'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>
                  Verified Beneficiary:
                </Typography>
                <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 700 }}>
                  {PAYEE_NAME}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>
                  Account / UPI ID:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 700, fontFamily: 'monospace' }}>
                    {UPI_VPA}
                  </Typography>
                  <Tooltip title={copiedUpi ? "Copied!" : "Copy UPI ID"}>
                    <IconButton size="small" onClick={handleCopyUpi} sx={{ p: 0.3 }}>
                      {copiedUpi ? <FiCheck size={13} color={brandColors.success} /> : <FiCopy size={13} color={brandColors.primary} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Mobile / Direct UPI Intent Link */}
            <Button
              component="a"
              href={upiUri}
              variant="outlined"
              fullWidth
              size="small"
              startIcon={<FiExternalLink />}
              sx={{
                mb: 1,
                borderRadius: '10px',
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '0.825rem',
                borderColor: brandColors.primary,
                color: brandColors.primary,
                '&:hover': {
                  backgroundColor: alpha(brandColors.primary, 0.04),
                  borderColor: brandColors.primary,
                }
              }}
            >
              Open & Pay ₹{payableAmount} via UPI App
            </Button>

            {/* Fallback QR Toggle */}
            <Button
              variant="text"
              size="small"
              onClick={() => setShowBackupQr(!showBackupQr)}
              startIcon={<FiRefreshCw size={12} />}
              sx={{
                mb: 2,
                fontSize: '0.72rem',
                color: brandColors.muted,
                textTransform: 'none',
                py: 0.2
              }}
            >
              {showBackupQr ? 'Show Dynamic Amount QR Code' : 'Trouble scanning? View static QR'}
            </Button>

            {/* Field 1: Transaction Ref (Mandatory) */}
            <Box sx={{ width: '100%', textAlign: 'left', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text, mb: 0.8 }}>
                Transaction Ref / UTR ID <span style={{ color: '#DC2626' }}>*</span>
              </Typography>
              <TextField
                placeholder="e.g. 420192837465 or UPI Txn Ref"
                fullWidth
                value={upiRef}
                onChange={e => onChangeUpiRef(e.target.value)}
                error={upiRef.length > 0 && !isUpiValid}
                helperText={!isUpiValid ? "Mandatory: Enter 12-digit UTR/Txn Ref from GPay/UPI app" : "Verified reference format"}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Box>

            {/* Field 2: Payment Screenshot Upload (Mandatory) */}
            <Box sx={{ width: '100%', textAlign: 'left', mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text, mb: 0.8 }}>
                Payment Screenshot <span style={{ color: '#DC2626' }}>*</span>
              </Typography>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="payment-screenshot-upload"
              />

              {paymentScreenshot ? (
                <Box sx={{
                  p: 2,
                  borderRadius: '14px',
                  border: `2px solid ${brandColors.success}`,
                  backgroundColor: alpha(brandColors.success, 0.05),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                    <Box component="img" src={paymentScreenshot} alt="Preview" sx={{ width: 44, height: 44, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography noWrap variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text, fontSize: '0.85rem' }}>
                        {fileName || 'Screenshot Uploaded'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: brandColors.success, fontWeight: 600, display: 'block' }}>
                        ✓ Ready for verification
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={handleRemoveScreenshot} color="error" size="small" title="Remove image">
                    <FiTrash2 size={18} />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  component="label"
                  htmlFor="payment-screenshot-upload"
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    border: `2px dashed ${alpha(brandColors.primary, 0.4)}`,
                    backgroundColor: alpha(brandColors.primary, 0.02),
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(brandColors.primary, 0.06),
                      borderColor: brandColors.primary
                    }
                  }}
                >
                  <FiUploadCloud size={28} color={brandColors.primary} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.primary, textAlign: 'center' }}>
                    Click or Drag to Upload Payment Screenshot
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.muted, textAlign: 'center' }}>
                    Supports PNG, JPG, JPEG, WebP (Max 5MB)
                  </Typography>
                </Box>
              )}

              {uploadError && (
                <Typography variant="caption" sx={{ color: '#DC2626', mt: 0.5, display: 'block', fontWeight: 600 }}>
                  {uploadError}
                </Typography>
              )}
            </Box>

            {/* Validation Notice if button disabled */}
            {!canSubmit && (
              <Alert icon={<FiAlertCircle />} severity="warning" sx={{ width: '100%', mb: 2, borderRadius: '12px', fontSize: '0.8rem', py: 0.5 }}>
                Fill UTR number & upload screenshot to proceed.
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={onSubmitBooking}
              disabled={!canSubmit || isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <FiCheckCircle />}
              sx={{
                py: 1.8,
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: { xs: '0.875rem', sm: '0.975rem' },
                textTransform: 'none',
                backgroundColor: brandColors.primary,
                boxShadow: canSubmit ? '0 8px 24px rgba(10,102,194,0.3)' : 'none',
                '&:hover': { backgroundColor: '#084e96' }
              }}
            >
              {isSubmitting ? 'Submitting Booking...' : 'Confirm Payment & Submit Booking'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 2, color: brandColors.muted }}>
              <FiShield color={brandColors.success} size={15} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, fontSize: '0.75rem' }}>
                Screenshot sent to brandit.get@gmail.com for instant verification
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}