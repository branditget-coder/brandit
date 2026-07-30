import { Box, Typography, Paper, Chip, Stack, Button, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiCalendar, FiVideo } from 'react-icons/fi'
import { brandColors } from '../../theme'

const bookings = [
  { id: 1, service: 'LinkedIn Optimization Session', date: 'August 5, 2025', time: '10:00 AM IST', status: 'Upcoming', zoomLink: 'https://zoom.us/j/123456' },
  { id: 2, service: 'Resume Writing Consultation', date: 'July 28, 2025', time: '3:00 PM IST', status: 'Completed', zoomLink: '' },
  { id: 3, service: 'Career Strategy Session', date: 'July 15, 2025', time: '11:00 AM IST', status: 'Completed', zoomLink: '' },
]

const statusColor: Record<string, string> = {
  Upcoming: brandColors.primary,
  Completed: brandColors.success,
  Cancelled: '#EF4444',
}

export default function MyBookings() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>My Bookings</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>All your consultation sessions in one place.</Typography>
        </Box>
        <Stack spacing={2}>
          {bookings.map(b => (
            <Paper key={b.id} sx={{ p: 3, borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5, color: brandColors.text }}>{b.service}</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <FiCalendar size={14} color={brandColors.muted} />
                      <Typography variant="body2" sx={{ color: brandColors.muted }}>{b.date}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: brandColors.muted }}>{b.time}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip label={b.status} size="small" sx={{ backgroundColor: alpha(statusColor[b.status] || brandColors.muted, 0.1), color: statusColor[b.status], fontWeight: 600 }} />
                  {b.status === 'Upcoming' && b.zoomLink && (
                    <Button size="small" variant="contained" startIcon={<FiVideo size={14} />} href={b.zoomLink} target="_blank" sx={{ px: 2 }}>
                      Join Zoom
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      </motion.div>
    </Box>
  )
}
