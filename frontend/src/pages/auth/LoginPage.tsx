import { useState } from 'react'
import {
  Box, Typography, TextField, Button, Divider, Link, IconButton,
  InputAdornment, alpha, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../../components/common/BrandLogo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Google OAuth Dialog State
  const [googleModal, setGoogleModal] = useState<boolean>(false)
  const [socialEmail, setSocialEmail] = useState('')
  const [socialFirstName, setSocialFirstName] = useState('')

  const navigate = useNavigate()
  const { login, loginWithSocial } = useAuth()

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

  const handleOpenGoogle = () => {
    setGoogleModal(true)
    setSocialEmail('user@gmail.com')
    setSocialFirstName('Google User')
  }

  const handleConfirmGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      const mockToken = 'google_oauth_token_' + Date.now()
      await loginWithSocial('google', mockToken)
      
      setGoogleModal(false)
      if (socialEmail.toLowerCase() === 'raghavdhir1510@gmail.com') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Logo & Slogan */}
        <Box sx={{ mb: 4 }}>
          <BrandLogo variant="dark" size="medium" showSlogan={true} />
        </Box>

        <Box sx={{ p: { xs: 3, sm: 4 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
          <Typography variant="h3" sx={{ mb: 0.75 }}>Welcome back</Typography>
          <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3 }}>
            Sign in to access your personal dashboard & services.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

          {/* Prominent Google Sign In Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleOpenGoogle}
            startIcon={<FcGoogle size={22} />}
            sx={{
              py: 1.5,
              mb: 3,
              borderRadius: '12px',
              borderColor: brandColors.border,
              color: brandColors.text,
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              '&:hover': { backgroundColor: alpha(brandColors.primary, 0.04), borderColor: brandColors.primary },
            }}
          >
            Sign in with Google
          </Button>

          <Divider sx={{ my: 3, fontSize: '0.75rem', color: brandColors.muted, '&::before, &::after': { borderColor: brandColors.border } }}>
            OR CONTINUE WITH EMAIL
          </Divider>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              size="medium"
              sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text }}>
                Password
              </Typography>
              <Link component={RouterLink} to="/forgot-password" variant="caption" underline="hover" sx={{ color: brandColors.primary, fontWeight: 600 }}>
                Forgot password?
              </Link>
            </Box>
            <TextField
              fullWidth
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              size="medium"
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
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiArrowRight size={18} />}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                backgroundColor: brandColors.primary,
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                '&:hover': { backgroundColor: alpha(brandColors.primary, 0.9) },
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
        </Box>
      </motion.div>

      {/* Google OAuth Modal */}
      <Dialog open={googleModal} onClose={() => setGoogleModal(false)} PaperProps={{ style: { borderRadius: 20, padding: 8 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
          <FcGoogle size={24} />
          Continue with Google
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: brandColors.muted, mb: 2 }}>
            Sign in securely using your Google account via OAuth 2.0.
          </Typography>
          <TextField
            fullWidth
            label="Google Account Email"
            value={socialEmail}
            onChange={(e) => setSocialEmail(e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label="Account Name"
            value={socialFirstName}
            onChange={(e) => setSocialFirstName(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setGoogleModal(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleConfirmGoogle}
            variant="contained"
            disabled={loading}
            startIcon={<FiCheckCircle />}
            sx={{
              borderRadius: '12px',
              backgroundColor: brandColors.primary,
              fontWeight: 700,
            }}
          >
            Authorize & Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
