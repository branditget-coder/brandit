import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Chip, Stack, alpha, CircularProgress, Alert, MenuItem, Select } from '@mui/material'
import { motion } from 'framer-motion'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface BookingItem {
  id: number
  clientName?: string
  clientEmail?: string
  serviceName: string
  preferredDate: string
  preferredTime: string
  status: string
  amountPaid?: number
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
  const [error, setError] = useState<string>('')

  const fetchBookings = async () => {
    try {
      const res = await api.get<BookingItem[]>('/bookings/all')
      setBookings(res.data)
    } catch (err: any) {
      setError('Failed to fetch platform bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

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
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>
        ) : bookings.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: '24px', border: `1px dashed ${brandColors.border}`, textAlign: 'center', backgroundColor: alpha(brandColors.primary, 0.01) }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '18px', backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>📅</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: brandColors.text, mb: 1 }}>Consultation Pipeline Active</Typography>
            <Typography variant="body2" sx={{ color: brandColors.muted, maxWidth: 480, mx: 'auto', mb: 3, lineHeight: 1.6 }}>
              No live user bookings are currently scheduled. As clients register and book personal branding consultations, session details, payments, and statuses will automatically populate here.
            </Typography>
            <Chip label="Target Pipeline: 50 Sessions / Mo" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', overflowX: 'auto' }}>
            <Box sx={{ minWidth: 650 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1.5fr 1fr', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, backgroundColor: brandColors.background }}>
                {['Client', 'Service', 'Date & Time', 'Status', 'Amount'].map(h => (
                  <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>{h.toUpperCase()}</Typography>
                ))}
              </Box>
              {bookings.map((b, i) => (
                <Box key={b.id} sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1.5fr 1fr', gap: 2, px: 3, py: 2.5, borderBottom: i < bookings.length - 1 ? `1px solid ${brandColors.border}` : 'none', alignItems: 'center', '&:hover': { backgroundColor: alpha(brandColors.primary, 0.02) }, transition: 'background 0.15s' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{b.clientName || 'Client'}</Typography>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>{b.clientEmail || ''}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: brandColors.muted }}>{b.serviceName}</Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted }}>{b.preferredDate} {b.preferredTime ? `· ${b.preferredTime}` : ''}</Typography>
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
                  <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text }}>₹{b.amountPaid || '99'}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </motion.div>
    </Box>
  )
}
