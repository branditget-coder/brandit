import React, { useEffect, useState, useCallback } from 'react'
import { Box, Typography, Paper, Chip, Stack, Button, CircularProgress, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiCalendar, FiVideo, FiPlusCircle, FiRefreshCw } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface BookingItem {
  id: number
  serviceName: string
  bookingDate?: string
  bookingTime?: string
  preferredDate?: string
  preferredTime?: string
  status: string
  amount?: number
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
  const [error, setError] = useState<boolean>(false)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await api.get<BookingItem[]>('/bookings')
      setBookings(Array.isArray(res.data) ? res.data : [])
    } catch (err: any) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

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
        ) : error || bookings.length === 0 ? (
          <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <Box sx={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: alpha(brandColors.primary, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5, color: brandColors.primary }}>
              <FiCalendar size={32} />
            </Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: brandColors.text }}>No Sessions Booked Yet</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, mb: 3.5, maxWidth: 460, mx: 'auto', lineHeight: 1.6 }}>
              You don't have any consultation sessions scheduled yet. Explore our packages and take the next step in your personal brand journey!
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button component={RouterLink} to="/book" variant="contained" startIcon={<FiPlusCircle />} sx={{ px: 4, py: 1.3, borderRadius: '12px', fontWeight: 700 }}>
                Book Your First Session
              </Button>
              {error && (
                <Button onClick={fetchBookings} variant="outlined" startIcon={<FiRefreshCw />} sx={{ px: 3, py: 1.3, borderRadius: '12px' }}>
                  Refresh
                </Button>
              )}
            </Stack>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {bookings.map(b => {
              const displayDate = b.bookingDate || b.preferredDate || 'Date Confirmed'
              const displayTime = b.bookingTime || b.preferredTime || ''
              return (
                <Paper key={b.id} sx={{ p: 3, borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5, color: brandColors.text }}>{b.serviceName}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <FiCalendar size={14} color={brandColors.muted} />
                          <Typography variant="body2" sx={{ color: brandColors.muted }}>{displayDate}</Typography>
                        </Box>
                        {displayTime && (
                          <Typography variant="body2" sx={{ color: brandColors.muted }}>{displayTime}</Typography>
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
              )
            })}
          </Stack>
        )}
      </motion.div>
    </Box>
  )
}
