import { useState } from 'react'
import {
  Box, Typography, TextField, Button, Divider, Link, InputAdornment,
  IconButton, alpha, CircularProgress, Grid, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../../components/common/BrandLogo'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Google Modal state
  const [googleModal, setGoogleModal] = useState<boolean>(false)
  const [socialEmail, setSocialEmail] = useState('')
  const [socialFirstName, setSocialFirstName] = useState('')
  const [socialLastName, setSocialLastName] = useState('')

  const navigate = useNavigate()
  const { register, loginWithSocial } = useAuth()

  const validateForm = () => {
    if (!firstName.trim()) {
      setError('First name is required.')
      return false
    }
    if (!lastName.trim()) {
      setError('Last name is required.')
      return false
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.')
      return false
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.')
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
      await register(firstName, lastName, email, password, phone)
      if (email.toLowerCase() === 'raghavdhir1510@gmail.com') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenGoogle = () => {
    setGoogleModal(true)
    setSocialEmail('newuser@gmail.com')
    setSocialFirstName('Google')
    setSocialLastName('User')
  }

  const handleConfirmGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      const mockToken = 'google_register_token_' + Date.now()
      await loginWithSocial('google', mockToken)
      setGoogleModal(false)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google sign-up failed.')
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
          <Typography variant="h3" sx={{ mb: 0.75 }}>Create your account</Typography>
          <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3 }}>
            Start building your personal brand and unlock career opportunities.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

          {/* Prominent Google Sign Up Button */}
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
            Sign up with Google
          </Button>

          <Divider sx={{ my: 3, fontSize: '0.75rem', color: brandColors.muted, '&::before, &::after': { borderColor: brandColors.border } }}>
            OR REGISTER WITH EMAIL
          </Divider>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
                  First Name *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Hritika"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
                  Last Name *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Seth"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Grid>
            </Grid>

            <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
              Email Address *
            </Typography>
            <TextField
              fullWidth
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              size="medium"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
              Phone Number (Optional)
            </Typography>
            <TextField
              fullWidth
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              variant="outlined"
              size="medium"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.5, display: 'block' }}>
              Password (Min 8 characters) *
            </Typography>
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: brandColors.muted }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover" sx={{ color: brandColors.primary, fontWeight: 700 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </motion.div>

      {/* Google OAuth Dialog */}
      <Dialog open={googleModal} onClose={() => setGoogleModal(false)} PaperProps={{ style: { borderRadius: 20, padding: 8 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
          <FcGoogle size={24} />
          Register with Google
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: brandColors.muted, mb: 2 }}>
            Confirm your details to create your BrandIt account via Google OAuth.
          </Typography>
          <TextField
            fullWidth
            label="Google Account Email"
            value={socialEmail}
            onChange={(e) => setSocialEmail(e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                value={socialFirstName}
                onChange={(e) => setSocialFirstName(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={socialLastName}
                onChange={(e) => setSocialLastName(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
          </Grid>
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
            Create Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
