import { useState, useRef } from 'react'
import {
  Box, Typography, Grid, Button, TextField, Chip, CircularProgress, alpha, IconButton, Alert, Tooltip, Stack, Divider, Paper
} from '@mui/material'
import {
  FiCheckCircle, FiShield, FiUploadCloud, FiTrash2,
  FiLock, FiCopy, FiCheck, FiExternalLink, FiRefreshCw, FiStar,
  FiCreditCard, FiSmartphone, FiArrowRight, FiAlertCircle
} from 'react-icons/fi'
import { QRCodeSVG } from 'qrcode.react'
import { brandColors } from '../../../theme'
import { ServicePackage } from './StepChoosePlan'
import gpayQr from '../../../assets/gpay-qr.jpg'
import { loadCashfreeSDK, createCashfreeOrder, verifyCashfreeOrder } from '../../../services/cashfree'

// Verified Payee Details for Manual QR Fallback
const UPI_VPA = 'raghavdhir1510-4@okhdfcbank'
const PAYEE_NAME = 'Raghav Dhir'
const GPAY_AID = 'uGICAgMDEmsmiLg'

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
  upiRef: string
  paymentScreenshot: string | null
  isSubmitting: boolean
  onChangeUpiRef: (val: string) => void
  onChangePaymentScreenshot: (base64: string | null) => void
  onSubmitBooking: () => void
  onCashfreeSuccess?: (details: CashfreeSuccessDetails) => void
}

export function StepPaymentGPay({
  selectedServiceObj,
  selectedDate,
  selectedTime,
  clientName,
  clientEmail,
  clientPhone,
  upiRef,
  paymentScreenshot,
  isSubmitting,
  onChangeUpiRef,
  onChangePaymentScreenshot,
  onSubmitBooking,
  onCashfreeSuccess
}: StepPaymentGPayProps) {
  // Primary payment mode is Cashfree gateway, with manual UPI QR as secondary fallback
  const [paymentMode, setPaymentMode] = useState<'cashfree' | 'manual'>('cashfree')

  // Cashfree states
  const [isCashfreeLoading, setIsCashfreeLoading] = useState(false)
  const [cashfreeError, setCashfreeError] = useState<string | null>(null)
  const [cashfreeVerified, setCashfreeVerified] = useState(false)

  // Manual QR states
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

  // Standard NPCI UPI URI
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
          setCashfreeError('Payment popup was closed or cancelled. You can retry or switch to the manual QR transfer tab.')
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
            setCashfreeVerified(true)
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
          console.warn('Cashfree backend verification fallback:', vErr)
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
      const msg = err.response?.data?.message || err.message || 'Unable to open Cashfree payment gateway. Please try again or use the QR code.'
      setCashfreeError(msg)
      setIsCashfreeLoading(false)
    }
  }

  const canSubmitManual = Boolean(paymentScreenshot)

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: brandColors.text, fontWeight: 800, mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Complete Payment
        </Typography>
        <Typography variant="body2" sx={{ color: brandColors.muted }}>
          Choose your preferred payment method to secure your slot for <strong>₹{payableAmount}</strong>.
        </Typography>
      </Box>

      {/* Payment Method Selector Tabs */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={1.5}>
          {/* Option 1: Cashfree Gateway (Primary) */}
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              onClick={() => { setPaymentMode('cashfree'); setCashfreeError(null); }}
              sx={{
                p: 2,
                borderRadius: '16px',
                cursor: 'pointer',
                border: paymentMode === 'cashfree'
                  ? `2px solid ${brandColors.primary}`
                  : `1px solid ${brandColors.border}`,
                backgroundColor: paymentMode === 'cashfree'
                  ? alpha(brandColors.primary, 0.05)
                  : '#fff',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: brandColors.primary,
                  boxShadow: '0 4px 20px rgba(10,102,194,0.1)'
                }
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  backgroundColor: paymentMode === 'cashfree' ? brandColors.primary : '#F1F5F9',
                  color: paymentMode === 'cashfree' ? '#fff' : brandColors.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FiCreditCard size={22} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: brandColors.text }}>
                    Online Payment (Cashfree)
                  </Typography>
                  <Chip
                    label="Primary"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      backgroundColor: '#10B981',
                      color: '#fff'
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mt: 0.3 }}>
                  UPI, Cards, NetBanking • Instant Confirmation
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Option 2: Manual UPI QR (Secondary Fallback) */}
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              onClick={() => setPaymentMode('manual')}
              sx={{
                p: 2,
                borderRadius: '16px',
                cursor: 'pointer',
                border: paymentMode === 'manual'
                  ? `2px solid ${brandColors.primary}`
                  : `1px solid ${brandColors.border}`,
                backgroundColor: paymentMode === 'manual'
                  ? alpha(brandColors.primary, 0.05)
                  : '#fff',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': {
                  borderColor: brandColors.border,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  backgroundColor: paymentMode === 'manual' ? brandColors.primary : '#F1F5F9',
                  color: paymentMode === 'manual' ? '#fff' : brandColors.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FiSmartphone size={22} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text }}>
                    Manual UPI QR Transfer
                  </Typography>
                  <Chip
                    label="Fallback"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: '#E2E8F0',
                      color: '#475569'
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mt: 0.3 }}>
                  Scan GPay QR & upload screenshot
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* ─── TAB 1: CASHFREE GATEWAY (PRIMARY) ─── */}
      {paymentMode === 'cashfree' && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: '24px',
            border: `1.5px solid ${alpha(brandColors.primary, 0.25)}`,
            background: 'linear-gradient(135deg, #ffffff 0%, #F8FAFC 100%)',
            boxShadow: '0 12px 35px rgba(10,102,194,0.08)',
          }}
        >
          {cashfreeError && (
            <Alert
              severity="warning"
              icon={<FiAlertCircle />}
              sx={{ mb: 3, borderRadius: '14px', fontSize: '0.85rem' }}
              action={
                <Button color="inherit" size="small" onClick={() => setPaymentMode('manual')}>
                  Use QR Code
                </Button>
              }
            >
              {cashfreeError}
            </Alert>
          )}

          <Grid container spacing={3} alignItems="center">
            {/* Left summary */}
            <Grid item xs={12} md={7}>
              <Box sx={{ pr: { md: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    icon={<FiShield color="#0A66C2" />}
                    label="PCI-DSS Level 1 Encrypted"
                    size="small"
                    sx={{
                      backgroundColor: alpha(brandColors.primary, 0.1),
                      color: brandColors.primary,
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  />
                  <Chip
                    icon={<FiCheckCircle color="#10B981" />}
                    label="Instant Slot Activation"
                    size="small"
                    sx={{
                      backgroundColor: '#ECFDF5',
                      color: '#065F46',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text, mb: 0.5 }}>
                  {selectedServiceObj?.name || 'BrandIt Package'}
                </Typography>

                <Typography variant="body2" sx={{ color: brandColors.muted, mb: 2 }}>
                  Scheduled for <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>
                </Typography>

                {/* Supported payment badges */}
                <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.text, display: 'block', mb: 1, letterSpacing: '0.04em' }}>
                  ACCEPTED PAYMENT MODES VIA CASHFREE:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 3 }}>
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Visa / Mastercard', 'RuPay Cards', 'Net Banking (50+ Banks)', 'Cred & Wallets'].map(m => (
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: brandColors.muted }}>
                  <FiLock size={15} color={brandColors.success} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Powered by Cashfree Payments India Pvt. Ltd. Official Merchant Account.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right checkout action */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  backgroundColor: '#fff',
                  border: `1px solid ${brandColors.border}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Payable Amount
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: brandColors.text, my: 0.5 }}>
                  ₹{payableAmount}
                </Typography>
                <Typography variant="caption" sx={{ color: brandColors.success, fontWeight: 700, display: 'block', mb: 2.5 }}>
                  ✓ All taxes &amp; fees included
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleCashfreePayment}
                  disabled={isCashfreeLoading || isSubmitting}
                  startIcon={isCashfreeLoading ? <CircularProgress size={20} color="inherit" /> : <FiCreditCard />}
                  endIcon={!isCashfreeLoading && <FiArrowRight />}
                  sx={{
                    py: 1.8,
                    borderRadius: '14px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    textTransform: 'none',
                    backgroundColor: brandColors.primary,
                    boxShadow: '0 8px 24px rgba(10,102,194,0.3)',
                    '&:hover': {
                      backgroundColor: '#084e96',
                      boxShadow: '0 12px 28px rgba(10,102,194,0.4)',
                    }
                  }}
                >
                  {isCashfreeLoading ? 'Opening Cashfree...' : `Pay ₹${payableAmount} via Cashfree`}
                </Button>

                <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mt: 1.5, fontSize: '0.72rem' }}>
                  Opens safe popup checkout. Your session will not be refreshed.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* ─── TAB 2: MANUAL UPI QR (SECONDARY FALLBACK) ─── */}
      {paymentMode === 'manual' && (
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
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: brandColors.text }}>
                    Google Pay / UPI QR
                  </Typography>
                  <Chip
                    icon={<FiShield size={12} color={brandColors.success} />}
                    label="Direct UPI"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: alpha(brandColors.success, 0.1),
                      color: brandColors.success
                    }}
                  />
                </Box>

                {/* Amount Pill */}
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: 0.5,
                  px: 2,
                  py: 0.4,
                  borderRadius: '20px',
                  backgroundColor: alpha(brandColors.primary, 0.08),
                  mb: 2
                }}>
                  <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>Amount:</Typography>
                  <Typography variant="subtitle2" sx={{ color: brandColors.primary, fontWeight: 800 }}>₹{payableAmount}</Typography>
                </Box>

                {/* QR Code Container */}
                <Box sx={{
                  p: 1.5,
                  borderRadius: '16px',
                  border: `1.5px solid ${brandColors.border}`,
                  backgroundColor: '#fff',
                  display: 'inline-block',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  position: 'relative'
                }}>
                  {showBackupQr ? (
                    <QRCodeSVG
                      value={upiUri}
                      size={180}
                      level="H"
                      includeMargin={false}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={gpayQr}
                      alt="Google Pay QR Code"
                      sx={{
                        width: 180,
                        height: 180,
                        objectFit: 'contain',
                        display: 'block',
                        borderRadius: '8px'
                      }}
                      onError={() => setShowBackupQr(true)}
                    />
                  )}
                </Box>

                <Typography variant="caption" sx={{ display: 'block', color: brandColors.muted, mt: 1, fontSize: '0.75rem' }}>
                  Scan using Google Pay, PhonePe, Paytm, or BHIM
                </Typography>
              </Box>

              {/* UPI ID Copy Field */}
              <Box sx={{ width: '100%', mt: 2 }}>
                <Box sx={{
                  p: 1.2,
                  borderRadius: '12px',
                  border: `1px dashed ${brandColors.border}`,
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1
                }}>
                  <Box sx={{ textAlign: 'left', minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', fontSize: '0.65rem' }}>
                      UPI ID:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text, fontSize: '0.8rem', wordBreak: 'break-all' }}>
                      {UPI_VPA}
                    </Typography>
                  </Box>
                  <Tooltip title={copiedUpi ? "Copied!" : "Copy UPI ID"}>
                    <IconButton
                      size="small"
                      onClick={handleCopyUpi}
                      sx={{
                        color: copiedUpi ? brandColors.success : brandColors.primary,
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        '&:hover': { backgroundColor: '#F1F5F9' }
                      }}
                    >
                      {copiedUpi ? <FiCheck size={16} /> : <FiCopy size={16} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Screenshot Upload & Submission */}
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
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: brandColors.text, mb: 0.5 }}>
                  Upload Payment Proof
                </Typography>
                <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mb: 2 }}>
                  After transferring <strong>₹{payableAmount}</strong> via UPI, upload the success screenshot.
                </Typography>

                {/* Screenshot Upload Box */}
                <Box sx={{ mb: 2 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="payment-screenshot-upload"
                  />

                  {paymentScreenshot ? (
                    <Box sx={{
                      p: 1.5,
                      borderRadius: '14px',
                      border: `1.5px solid ${brandColors.success}`,
                      backgroundColor: alpha(brandColors.success, 0.05),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                        <Box
                          component="img"
                          src={paymentScreenshot}
                          alt="Screenshot Preview"
                          sx={{
                            width: 44,
                            height: 44,
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: `1px solid ${brandColors.border}`
                          }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FiCheckCircle size={14} color={brandColors.success} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.success }}>
                              Uploaded
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{
                            fontWeight: 600,
                            color: brandColors.text,
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px'
                          }}>
                            {fileName || 'payment_proof.jpg'}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={handleRemoveScreenshot}
                        sx={{ color: '#DC2626', '&:hover': { backgroundColor: alpha('#DC2626', 0.1) } }}
                      >
                        <FiTrash2 size={16} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        p: 2.5,
                        borderRadius: '16px',
                        border: `2px dashed ${uploadError ? '#DC2626' : brandColors.primary}`,
                        backgroundColor: uploadError ? alpha('#DC2626', 0.02) : alpha(brandColors.primary, 0.02),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(brandColors.primary, 0.05),
                          borderColor: brandColors.primary
                        }
                      }}
                    >
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: alpha(brandColors.primary, 0.1),
                        color: brandColors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1
                      }}>
                        <FiUploadCloud size={20} />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text, mb: 0.2 }}>
                        Click to upload screenshot
                      </Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted, fontSize: '0.75rem' }}>
                        PNG, JPG, or WebP (auto-compressed)
                      </Typography>
                    </Box>
                  )}

                  {uploadError && (
                    <Typography variant="caption" sx={{ color: '#DC2626', mt: 0.8, display: 'block', fontWeight: 600 }}>
                      {uploadError}
                    </Typography>
                  )}
                </Box>

                {/* Optional UTR / Reference */}
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

              {/* Submission Button */}
              <Box sx={{ mt: 2 }}>
                {!canSubmitManual && (
                  <Alert severity="info" sx={{ mb: 2, borderRadius: '12px', fontSize: '0.8rem', py: 0.5 }}>
                    Please upload your payment screenshot to proceed.
                  </Alert>
                )}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={onSubmitBooking}
                  disabled={!canSubmitManual || isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <FiCheckCircle />}
                  sx={{
                    py: 1.6,
                    borderRadius: '14px',
                    fontWeight: 800,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    textTransform: 'none',
                    backgroundColor: brandColors.primary,
                    boxShadow: canSubmitManual ? '0 8px 24px rgba(10,102,194,0.25)' : 'none',
                    '&:hover': { backgroundColor: '#084e96' }
                  }}
                >
                  {isSubmitting ? 'Submitting Booking...' : 'Confirm Payment & Submit Booking'}
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8, mt: 1.8, color: brandColors.muted }}>
                  <FiShield color={brandColors.success} size={15} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.muted, fontSize: '0.75rem' }}>
                    Manual UPI transfer • Verification within 24 hours
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}