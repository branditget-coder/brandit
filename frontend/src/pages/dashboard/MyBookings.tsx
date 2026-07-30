import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Chip, Stack, Button, CircularProgress, Alert, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiCalendar, FiVideo, FiPlusCircle } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface BookingItem {
  id: number
  serviceName: string
  preferredDate: string
  preferredTime: string
  status: string
  amountPaid?: number
  meetingLink?: string
}

const statusColor: Record<string, string> = {
  PENDING: '#F59E0B',
  CONFIRMED: brandColors.primary,
  COMPLETED: brandColors.success,
  CANCELLED: '#EF4444',
  Upcoming: brandColors.primary,
  Completed: brandColors.success,
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<BookingItem[]>('/bookings')
        setBookings(res.data)
      } catch (err: any) {
        setError('Could not load your bookings.')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>My Bookings</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted }}>All your consultation sessions in one place.</Typography>
          </Box>
          <Button component={RouterLink} to="/book" variant="contained" startIcon={<FiPlusCircle size={16} />}>
            Book New Session
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>
        ) : bookings.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', textAlign: 'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: alpha(brandColors.primary, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <FiCalendar size={28} color={brandColors.primary} />
            </Box>
            <Typography variant="h5" sx={{ mb: 1, color: brandColors.text }}>No Bookings Yet</Typography>
            <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3, maxWidth: 400, mx: 'auto' }}>
              You haven't scheduled any consultation sessions yet. Take the next step in your career journey!
            </Typography>
            <Button component={RouterLink} to="/book" variant="contained" sx={{ px: 4, py: 1.2 }}>
              Schedule Your First Session
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {bookings.map(b => (
              <Paper key={b.id} sx={{ p: 3, borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5, color: brandColors.text }}>{b.serviceName}</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <FiCalendar size={14} color={brandColors.muted} />
                        <Typography variant="body2" sx={{ color: brandColors.muted }}>{b.preferredDate}</Typography>
                      </Box>
                      {b.preferredTime && (
                        <Typography variant="body2" sx={{ color: brandColors.muted }}>{b.preferredTime}</Typography>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip label={b.status} size="small" sx={{ backgroundColor: alpha(statusColor[b.status] || brandColors.muted, 0.1), color: statusColor[b.status] || brandColors.muted, fontWeight: 600 }} />
                    {b.meetingLink && (
                      <Button size="small" variant="contained" startIcon={<FiVideo size={14} />} href={b.meetingLink} target="_blank" sx={{ px: 2 }}>
                        Join Meeting
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </motion.div>
    </Box>
  )
}
