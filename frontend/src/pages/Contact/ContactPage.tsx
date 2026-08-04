import { useState } from 'react'
import { Box, Container, Typography, Grid, TextField, Button, MenuItem, Stack, alpha, CircularProgress, Link, Alert } from '@mui/material'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiSend, FiLinkedin, FiInstagram } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

const services = [
  'Profile Setup + Account building advice (₹99)',
  'Profile setup + Personal Branding (8 posts/mo - ₹320)',
  'Profile setup + personal branding + building network (₹400/mo)',
  'LinkedIn Consulting (₹250/mo)',
  'Other Query'
]

const socials = [
  { icon: FiLinkedin, href: 'https://www.linkedin.com/company/brandit-get/', label: 'LinkedIn' },
  { icon: FiInstagram, href: 'https://www.instagram.com/brandit.team', label: 'Instagram' },
]

export default function ContactPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [serviceInterested, setServiceInterested] = useState('')
  const [message, setMessage] = useState('')

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/contact', {
        firstName,
        lastName,
        email,
        phone,
        serviceInterested,
        message,
      })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit contact request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box sx={{ py: { xs: 8, md: 14 }, backgroundColor: brandColors.background }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Typography variant="caption" sx={{ color: brandColors.primary, display: 'block', mb: 1.5, letterSpacing: '0.1em', fontWeight: 700 }}>
              GET IN TOUCH
            </Typography>
            <Typography variant="h1" sx={{ mb: 2, maxWidth: 600 }}>
              Let's Start a{' '}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Conversation
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, maxWidth: 480, fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
              Have a question about our personal branding or consulting plans? Reach out to our team directly.
            </Typography>
          </motion.div>

          <Grid container spacing={6} sx={{ mt: 2 }}>
            {/* Form */}
            <Grid item xs={12} md={7}>
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                {submitted ? (
                  <Box sx={{ p: 5, borderRadius: '24px', border: `1px solid ${alpha(brandColors.success, 0.3)}`, backgroundColor: alpha(brandColors.success, 0.04), textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 1, color: brandColors.text, fontWeight: 700 }}>Message Sent!</Typography>
                    <Typography variant="body1" sx={{ color: brandColors.muted }}>
                      Thank you for contacting BrandIt. A receipt email has been sent to <strong>{email}</strong>, and our team will get back to you within 24 hours.
                    </Typography>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: { xs: 3, sm: 4 }, borderRadius: '24px', backgroundColor: '#fff', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          fullWidth
                          required
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          fullWidth
                          required
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                    <TextField
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                    <TextField
                      label="Service Interested In"
                      select
                      value={serviceInterested}
                      onChange={(e) => setServiceInterested(e.target.value)}
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    >
                      {services.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                    <TextField
                      label="Your Message"
                      multiline
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      fullWidth
                      required
                      placeholder="How can we help build your brand?"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                    <Button type="submit" variant="contained" size="large" disabled={loading} endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FiSend />} sx={{ alignSelf: 'flex-start', px: 5, py: 1.5, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}>
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Box>
                )}
              </motion.div>
            </Grid>

            {/* Info Cards */}
            <Grid item xs={12} md={5}>
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <Stack spacing={3}>
                  {/* Email Card */}
                  <Box sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: alpha(brandColors.primary, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiMail size={22} color={brandColors.primary} />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mb: 0.25, letterSpacing: '0.05em', fontWeight: 700 }}>EMAIL ADDRESS</Typography>
                        <Link href="mailto:brandit.get@gmail.com" underline="hover" sx={{ color: brandColors.text, fontWeight: 700, fontSize: '0.95rem', '&:hover': { color: brandColors.primary } }}>
                          brandit.get@gmail.com
                        </Link>
                      </Box>
                    </Box>
                  </Box>

                  {/* Phone Cards */}
                  <Box sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: alpha(brandColors.primary, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.5 }}>
                        <FiPhone size={22} color={brandColors.primary} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mb: 1, letterSpacing: '0.05em', fontWeight: 700 }}>DIRECT CONTACT PHONES</Typography>

                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="body2" sx={{ color: brandColors.text, fontWeight: 700 }}>BrandIt Consulting</Typography>
                          <Typography variant="caption" sx={{ color: brandColors.primary, display: 'block', mb: 0.25, fontWeight: 600 }}>Lead Brand Consultants</Typography>
                          <Link href="tel:+918708231539" underline="hover" sx={{ color: brandColors.text, fontWeight: 600, fontSize: '0.9rem', '&:hover': { color: brandColors.primary } }}>
                            +91 8708231539 / +91 6284318951
                          </Link>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Social Links */}
                  <Box sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                    <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mb: 1.5, letterSpacing: '0.05em', fontWeight: 700 }}>CONNECT WITH US</Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      {socials.map((s) => (
                        <Box
                          key={s.label}
                          component="a"
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1,
                            borderRadius: '12px',
                            border: `1px solid ${brandColors.border}`,
                            color: brandColors.text,
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: brandColors.primary,
                              backgroundColor: alpha(brandColors.primary, 0.06),
                              color: brandColors.primary,
                            },
                          }}
                        >
                          <s.icon size={18} />
                          {s.label}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
