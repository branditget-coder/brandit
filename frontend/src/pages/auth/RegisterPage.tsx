import { useState } from 'react'
import {
  Box, Typography, TextField, Button, Link, InputAdornment,
  IconButton, alpha, CircularProgress, Grid, Alert, Chip
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEye, FiEyeOff, FiArrowRight, FiBriefcase, FiUsers, FiCheckCircle } from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../../components/common/BrandLogo'

type UserType = 'client' | 'team'

export default function RegisterPage() {
  // Step 1: role selection, Step 2: form
  const [step, setStep] = useState<1 | 2>(1)
  const [userType, setUserType] = useState<UserType | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()
  const { register } = useAuth()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validateForm()) return

    setLoading(true)
    try {
      await register(firstName, lastName, email, password, phone, userType === 'team' ? 'TEAM' : 'USER')
      // After register, clear session data — user must log in manually
      localStorage.removeItem('brandit_access_token')
      localStorage.removeItem('brandit_refresh_token')
      localStorage.removeItem('brandit_user')
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
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
                  Fill in your details to get started.{' '}
                  <Box
                    component="span"
                    onClick={() => { setStep(1); setError(null) }}
                    sx={{ color: brandColors.primary, cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Change role
                  </Box>
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

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
                    {loading ? 'Creating Account...' : 'Create Account'}
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
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Account Created!</Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted }}>
                    Redirecting you to sign in...
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
