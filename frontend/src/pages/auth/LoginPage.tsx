import { useState } from 'react'
import {
  Box, Typography, TextField, Button, Link, IconButton,
  InputAdornment, alpha, CircularProgress, Alert, Chip
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEye, FiEyeOff, FiArrowRight, FiBriefcase, FiUsers } from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../../components/common/BrandLogo'

type UserType = 'client' | 'team'

export default function LoginPage() {
  // Step 1: role selection, Step 2: login form
  const [step, setStep] = useState<1 | 2>(1)
  const [userType, setUserType] = useState<UserType | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSelectRole = (type: UserType) => {
    setUserType(type)
    setStep(2)
    setError(null)
  }

  const validateForm = () => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.')
      return false
    }
    if (!password) {
      setError('Password is required.')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validateForm()) return

    setLoading(true)
    try {
      await login(email, password)
      // Admin redirect by email
      if (email.toLowerCase() === 'raghavdhir1510@gmail.com') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roleConfig = {
    client: {
      icon: <FiBriefcase size={26} />,
      title: 'Sign in as Client',
      subtitle: 'Access your dashboard, bookings, and services',
      color: brandColors.primary,
    },
    team: {
      icon: <FiUsers size={26} />,
      title: 'Sign in as Team Member',
      subtitle: 'Access admin tools, team resources, and management panel',
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
                <Typography variant="h3" sx={{ mb: 0.75 }}>Welcome back</Typography>
                <Typography variant="body2" sx={{ color: brandColors.muted, mb: 4 }}>
                  Who are you signing in as today?
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {(['client', 'team'] as UserType[]).map((type) => {
                    const cfg = roleConfig[type]
                    return (
                      <Box
                        key={type}
                        id={`login-role-${type}`}
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
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/register" underline="hover" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                    Create account
                  </Link>
                </Typography>
              </motion.div>
            )}

            {/* ── STEP 2: Login Form ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
                  <Typography variant="h3">Welcome back</Typography>
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
                  Sign in to access your dashboard & services.{' '}
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
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth id="login-email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined" size="medium"
                    sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text }}>
                      Password
                    </Typography>
                    <Link component={RouterLink} to="/forgot-password" variant="caption" underline="hover"
                      sx={{ color: brandColors.primary, fontWeight: 600 }}>
                      Forgot password?
                    </Link>
                  </Box>
                  <TextField
                    fullWidth id="login-password"
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
                    id="login-submit"
                    type="submit" fullWidth variant="contained" disabled={loading}
                    endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiArrowRight size={18} />}
                    sx={{
                      py: 1.5, borderRadius: '12px',
                      backgroundColor: userType === 'team' ? '#7C3AED' : brandColors.primary,
                      fontWeight: 700, fontSize: '0.95rem', textTransform: 'none',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                      '&:hover': {
                        backgroundColor: userType === 'team'
                          ? alpha('#7C3AED', 0.9)
                          : alpha(brandColors.primary, 0.9),
                      },
                    }}
                  >
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </Button>
                </Box>

                <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: brandColors.muted }}>
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/register" underline="hover" sx={{ color: brandColors.primary, fontWeight: 700 }}>
                    Create account
                  </Link>
                </Typography>
              </motion.div>
            )}

          </AnimatePresence>
        </Box>
      </motion.div>
    </Box>
  )
}
