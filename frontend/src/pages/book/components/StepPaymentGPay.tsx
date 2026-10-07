import { useState, useRef } from 'react'
import {
  Box, Typography, Grid, Button, TextField, Chip, CircularProgress, alpha, IconButton, Alert, Tooltip
} from '@mui/material'
import {
  FiCheckCircle, FiShield, FiUploadCloud, FiTrash2,
  FiLock, FiCopy, FiCheck, FiExternalLink, FiRefreshCw
} from 'react-icons/fi'
import { QRCodeSVG } from 'qrcode.react'
import { brandColors } from '../../../theme'
import { ServicePackage } from './StepChoosePlan'
import gpayQr from '../../../assets/gpay-qr.jpg'

// Verified Payee Details
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

  // Plan amount payable
  const payableAmount = selectedServiceObj?.rawAmount && selectedServiceObj.rawAmount > 0
    ? selectedServiceObj.rawAmount
    : 129

  const formattedAmount = payableAmount.toFixed(2)
  const txnNote = `BrandIt - ${(selectedServiceObj?.name || 'Service Plan').slice(0, 30)}`

  // Standard NPCI UPI URI: mam = am locks amount in read-only mode in UPI apps
  const upiUri = `upi://pay?pa=${encodeURIComponent(UPI_VPA)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${formattedAmount}&mam=${formattedAmount}&cu=INR&tn=${encodeURIComponent(txnNote)}&aid=${GPAY_AID}`

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_VPA)
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2000)
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image (PNG, JPG, JPEG, WebP).')
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

  // Only mandatory requirement is payment screenshot
  const canSubmit = Boolean(paymentScreenshot)

  return (
    <Box>
      {/* Concise Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: brandColors.text, fontWeight: 800, mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Complete Payment
        </Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted }}>
          Scan the QR code below to pay <strong>₹{payableAmount}</strong>, then upload your payment screenshot.
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        {/* Left Column: QR Code & Payee Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{
            p: { xs: 2.5, sm: 3 },
            height: '100%',
            borderRadius: '20px',
            border: `1px solid ${brandColors.border}`,
            backgroundColor: '#fff',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Plan & Amount Summary Bar */}
            <Box sx={{
              width: '100%',
              p: 1.5,
              borderRadius: '14px',
              backgroundColor: alpha(brandColors.primary, 0.05),
              border: `1px solid ${alpha(brandColors.primary, 0.12)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2.5
            }}>
              <Box sx={{ textAlign: 'left', overflow: 'hidden', mr: 1 }}>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600, display: 'block', fontSize: '0.72rem' }}>
                  CHOSEN PLAN
                </Typography>
                <Typography noWrap variant="subtitle2" sx={{ fontWeight: 800, color: brandColors.text, fontSize: '0.875rem' }}>
                  {selectedServiceObj?.name}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600, display: 'block', fontSize: '0.72rem' }}>
                  AMOUNT
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: brandColors.primary }}>
                  ₹{payableAmount}
                </Typography>
              </Box>
            </Box>

            {/* QR Code Container */}
            <Box sx={{
              p: 2,
              borderRadius: '20px',
              backgroundColor: '#0F172A',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 260,
              mb: 2,
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.18)'
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
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  aspectRatio: '1/1'
                }}>
                  <QRCodeSVG
                    value={upiUri}
                    size={210}
                    level="M"
                    includeMargin={false}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </Box>
              )}

              {/* Amount Locked Badge */}
              <Box sx={{
                mt: 1.5,
                px: 1.5,
                py: 0.4,
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6
              }}>
                <FiLock size={12} color="#38BDF8" />
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
                  ₹{payableAmount} (Read-only)
                </Typography>
              </Box>
            </Box>

            {/* Beneficiary Details Pill */}
            <Box sx={{
              width: '100%',
              px: 2,
              py: 1.2,
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
              border: `1px solid ${brandColors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mb: 1.5
            }}>
              <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600, display: 'block', fontSize: '0.7rem' }}>
                  BENEFICIARY: {PAYEE_NAME}
                </Typography>
                <Typography noWrap variant="caption" sx={{ color: brandColors.text, fontWeight: 700, fontFamily: 'monospace', fontSize: '0.78rem' }}>
                  {UPI_VPA}
                </Typography>
              </Box>
              <Tooltip title={copiedUpi ? "Copied!" : "Copy UPI ID"}>
                <IconButton size="small" onClick={handleCopyUpi} sx={{ p: 0.5, flexShrink: 0 }}>
                  {copiedUpi ? <FiCheck size={14} color={brandColors.success} /> : <FiCopy size={14} color={brandColors.primary} />}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Mobile / Direct Pay Link */}
            <Button
              component="a"
              href={upiUri}
              variant="outlined"
              fullWidth
              size="small"
              startIcon={<FiExternalLink />}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '0.825rem',
                borderColor: brandColors.primary,
                color: brandColors.primary,
                py: 0.8,
                '&:hover': {
                  backgroundColor: alpha(brandColors.primary, 0.04),
                  borderColor: brandColors.primary,
                }
              }}
            >
              Open in UPI App (Pay ₹{payableAmount})
            </Button>

            {/* Static QR Toggle */}
            <Button
              variant="text"
              size="small"
              onClick={() => setShowBackupQr(!showBackupQr)}
              startIcon={<FiRefreshCw size={11} />}
              sx={{
                mt: 1,
                fontSize: '0.72rem',
                color: brandColors.muted,
                textTransform: 'none',
                py: 0
              }}
            >
              {showBackupQr ? 'Show dynamic QR' : 'Trouble scanning? View static QR'}
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Screenshot Upload & Confirmation */}
        <Grid item xs={12} md={6}>
          <Box sx={{
            p: { xs: 2.5, sm: 3 },
            height: '100%',
            borderRadius: '20px',
            border: `1px solid ${brandColors.border}`,
            backgroundColor: '#fff',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <Box>
              {/* Mandatory Screenshot Section */}
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: brandColors.text }}>
                    Payment Screenshot <span style={{ color: '#DC2626' }}>*</span>
                  </Typography>
                  <Chip label="Mandatory" size="small" color="primary" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                </Box>

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
                    backgroundColor: alpha(brandColors.success, 0.04),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                      <Box component="img" src={paymentScreenshot} alt="Screenshot" sx={{ width: 48, height: 48, borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                      <Box sx={{ overflow: 'hidden' }}>
                        <Typography noWrap variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text, fontSize: '0.85rem' }}>
                          {fileName || 'Screenshot Uploaded'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: brandColors.success, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                          <FiCheck size={12} /> Ready for verification
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={handleRemoveScreenshot} color="error" size="small" title="Remove screenshot">
                      <FiTrash2 size={18} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    component="label"
                    htmlFor="payment-screenshot-upload"
                    sx={{
                      p: 3,
                      borderRadius: '14px',
                      border: `2px dashed ${alpha(brandColors.primary, 0.35)}`,
                      backgroundColor: alpha(brandColors.primary, 0.02),
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(brandColors.primary, 0.05),
                        borderColor: brandColors.primary
                      }
                    }}
                  >
                    <FiUploadCloud size={30} color={brandColors.primary} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.primary, textAlign: 'center' }}>
                      Upload Payment Screenshot
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.muted, textAlign: 'center' }}>
                      Click or drag screenshot here (PNG, JPG, WebP)
                    </Typography>
                  </Box>
                )}

                {uploadError && (
                  <Typography variant="caption" sx={{ color: '#DC2626', mt: 0.8, display: 'block', fontWeight: 600 }}>
                    {uploadError}
                  </Typography>
                )}
              </Box>

              {/* Optional Transaction Ref (No longer mandatory) */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text }}>
                    Transaction Ref / UTR
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 500 }}>
                    Optional
                  </Typography>
                </Box>
                <TextField
                  placeholder="e.g. 12-digit UTR from GPay / PhonePe"
                  fullWidth
                  size="small"
                  value={upiRef}
                  onChange={e => onChangeUpiRef(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Submission Section */}
            <Box sx={{ mt: 2 }}>
              {!canSubmit && (
                <Alert severity="info" sx={{ mb: 2, borderRadius: '12px', fontSize: '0.8rem', py: 0.5 }}>
                  Please upload your payment screenshot to proceed.
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
                  py: 1.6,
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textTransform: 'none',
                  backgroundColor: brandColors.primary,
                  boxShadow: canSubmit ? '0 8px 24px rgba(10,102,194,0.25)' : 'none',
                  '&:hover': { backgroundColor: '#084e96' }
                }}
              >
                {isSubmitting ? 'Submitting Booking...' : 'Confirm Payment & Submit Booking'}
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8, mt: 1.8, color: brandColors.muted }}>
                <FiShield color={brandColors.success} size={15} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.muted, fontSize: '0.75rem' }}>
                  Secure payment • Manual verification within 24 hours
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}