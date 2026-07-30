import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, TextField, InputAdornment, Stack,
  Tabs, Tab, alpha, CircularProgress, Tooltip
} from '@mui/material'
import { motion } from 'framer-motion'
import { FiSearch, FiCalendar, FiPhone, FiMail, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface BookingItem {
  id: number
  clientName: string
  clientEmail: string
  clientPhone: string
  servicePackage: string
  preferredDate: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  notes?: string
}

export default function TeamConsultations() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusTab, setStatusTab] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await api.get('/bookings')
      setBookings(res.data)
    } catch {
      // Fallback sample data
      setBookings([
        { id: 101, clientName: 'Aarav Mehta', clientEmail: 'aarav@techventure.co', clientPhone: '+91 9876543210', servicePackage: 'Executive Personal Branding', preferredDate: '2026-08-02 11:00 AM', status: 'CONFIRMED', notes: 'Wants LinkedIn positioning & founder story strategy.' },
        { id: 102, clientName: 'Priya Verma', clientEmail: 'priya@brandpulse.in', clientPhone: '+91 9123456789', servicePackage: 'LinkedIn Content Optimization', preferredDate: '2026-08-03 03:30 PM', status: 'PENDING', notes: 'Requires profile audit & headline overhaul.' },
        { id: 103, clientName: 'Devansh Saxena', clientEmail: 'devansh@growthlabs.io', clientPhone: '+91 9988776655', servicePackage: 'Corporate Branding Package', preferredDate: '2026-08-05 02:00 PM', status: 'CONFIRMED', notes: 'Team onboarding consultation.' },
        { id: 104, clientName: 'Neha Kapoor', clientEmail: 'neha@capitalsystems.com', clientPhone: '+91 9811223344', servicePackage: 'Founder Presence Accelerator', preferredDate: '2026-08-06 10:00 AM', status: 'COMPLETED', notes: 'Follow-up strategy roadmap delivered.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: number, newStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus })
      fetchBookings()
    } catch {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    }
  }

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.servicePackage.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = statusTab === 'ALL' || b.status === statusTab
    return matchesSearch && matchesTab
  })

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Chip label="Confirmed" size="small" icon={<FiCheckCircle size={12} />} sx={{ backgroundColor: alpha('#10B981', 0.1), color: '#10B981', fontWeight: 700 }} />
      case 'COMPLETED':
        return <Chip label="Completed" size="small" icon={<FiCheckCircle size={12} />} sx={{ backgroundColor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 700 }} />
      case 'CANCELLED':
        return <Chip label="Cancelled" size="small" icon={<FiXCircle size={12} />} sx={{ backgroundColor: alpha('#EF4444', 0.1), color: '#EF4444', fontWeight: 700 }} />
      default:
        return <Chip label="Pending" size="small" icon={<FiClock size={12} />} sx={{ backgroundColor: alpha('#F59E0B', 0.1), color: '#D97706', fontWeight: 700 }} />
    }
  }

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
            Client Consultations
          </Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>
            Manage client consultation bookings, verify call dates, and update session outcomes.
          </Typography>
        </Box>

        <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          {/* Header Controls: Search & Tabs */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search by client name, email, package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch color={brandColors.muted} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 340 }, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Tabs
              value={statusTab}
              onChange={(_, val) => setStatusTab(val)}
              sx={{
                '& .MuiTabs-indicator': { backgroundColor: brandColors.primary, height: 3, borderRadius: 3 },
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.9rem' },
              }}
            >
              <Tab label="All" value="ALL" />
              <Tab label="Pending" value="PENDING" />
              <Tab label="Confirmed" value="CONFIRMED" />
              <Tab label="Completed" value="COMPLETED" />
            </Tabs>
          </Box>

          {loading ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <CircularProgress size={36} />
            </Box>
          ) : filteredBookings.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <FiCalendar size={40} color={brandColors.muted} style={{ marginBottom: 12 }} />
              <Typography variant="h6" sx={{ color: brandColors.text, fontWeight: 700 }}>No consultations found</Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted }}>Try adjusting your search filter or selected status tab.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Client Name & Contact</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Service Package</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Preferred Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Update Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text }}>
                          {booking.clientName}
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                          <Tooltip title="Call Client">
                            <Typography variant="caption" component="a" href={`tel:${booking.clientPhone}`} sx={{ color: brandColors.primary, display: 'flex', alignItems: 'center', gap: 0.3, textDecoration: 'none', fontWeight: 600 }}>
                              <FiPhone size={12} /> {booking.clientPhone}
                            </Typography>
                          </Tooltip>
                          <Typography variant="caption" sx={{ color: brandColors.muted }}>•</Typography>
                          <Tooltip title="Email Client">
                            <Typography variant="caption" component="a" href={`mailto:${booking.clientEmail}`} sx={{ color: brandColors.muted, display: 'flex', alignItems: 'center', gap: 0.3, textDecoration: 'none' }}>
                              <FiMail size={12} /> {booking.clientEmail}
                            </Typography>
                          </Tooltip>
                        </Stack>
                        {booking.notes && (
                          <Typography variant="caption" sx={{ display: 'block', color: brandColors.muted, fontStyle: 'italic', mt: 0.5 }}>
                            "{booking.notes}"
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={booking.servicePackage} size="small" variant="outlined" sx={{ fontWeight: 600, borderColor: brandColors.border }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>
                          {booking.preferredDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(booking.status)}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {booking.status === 'PENDING' && (
                            <Button size="small" variant="contained" color="success" onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')} sx={{ borderRadius: '8px', fontSize: '0.78rem', textTransform: 'none' }}>
                              Confirm
                            </Button>
                          )}
                          {booking.status === 'CONFIRMED' && (
                            <Button size="small" variant="contained" color="primary" onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')} sx={{ borderRadius: '8px', fontSize: '0.78rem', textTransform: 'none' }}>
                              Mark Complete
                            </Button>
                          )}
                          {booking.status !== 'CANCELLED' && (
                            <Button size="small" variant="outlined" color="error" onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')} sx={{ borderRadius: '8px', fontSize: '0.78rem', textTransform: 'none' }}>
                              Cancel
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </motion.div>
    </Box>
  )
}
