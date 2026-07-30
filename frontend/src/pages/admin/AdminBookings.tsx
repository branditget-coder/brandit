import { Box, Typography, Paper, Chip, Stack, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { brandColors } from '../../theme'

const bookings = [
  { id: 1, client: 'Priya Sharma', service: 'LinkedIn Optimization', date: 'Aug 5, 2025 · 10:00 AM', status: 'Confirmed', amount: '₹12,999' },
  { id: 2, client: 'Rahul Mehta', service: 'Resume Writing', date: 'Aug 3, 2025 · 2:00 PM', status: 'Pending', amount: '₹4,999' },
  { id: 3, client: 'Ananya Krishnan', service: 'Executive Branding', date: 'Aug 1, 2025 · 11:00 AM', status: 'Confirmed', amount: '₹34,999' },
  { id: 4, client: 'Vikram Singh', service: 'Interview Coaching', date: 'Jul 30, 2025 · 4:00 PM', status: 'Completed', amount: '₹1,999' },
]

const statusColor: Record<string, string> = {
  Confirmed: brandColors.primary,
  Pending: '#F59E0B',
  Completed: brandColors.success,
  Cancelled: '#EF4444',
}

export default function AdminBookings() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Bookings</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Manage all consultation bookings.</Typography>
        </Box>
        <Paper sx={{ borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', overflow: 'hidden' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr 1fr', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, backgroundColor: brandColors.background }}>
            {['Client', 'Service', 'Date & Time', 'Status', 'Amount'].map(h => (
              <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>{h.toUpperCase()}</Typography>
            ))}
          </Box>
          {bookings.map((b, i) => (
            <Box key={b.id} sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr 1fr', gap: 2, px: 3, py: 2.5, borderBottom: i < bookings.length - 1 ? `1px solid ${brandColors.border}` : 'none', alignItems: 'center', '&:hover': { backgroundColor: alpha(brandColors.primary, 0.02) }, transition: 'background 0.15s' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{b.client}</Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted }}>{b.service}</Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted }}>{b.date}</Typography>
              <Chip label={b.status} size="small" sx={{ backgroundColor: alpha(statusColor[b.status] || brandColors.muted, 0.1), color: statusColor[b.status], fontWeight: 600, fontSize: '0.72rem' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text }}>{b.amount}</Typography>
            </Box>
          ))}
        </Paper>
      </motion.div>
    </Box>
  )
}
