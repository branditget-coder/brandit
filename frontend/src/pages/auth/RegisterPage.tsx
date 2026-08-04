import { useState, useEffect } from 'react'
import {
  Box, Typography, TextField, Button, Link, InputAdornment,
  IconButton, alpha, CircularProgress, Grid, Alert, Chip
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiEye, FiEyeOff, FiArrowRight, FiBriefcase, FiUsers,
  FiCheckCircle, FiShield, FiMail, FiRefreshCw, FiArrowLeft
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../../components/common/BrandLogo'

type UserType = 'client' | 'team'

export default function RegisterPage() {
  // Step 1: role selection, Step 2: form details, Step 3: 4-digit OTP verification
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [userType, setUserType] = useState<UserType | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  // Step 3 OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', ''])
  const [resendTimer, setResendTimer] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [infoMsg, setInfoMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()
  const { register, sendOtp } = useAuth()

  useEffect(() => {
    let timer: any
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [resendTimer])

  const handleSelectRole = (type: UserType) => {
    setUserType(type)
    setStep(2)
    setError(null)
  }

  const validateForm = () => {
    if (!firstName.trim()) { setError('First name is required.'); return false }
    if (!lastName.trim()) { setError('Last name is required.'); return false }
    if (!email || !email.includes('@') || !email.includes('.')) { setError('Please enter a valid email address.'); return false }
    if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return false }
    return true
  }

  const handleProceedToOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfoMsg(null)
    if (!validateForm()) return

    setLoading(true)
    try {
      await sendOtp(email.trim(), firstName.trim())
      setStep(3)
      setInfoMsg(`A 4-digit verification code has been sent to ${email.trim()}`)
      setResendTimer(30)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send verification email. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setError(null)
    setInfoMsg(null)
    setLoading(true)
    try {
      await sendOtp(email.trim(), firstName.trim())
      setInfoMsg(`A fresh 4-digit verification code has been sent to ${email.trim()}`)
      setResendTimer(30)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const code = otpDigits.join('')
    if (code.length < 4) {
      setError('Please enter the complete 4-digit verification code.')
      return
    }

    setLoading(true)
    try {
      const newUser = await register(
        firstName,
        lastName,
        email,
        password,
        phone,
        userType === 'team' ? 'TEAM' : 'USER',
        code
      )
      localStorage.setItem('brandit_is_new_user', 'true')
      setSuccess(true)
      setTimeout(() => {
        const defaultRoute = newUser.role === 'ADMIN' ? '/admin' : newUser.role === 'TEAM' ? '/team' : '/dashboard'
        navigate(defaultRoute)
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please check the 4-digit code.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '')
    if (clean.length > 1) {
      const digits = clean.slice(0, 4).split('')
      const newOtp = ['', '', '', '']
      digits.forEach((d, i) => { if (i < 4) newOtp[i] = d })
      setOtpDigits(newOtp)
      const nextInput = document.getElementById('otp-input-3')
      nextInput?.focus()
      return
    }

    const newOtp = [...otpDigits]
    newOtp[index] = clean
    setOtpDigits(newOtp)

    if (clean && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`)
      prevInput?.focus()
    }
  }

  const roleConfig = {
    client: {
      icon: <FiBriefcase size={26} />,
      title: 'I\'m a Client',
      subtitle: 'Looking for branding, career coaching, or consulting services',
      color: brandColors.primary,
    },
    team: {
      icon: <FiUsers size={26} />,
      title: 'I\'m a Team Member',
      subtitle: 'Part of the BrandIt team — mentors, coaches, and specialists',
      color: '#7C3AED',
    },
  }

  return (
    <Box sx={{ width: '100%' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <BrandLogo variant="dark" size="medium" showSlogan={true} />
        </Box>

        <Box sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: '24px',
          border: `1px solid ${brandColors.border}`,
          backgroundColor: '#fff',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Role Selection ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h3" sx={{ mb: 0.75 }}>Create your account</Typography>
                <Typography variant="body2" sx={{ color: brandColors.muted, mb: 4 }}>
                  First, tell us who you are so we can personalise your experience.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {(['client', 'team'] as UserType[]).map((type) => {
                    const cfg = roleConfig[type]
                    return (
                      <Box
                        key={type}
                        id={`register-role-${type}`}
                        onClick={() => handleSelectRole(type)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2.5,
                          borderRadius: '16px',
                          border: `1.5px solid ${brandColors.border}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: cfg.color,
                            backgroundColor: alpha(cfg.color, 0.04),
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 24px ${alpha(cfg.color, 0.12)}`,
                          },
                        }}
                      >
                        <Box sx={{
                          width: 52, height: 52, borderRadius: '14px',
                          backgroundColor: alpha(cfg.color, 0.1),
                          color: cfg.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {cfg.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brandColors.text }}>
                            {cfg.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block' }}>
                            {cfg.subtitle}
                          </Typography>
                        </Box>
                        <FiArrowRight size={18} color={brandColors.muted} />
                      </Box>
                    )
                  })}
                </Box>

                <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: brandColors.muted }}>
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" underline="hover" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                    Sign in
                  </Link>
                </Typography>
              </motion.div>
            )}

            {/* ── STEP 2: Registration Form ── */}
            {step === 2 && !success && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
                  <Typography variant="h3">Create your account</Typography>
                  <Chip
                    label={userType === 'client' ? 'Client' : 'Team Member'}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      backgroundColor: alpha(userType === 'team' ? '#7C3AED' : brandColors.primary, 0.1),
                      color: userType === 'team' ? '#7C3AED' : brandColors.primary,
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3 }}>
                  Fill in your details below. We will send a 4-digit verification code to your email.{' '}
                  <Box
                    component="span"
                    onClick={() => { setStep(1); setError(null) }}
                    sx={{ color: brandColors.primary, cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Change role
                  </Box>
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

                <Box component="form" onSubmit={handleProceedToOtp}>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
                        First Name *
                      </Typography>
                      <TextField
                        fullWidth id="register-first-name"
                        placeholder="Raghav"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        variant="outlined" size="medium"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
                        Last Name *
                      </Typography>
                      <TextField
                        fullWidth id="register-last-name"
                        placeholder="Dhir"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        variant="outlined" size="medium"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </Grid>
                  </Grid>

                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
                    Email Address * (OTP verification code will be sent here)
                  </Typography>
                  <TextField
                    fullWidth id="register-email"
                    placeholder="raghav@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined" size="medium"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
                    Phone Number (Optional)
                  </Typography>
                  <TextField
                    fullWidth id="register-phone"
                    placeholder="+91 82644XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    variant="outlined" size="medium"
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
                    Password (Min 8 characters) *
                  </Typography>
                  <TextField
                    fullWidth id="register-password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined" size="medium"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowPwd(!showPwd)} edge="end">
                            {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <Button
                    id="register-submit"
                    type="submit" fullWidth variant="contained" disabled={loading}
                    endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiArrowRight size={18} />}
                    sx={{
                      py: 1.5, borderRadius: '12px',
                      backgroundColor: brandColors.primary,
                      fontWeight: 700, fontSize: '0.95rem', textTransform: 'none',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                      '&:hover': { backgroundColor: alpha(brandColors.primary, 0.9) },
                    }}
                  >
                    {loading ? 'Sending 4-Digit Code...' : 'Send Verification OTP →'}
                  </Button>
                </Box>

                <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: brandColors.muted }}>
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" underline="hover" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                    Sign in
                  </Link>
                </Typography>
              </motion.div>
            )}

            {/* ── STEP 3: 4-Digit OTP Verification ── */}
            {step === 3 && !success && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Box sx={{
                    width: 64, height: 64, borderRadius: '50%',
                    backgroundColor: alpha(brandColors.primary, 0.1),
                    color: brandColors.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 2,
                  }}>
                    <FiShield size={32} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Verify Email Address</Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted, maxWidth: 360, mx: 'auto' }}>
                    Enter the 4-digit security code sent to <strong>{email}</strong>
                  </Typography>
                </Box>

                {infoMsg && <Alert severity="success" icon={<FiMail size={18} />} sx={{ mb: 3, borderRadius: '12px' }}>{infoMsg}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

                <Box component="form" onSubmit={handleVerifyOtpAndRegister}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                    {otpDigits.map((digit, idx) => (
                      <TextField
                        key={idx}
                        id={`otp-input-${idx}`}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleOtpKeyDown(idx, e)}
                        inputProps={{
                          maxLength: 1,
                          style: {
                            textAlign: 'center',
                            fontSize: '1.75rem',
                            fontWeight: 800,
                            padding: '12px 0',
                            fontFamily: 'monospace',
                            color: brandColors.primary,
                          },
                        }}
                        sx={{
                          width: 56,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '14px',
                            backgroundColor: alpha(brandColors.primary, 0.03),
                            borderColor: digit ? brandColors.primary : brandColors.border,
                            '&.Mui-focused': {
                              boxShadow: `0 0 0 3px ${alpha(brandColors.primary, 0.2)}`,
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>

                  <Button
                    id="otp-submit"
                    type="submit" fullWidth variant="contained" disabled={loading}
                    endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiCheckCircle size={18} />}
                    sx={{
                      py: 1.5, borderRadius: '12px',
                      backgroundColor: brandColors.primary,
                      fontWeight: 700, fontSize: '1rem', textTransform: 'none',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                      '&:hover': { backgroundColor: alpha(brandColors.primary, 0.9) },
                    }}
                  >
                    {loading ? 'Verifying Code...' : 'Verify & Create Account'}
                  </Button>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      startIcon={<FiArrowLeft size={16} />}
                      onClick={() => { setStep(2); setError(null); setInfoMsg(null) }}
                      sx={{ textTransform: 'none', color: brandColors.muted, fontWeight: 600 }}
                    >
                      Edit details
                    </Button>

                    <Button
                      startIcon={<FiRefreshCw size={14} className={loading ? 'spin' : ''} />}
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0 || loading}
                      sx={{ textTransform: 'none', color: brandColors.primary, fontWeight: 700 }}
                    >
                      {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* ── Success State ── */}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{
                    width: 72, height: 72, borderRadius: '50%',
                    backgroundColor: alpha('#10B981', 0.1),
                    color: '#10B981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 3,
                  }}>
                    <FiCheckCircle size={36} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Account Created & Verified!</Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted }}>
                    Your email address has been successfully verified. Redirecting to your dashboard...
                  </Typography>
                </Box>
              </motion.div>
            )}

          </AnimatePresence>
        </Box>
      </motion.div>
    </Box>
  )
}
