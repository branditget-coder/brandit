import { useState } from 'react'
import { Box, Typography, TextField, Button, Link, alpha, CircularProgress, Alert } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiSend } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() })
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not process password reset request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: brandColors.text, letterSpacing: '-0.03em', mb: 4, display: 'block' }}>BrandIt</Typography>
        </RouterLink>
        <Box sx={{ p: { xs: 3, sm: 4 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: alpha(brandColors.success, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <FiSend size={28} color={brandColors.success} />
                </Box>
                <Typography variant="h4" sx={{ mb: 1.5 }}>Check your inbox</Typography>
                <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3 }}>
                  We've sent a password reset link to <strong>{email}</strong>. It expires in 30 minutes.
                </Typography>
                <Link component={RouterLink} to="/login" sx={{ color: brandColors.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                  <FiArrowLeft size={16} /> Back to Sign In
                </Link>
              </Box>
            </motion.div>
          ) : (
            <>
              <Typography variant="h3" sx={{ mb: 0.75 }}>Forgot password?</Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3 }}>Enter your email and we'll send a reset link.</Typography>
              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField label="Email Address" type="email" fullWidth required value={email} onChange={e => setEmail(e.target.value)} />
                <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiSend />}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Box>
              <Link component={RouterLink} to="/login" sx={{ color: brandColors.muted, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5, mt: 3, justifyContent: 'center', '&:hover': { color: brandColors.primary } }}>
                <FiArrowLeft size={16} /> Back to Sign In
              </Link>
            </>
          )}
        </Box>
      </motion.div>
    </Box>
  )
}
