import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Paper, Chip, Button, Stack, LinearProgress, alpha, CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'
import { FiCalendar, FiFileText, FiArrowRight, FiCheckCircle, FiClock, FiUser } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

interface BookingItem {
  id: number
  serviceName: string
  preferredDate: string
  preferredTime: string
  status: string
}

export default function UserDashboard() {
  const { user } = useAuth()
  const name = user ? user.firstName : 'there'

  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get<BookingItem[]>('/bookings')
        setBookings(res.data)
      } catch (err) {
        // quiet fallback
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  // Calculate real profile completion
  const profileFields = [
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.phone,
    user?.linkedinUrl,
    user?.currentRole,
    user?.bio,
  ]
  const filledFields = profileFields.filter(f => f && f.trim().length > 0).length
  const profilePercent = Math.round((filledFields / profileFields.length) * 100)

  const activeServicesCount = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length

  const stats = [
    { label: 'Active Services', value: String(activeServicesCount), icon: FiCheckCircle, color: '#F0FDF4', iconColor: brandColors.success },
    { label: 'Upcoming Sessions', value: String(activeServicesCount), icon: FiCalendar, color: '#EFF6FF', iconColor: brandColors.primary },
    { label: 'Completed Sessions', value: String(completedCount), icon: FiFileText, color: '#FFF7ED', iconColor: '#F59E0B' },
    { label: 'Total Consultations', value: String(bookings.length), icon: FiClock, color: '#F5F3FF', iconColor: '#7C3AED' },
  ]

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>Welcome back, {name} 👋</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Here's what's happening with your brand journey.</Typography>
        </Box>

        {/* Profile Completion & Growth Projection */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.text }}>Profile Completion</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.primary }}>{profilePercent}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={profilePercent} sx={{ height: 8, borderRadius: 4, backgroundColor: alpha(brandColors.primary, 0.1), '& .MuiLinearProgress-bar': { borderRadius: 4, background: `linear-gradient(90deg, ${brandColors.primary}, ${brandColors.secondary})` } }} />
              <Typography variant="caption" sx={{ color: brandColors.muted, mt: 1.5, display: 'block' }}>
                {profilePercent < 100 ? 'Add your LinkedIn URL, phone, and bio in My Profile to reach 100%' : 'Your profile is 100% complete! Great job.'}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: alpha(brandColors.primary, 0.03), boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Future Career Potential
                </Typography>
                <Chip label="+300% Forecast" size="small" sx={{ backgroundColor: alpha(brandColors.success, 0.12), color: '#059669', fontWeight: 700, fontSize: '0.7rem' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.text, mb: 0.5 }}>
                {profilePercent >= 80 ? '3.8x More Recruiter Inquiries' : 'Unlock 3.8x Recruiter Inquiries'}
              </Typography>
              <Typography variant="caption" sx={{ color: brandColors.muted }}>
                Completing your profile & scheduling personal branding sessions unlocks estimated 4x higher profile reach and premium career opportunities.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Stats */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={6} lg={3} key={stat.label}>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Paper sx={{ p: 2.5, borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', textAlign: 'center' }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '14px', backgroundColor: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                    <stat.icon size={20} color={stat.iconColor} />
                  </Box>
                  <Typography variant="h3" sx={{ color: brandColors.text, mb: 0.25 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: brandColors.muted }}>{stat.label}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Upcoming Bookings */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: brandColors.text }}>Recent Consultations</Typography>
                <Button component={RouterLink} to="/dashboard/bookings" size="small" endIcon={<FiArrowRight size={14} />} sx={{ color: brandColors.primary, '&:hover': { backgroundColor: alpha(brandColors.primary, 0.06), boxShadow: 'none', transform: 'none' } }}>
                  View all
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={24} color="primary" />
                </Box>
              ) : bookings.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: brandColors.muted, mb: 2 }}>No consultation sessions booked yet.</Typography>
                  <Button component={RouterLink} to="/book" variant="outlined" size="small">Book Now</Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {bookings.slice(0, 3).map((b) => (
                    <Box key={b.id} sx={{ p: 2.5, borderRadius: '14px', border: `1px solid ${brandColors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.25 }}>{b.serviceName}</Typography>
                        <Typography variant="caption" sx={{ color: brandColors.muted }}>{b.preferredDate} {b.preferredTime ? `· ${b.preferredTime}` : ''}</Typography>
                      </Box>
                      <Chip label={b.status} size="small" sx={{ backgroundColor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 600, fontSize: '0.72rem' }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', height: '100%' }}>
              <Typography variant="h6" sx={{ color: brandColors.text, mb: 3 }}>Quick Actions</Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'Book a Consultation', href: '/book', icon: FiCalendar },
                  { label: 'View My Invoices', href: '/dashboard/invoices', icon: FiFileText },
                  { label: 'Update Profile & Security', href: '/dashboard/profile', icon: FiUser },
                ].map(a => (
                  <Button key={a.label} component={RouterLink} to={a.href} variant="outlined" fullWidth startIcon={<a.icon size={16} />} sx={{ justifyContent: 'flex-start', px: 2.5, borderColor: brandColors.border, color: brandColors.text, '&:hover': { borderColor: brandColors.primary, color: brandColors.primary, backgroundColor: alpha(brandColors.primary, 0.04), boxShadow: 'none', transform: 'none' } }}>
                    {a.label}
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}
