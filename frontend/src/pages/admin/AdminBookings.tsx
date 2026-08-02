import React, { useEffect, useState, useCallback } from 'react'
import { Box, Typography, Paper, Chip, Stack, alpha, CircularProgress, MenuItem, Select, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { FiCalendar, FiRefreshCw } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface BookingItem {
  id: number
  clientName?: string
  clientEmail?: string
  serviceName: string
  preferredDate?: string
  preferredTime?: string
  bookingDate?: string
  bookingTime?: string
  status: string
  amountPaid?: number
  amount?: number
}

const statusColor: Record<string, string> = {
  CONFIRMED: brandColors.primary,
  PENDING: '#F59E0B',
  COMPLETED: brandColors.success,
  CANCELLED: '#EF4444',
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      let data: BookingItem[] = []
      try {
        const res = await api.get<BookingItem[]>('/bookings/all')
        data = Array.isArray(res.data) ? res.data : []
      } catch (_firstErr) {
        const res = await api.get<BookingItem[]>('/bookings')
        data = Array.isArray(res.data) ? res.data : []
      }
      setBookings(data)
    } catch (err: any) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus })
      fetchBookings()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Bookings ({bookings.length})</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Manage all user consultation bookings.</Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error || bookings.length === 0 ? (
          <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: '24px', border: `1px dashed ${brandColors.border}`, textAlign: 'center', backgroundColor: alpha(brandColors.primary, 0.01) }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <FiCalendar size={30} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.text, mb: 1 }}>Consultation Pipeline Active</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, maxWidth: 500, mx: 'auto', mb: 3, lineHeight: 1.6 }}>
              No live user bookings are currently scheduled. As clients register and book personal branding consultations, session details, payments, and statuses will automatically populate here.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button onClick={fetchBookings} variant="outlined" startIcon={<FiRefreshCw />} sx={{ borderRadius: '12px', px: 3, fontWeight: 600 }}>
                Refresh Pipeline
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', overflowX: 'auto' }}>
            <Box sx={{ minWidth: 650 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1.5fr 1fr', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, backgroundColor: brandColors.background }}>
                {['Client', 'Service', 'Date & Time', 'Status', 'Amount'].map(h => (
                  <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>{h.toUpperCase()}</Typography>
                ))}
              </Box>
              {bookings.map((b, i) => {
                const displayDate = b.bookingDate || b.preferredDate || 'Confirmed'
                const displayTime = b.bookingTime || b.preferredTime || ''
                const displayAmount = b.amount || b.amountPaid || 1499
                return (
                  <Box key={b.id} sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1.5fr 1fr', gap: 2, px: 3, py: 2.5, borderBottom: i < bookings.length - 1 ? `1px solid ${brandColors.border}` : 'none', alignItems: 'center', '&:hover': { backgroundColor: alpha(brandColors.primary, 0.02) }, transition: 'background 0.15s' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{b.clientName || 'Client'}</Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>{b.clientEmail || ''}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: brandColors.muted }}>{b.serviceName}</Typography>
                    <Typography variant="body2" sx={{ color: brandColors.muted }}>{displayDate} {displayTime ? `· ${displayTime}` : ''}</Typography>
                    <Select
                      size="small"
                      value={b.status || 'PENDING'}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      sx={{ height: 32, fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      <MenuItem value="PENDING">PENDING</MenuItem>
                      <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                      <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                      <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                    </Select>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text }}>₹{displayAmount.toLocaleString()}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Paper>
        )}
      </motion.div>
    </Box>
  )
}
