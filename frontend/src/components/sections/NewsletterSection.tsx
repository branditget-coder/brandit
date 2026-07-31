import { useState } from 'react'
import { Box, Container, Typography, TextField, Button, alpha, CircularProgress, Alert } from '@mui/material'
import { motion } from 'framer-motion'
import { FiArrowRight, FiMail } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      await api.post('/newsletter', { email })
      setSuccess(true)
      setEmail('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to subscribe to newsletter. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        backgroundColor: brandColors.background,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 4, md: 6 },
              borderRadius: '28px',
              border: `1px solid ${brandColors.border}`,
              backgroundColor: '#fff',
              boxShadow: '0 8px 40px rgba(0,0,0,0.05)',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                backgroundColor: alpha(brandColors.primary, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <FiMail size={24} color={brandColors.primary} />
            </Box>

            <Typography variant="h3" sx={{ mb: 1.5 }}>
              Career Insights, Weekly
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, mb: 4 }}>
              Get actionable LinkedIn tips, resume hacks, and career strategies — delivered every Tuesday. No spam, ever.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    backgroundColor: alpha(brandColors.success, 0.08),
                    border: `1px solid ${alpha(brandColors.success, 0.2)}`,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>
                    🎉 You're in! Check your inbox for your Weekly Career Insights welcome email.
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  size="medium"
                  required
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: brandColors.background } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FiArrowRight />}
                  sx={{ whiteSpace: 'nowrap', px: 3 }}
                >
                  Subscribe
                </Button>
              </Box>
            )}

            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: brandColors.muted }}>
              No spam. Unsubscribe anytime.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
