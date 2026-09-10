import { useState, useEffect } from 'react'
import {
  Box, Typography, TextField, Button, Link, InputAdornment,
  IconButton, alpha, CircularProgress, Grid, Alert, Chip,
  FormControl, Select, MenuItem
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiEye, FiEyeOff, FiArrowRight, FiBriefcase, FiUsers,
  FiCheckCircle, FiMail, FiRefreshCw, FiKey, FiCalendar
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../../components/common/BrandLogo'
import SEO from '../../components/common/SEO'

type UserType = 'client' | 'team'

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [userType, setUserType] = useState<UserType | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDay, setBirthDay] = useState<string>('')
  const [birthMonth, setBirthMonth] = useState<string>('')
  const [birthYear, setBirthYear] = useState<string>('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  // 4-Digit OTP state
  const [otp, setOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)

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

  const validateBasicForm = () => {
    if (!firstName.trim()) { setError('First name is required.'); return false }
    if (!lastName.trim()) { setError('Last name is required.'); return false }
    if (!email || !email.includes('@') || !email.includes('.')) { setError('Please enter a valid email address.'); return false }
    
    if (!birthDay || !birthMonth || !birthYear) {
      setError('Date of birth (Day, Month, and Year) is mandatory. Please fill in all 3 fields.');
      return false
    }

    const d = parseInt(birthDay, 10)
    const m = parseInt(birthMonth, 10)
    const y = parseInt(birthYear, 10)
    if (isNaN(d) || d < 1 || d > 31 || isNaN(m) || m < 1 || m > 12 || isNaN(y) || y < 1920 || y > 2026) {
      setError('Please select a valid Date of Birth.');
      return false
    }

    // Days in month validation
    const maxDays = new Date(y, m, 0).getDate()
    if (d > maxDays) {
      setError(`Invalid date: Selected month only has ${maxDays} days.`);
      return false
    }

    if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return false }
    return true
  }

  const handleSendOtp = async () => {
    if (resendTimer > 0 || sendingOtp) return
    setError(null)
    setInfoMsg(null)

    if (!validateBasicForm()) return

    setSendingOtp(true)
    try {
      await sendOtp(email.trim(), firstName.trim())
      setOtpSent(true)
      setInfoMsg(`📩 A 4-digit verification code has been sent to ${email.trim()}. Please enter the code below.`)
      setResendTimer(30)
      const otpInput = document.getElementById('register-otp')
      otpInput?.focus()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send verification email. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfoMsg(null)

    if (!validateBasicForm()) return

    const cleanOtp = otp.trim()
    if (!cleanOtp) {
      // If user clicks Create Account without sending OTP first, trigger OTP dispatch automatically!
      setSendingOtp(true)
      try {
        await sendOtp(email.trim(), firstName.trim())
        setOtpSent(true)
        setInfoMsg(`📩 A 4-digit verification code has been sent to ${email.trim()}. Please enter the code below to complete registration.`)
        setResendTimer(30)
        const otpInput = document.getElementById('register-otp')
        otpInput?.focus()
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to send verification email. Please try again.')
      } finally {
        setSendingOtp(false)
      }
      return
    }

    if (cleanOtp.length < 4) {
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
        parseInt(birthDay, 10),
        parseInt(birthMonth, 10),
        parseInt(birthYear, 10),
        phone,
        userType === 'team' ? 'TEAM' : 'USER',
        cleanOtp
      )
      localStorage.setItem('brandit_is_new_user', 'true')
      setSuccess(true)
      setTimeout(() => {
        const defaultRoute = newUser.role === 'ADMIN' ? '/admin' : newUser.role === 'TEAM' ? '/team' : '/dashboard'
        navigate(defaultRoute)
      }, 1500)
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || ''
      if (serverMsg.includes('verification code has been sent') || serverMsg.includes('code is required')) {
        setOtpSent(true)
        setInfoMsg(`📩 A 4-digit verification code has been sent to ${email.trim()}. Please enter the code below.`)
        if (resendTimer === 0) setResendTimer(30)
      } else {
        setError(serverMsg || 'Registration failed. Please check your 4-digit verification code.')
      }
    } finally {
      setLoading(false)
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
      <SEO
        title="Create Account"
        description="Create your BrandIt account to accelerate your personal brand, manage LinkedIn consultation sessions, and access growth services."
        canonicalUrl="https://go-brandit.vercel.app/register"
      />
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

            {/* ── STEP 2: Registration Form with OTP Field & Resend Button ── */}
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
                <Typography variant="body2" sx={{ color: brandColors.muted, mb: 2 }}>
                  Fill in your details below to get started.{' '}
                  <Box
                    component="span"
                    onClick={() => { setStep(1); setError(null); setInfoMsg(null) }}
                    sx={{ color: brandColors.primary, cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Change role
                  </Box>
                </Typography>

                {userType === 'team' && (
                  <Alert severity="warning" sx={{ mb: 2.5, borderRadius: '12px', fontSize: '0.85rem' }}>
                    <strong>🔒 Team Member Access Notice:</strong> Team accounts are restricted to the 5 authorized BrandIt core team members (Raghav, Kritika, Hritika, Stuti, Yash). Any other email address will automatically register as a Client account.
                  </Alert>
                )}

                {infoMsg && (
                  <Alert severity="info" icon={<FiMail size={18} />} sx={{ mb: 3, borderRadius: '12px' }}>
                    {infoMsg}
                  </Alert>
                )}

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
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
                    Email Address *
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

                  {/* ── MANDATORY DATE OF BIRTH (DAY, MONTH, YEAR) ── */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.text, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FiCalendar size={14} color={brandColors.primary} />
                      Date of Birth * (Mandatory)
                    </Typography>
                    <Grid container spacing={1.5}>
                      {/* Day */}
                      <Grid item xs={4}>
                        <FormControl fullWidth size="medium">
                          <Select
                            id="register-birth-day"
                            displayEmpty
                            value={birthDay}
                            onChange={(e) => setBirthDay(e.target.value as string)}
                            sx={{
                              borderRadius: '12px',
                              '& .MuiSelect-select': { py: 1.6, fontSize: '0.9rem' },
                            }}
                          >
                            <MenuItem value="" disabled>
                              <em>Day *</em>
                            </MenuItem>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <MenuItem key={d} value={d.toString()}>
                                {d < 10 ? `0${d}` : d}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Month */}
                      <Grid item xs={4}>
                        <FormControl fullWidth size="medium">
                          <Select
                            id="register-birth-month"
                            displayEmpty
                            value={birthMonth}
                            onChange={(e) => setBirthMonth(e.target.value as string)}
                            sx={{
                              borderRadius: '12px',
                              '& .MuiSelect-select': { py: 1.6, fontSize: '0.9rem' },
                            }}
                          >
                            <MenuItem value="" disabled>
                              <em>Month *</em>
                            </MenuItem>
                            {[
                              { val: '1', label: '01 - Jan' },
                              { val: '2', label: '02 - Feb' },
                              { val: '3', label: '03 - Mar' },
                              { val: '4', label: '04 - Apr' },
                              { val: '5', label: '05 - May' },
                              { val: '6', label: '06 - Jun' },
                              { val: '7', label: '07 - Jul' },
                              { val: '8', label: '08 - Aug' },
                              { val: '9', label: '09 - Sep' },
                              { val: '10', label: '10 - Oct' },
                              { val: '11', label: '11 - Nov' },
                              { val: '12', label: '12 - Dec' },
                            ].map((m) => (
                              <MenuItem key={m.val} value={m.val}>
                                {m.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Year */}
                      <Grid item xs={4}>
                        <FormControl fullWidth size="medium">
                          <Select
                            id="register-birth-year"
                            displayEmpty
                            value={birthYear}
                            onChange={(e) => setBirthYear(e.target.value as string)}
                            sx={{
                              borderRadius: '12px',
                              '& .MuiSelect-select': { py: 1.6, fontSize: '0.9rem' },
                            }}
                          >
                            <MenuItem value="" disabled>
                              <em>Year *</em>
                            </MenuItem>
                            {Array.from({ length: 90 }, (_, i) => 2026 - i).map((y) => (
                              <MenuItem key={y} value={y.toString()}>
                                {y}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>

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
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  {/* ── 4-DIGIT VERIFICATION OTP FIELD WITH RESEND BUTTON NEXT TO IT ── */}
                  <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.primary, mb: 0.5, display: 'block' }}>
                    4-Digit Verification Code (OTP) *
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 3, alignItems: 'stretch' }}>
                    <TextField
                      fullWidth
                      id="register-otp"
                      placeholder="Enter 4-digit OTP code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      variant="outlined"
                      size="medium"
                      inputProps={{ maxLength: 4 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiKey color={brandColors.primary} size={18} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          letterSpacing: '4px',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          fontFamily: 'monospace',
                        },
                      }}
                    />
                    <Button
                      id="resend-otp-btn"
                      variant="outlined"
                      onClick={handleSendOtp}
                      disabled={resendTimer > 0 || sendingOtp}
                      startIcon={sendingOtp ? <CircularProgress size={16} color="inherit" /> : <FiRefreshCw size={14} />}
                      sx={{
                        whiteSpace: 'nowrap',
                        px: 2.5,
                        borderRadius: '12px',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderColor: brandColors.primary,
                        color: brandColors.primary,
                        '&:hover': {
                          borderColor: brandColors.primary,
                          backgroundColor: alpha(brandColors.primary, 0.05),
                        },
                      }}
                    >
                      {sendingOtp
                        ? 'Sending...'
                        : resendTimer > 0
                        ? `Resend (${resendTimer}s)`
                        : otpSent
                        ? 'Resend OTP'
                        : 'Send OTP'}
                    </Button>
                  </Box>

                  <Button
                    id="register-submit"
                    type="submit" fullWidth variant="contained" disabled={loading || sendingOtp}
                    endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiArrowRight size={18} />}
                    sx={{
                      py: 1.5, borderRadius: '12px',
                      backgroundColor: brandColors.primary,
                      fontWeight: 700, fontSize: '0.95rem', textTransform: 'none',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                      '&:hover': { backgroundColor: alpha(brandColors.primary, 0.9) },
                    }}
                  >
                    {loading ? 'Verifying & Creating Account...' : 'Create Account →'}
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
                    Setting up your account & redirecting to your dashboard...
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
