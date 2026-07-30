import { Box, Grid, Typography, Paper, Chip, Button, Stack, LinearProgress, Avatar, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiCalendar, FiFileText, FiArrowRight, FiCheckCircle, FiClock } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'

import { useAuth } from '../../context/AuthContext'

const stats = [
  { label: 'Active Services', value: '2', icon: FiCheckCircle, color: '#F0FDF4', iconColor: brandColors.success },
  { label: 'Upcoming Sessions', value: '1', icon: FiCalendar, color: '#EFF6FF', iconColor: brandColors.primary },
  { label: 'Documents', value: '5', icon: FiFileText, color: '#FFF7ED', iconColor: '#F59E0B' },
  { label: 'Hours Saved', value: '12', icon: FiClock, color: '#F5F3FF', iconColor: '#7C3AED' },
]

const bookings = [
  { service: 'Profile Setup + Personal Branding (₹320/mo)', date: 'Aug 5, 2025 · 10:00 AM', status: 'Upcoming', statusColor: brandColors.primary },
  { service: 'Profile Setup & Advice (₹99)', date: 'Jul 28, 2025 · 3:00 PM', status: 'Completed', statusColor: brandColors.success },
]

export default function UserDashboard() {
  const { user } = useAuth()
  const name = user ? user.firstName : 'there'

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>Welcome back, {name} 👋</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Here's what's happening with your brand journey.</Typography>
        </Box>

        {/* Profile Completion */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.text }}>Profile Completion</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.primary }}>68%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={68} sx={{ height: 8, borderRadius: 4, backgroundColor: alpha(brandColors.primary, 0.1), '& .MuiLinearProgress-bar': { borderRadius: 4, background: `linear-gradient(90deg, ${brandColors.primary}, ${brandColors.secondary})` } }} />
          <Typography variant="caption" sx={{ color: brandColors.muted, mt: 1, display: 'block' }}>Add your LinkedIn URL and upload your resume to reach 100%</Typography>
        </Paper>

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
                <Typography variant="h6" sx={{ color: brandColors.text }}>Consultations</Typography>
                <Button component={RouterLink} to="/dashboard/bookings" size="small" endIcon={<FiArrowRight size={14} />} sx={{ color: brandColors.primary, '&:hover': { backgroundColor: alpha(brandColors.primary, 0.06), boxShadow: 'none', transform: 'none' } }}>
                  View all
                </Button>
              </Box>
              <Stack spacing={2}>
                {bookings.map((b) => (
                  <Box key={b.service} sx={{ p: 2.5, borderRadius: '14px', border: `1px solid ${brandColors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.25 }}>{b.service}</Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>{b.date}</Typography>
                    </Box>
                    <Chip label={b.status} size="small" sx={{ backgroundColor: alpha(b.statusColor, 0.1), color: b.statusColor, fontWeight: 600, fontSize: '0.72rem' }} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', height: '100%' }}>
              <Typography variant="h6" sx={{ color: brandColors.text, mb: 3 }}>Quick Actions</Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'Book a Consultation', href: '/book', icon: FiCalendar },
                  { label: 'Build My Resume', href: '/dashboard/resume-builder', icon: FiFileText },
                  { label: 'View Invoices', href: '/dashboard/invoices', icon: FiFileText },
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
