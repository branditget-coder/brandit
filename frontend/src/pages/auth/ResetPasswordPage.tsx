import { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, Link, alpha, CircularProgress, Alert, InputAdornment, IconButton } from '@mui/material'
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheckCircle, FiEye, FiEyeOff, FiKey } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'
import BrandLogo from '../../components/common/BrandLogo'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing password reset link. Please request a new link.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token) {
      setError('Invalid or missing reset token.')
      return
    }

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, newPassword })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired password reset token.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <BrandLogo variant="dark" size="medium" showSlogan={true} />
        </Box>

        <Box sx={{ p: { xs: 3, sm: 4 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: alpha(brandColors.success, 0.1), color: brandColors.success, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <FiCheckCircle size={32} />
                </Box>
                <Typography variant="h4" sx={{ mb: 1.5, fontWeight: 700 }}>Password Reset Complete!</Typography>
                <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3 }}>
                  Your password has been changed successfully. Redirecting you to sign in...
                </Typography>
                <Button component={RouterLink} to="/login" variant="contained" sx={{ px: 4, py: 1.2, borderRadius: '12px', fontWeight: 700 }}>
                  Sign In Now
                </Button>
              </Box>
            </motion.div>
          ) : (
            <>
              <Typography variant="h3" sx={{ mb: 0.75 }}>Reset Your Password</Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3 }}>Enter your new password below.</Typography>

              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="New Password"
                  type={showPwd ? 'text' : 'password'}
                  fullWidth required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPwd(!showPwd)} edge="end">
                          {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <TextField
                  label="Confirm New Password"
                  type={showPwd ? 'text' : 'password'}
                  fullWidth required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || !token}
                  endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiKey />}
                  sx={{ py: 1.4, borderRadius: '12px', fontWeight: 700 }}
                >
                  {loading ? 'Updating Password...' : 'Reset Password'}
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
