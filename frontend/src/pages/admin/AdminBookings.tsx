import React, { useEffect, useState, useCallback } from 'react'
import {
  Box, Typography, Paper, Chip, Stack, alpha, CircularProgress, MenuItem,
  Select, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, TextField, InputAdornment, FormControl, InputLabel,
  Snackbar, Alert, Tooltip, Grid
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  FiCalendar, FiRefreshCw, FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiClock, FiDollarSign, FiUser, FiMail, FiPhone, FiVideo,
  FiFileText, FiCreditCard, FiX, FiCheckCircle, FiAlertCircle, FiGlobe
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface BookingItem {
  id: number
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  serviceName: string
  bookingDate?: string
  bookingTime?: string
  preferredDate?: string
  preferredTime?: string
  status: string
  amount?: number
  amountPaid?: number
  paymentMethod?: string
  paymentId?: string
  paymentScreenshot?: string
  meetingLink?: string
  notes?: string
  consultantName?: string
  createdAt?: string
}

const SERVICE_PRESETS = [
  { name: 'Profile Setup + Account Building Advice', price: 129, desc: 'Quick Profile Audit & Kickstart' },
  { name: 'LinkedIn Consulting & Advisory', price: 249, desc: 'LinkedIn Growth & Strategy' },
  { name: 'Profile Setup + Personal Branding', price: 349, desc: 'Masterclass & Authority' },
  { name: 'Branding + Network Growth Engine', price: 499, desc: 'End-to-End Executive Brand' },
  { name: 'Custom Strategy Session', price: 299, desc: 'Tailored 1-on-1 Consultation' }
]

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  CONFIRMED: { bg: alpha('#10B981', 0.12), color: '#10B981', border: alpha('#10B981', 0.3) },
  COMPLETED: { bg: alpha('#3B82F6', 0.12), color: '#3B82F6', border: alpha('#3B82F6', 0.3) },
  PENDING: { bg: alpha('#F59E0B', 0.12), color: '#F59E0B', border: alpha('#F59E0B', 0.3) },
  CANCELLED: { bg: alpha('#EF4444', 0.12), color: '#EF4444', border: alpha('#EF4444', 0.3) },
}

// Exactly 2 payment options as requested
const PAYMENT_METHODS = [
  { value: 'THROUGH_WEBSITE', label: '🌐 Through website' },
  { value: 'OFFLINE_CASH', label: '💵 Offline cash in person' }
]

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL')

  // Modals state
  const [createOpen, setCreateOpen] = useState<boolean>(false)
  const [editBooking, setEditBooking] = useState<BookingItem | null>(null)
  const [deleteBooking, setDeleteBooking] = useState<BookingItem | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Notification Toast
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  // Create form state
  const [createForm, setCreateForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceName: 'Profile Setup + Account Building Advice',
    bookingDate: new Date().toISOString().split('T')[0],
    bookingTime: '11:00:00',
    amount: 129,
    paymentMethod: 'OFFLINE_CASH',
    paymentId: '',
    status: 'CONFIRMED',
    meetingLink: '',
    notes: '',
  })

  // Edit form state
  const [editForm, setEditForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceName: '',
    bookingDate: '',
    bookingTime: '',
    amount: 0,
    paymentMethod: 'OFFLINE_CASH',
    paymentId: '',
    status: 'CONFIRMED',
    meetingLink: '',
    notes: '',
  })

  const fetchBookings = useCallback(async () => {
    setLoading(true)
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
      setSnackbar({
        open: true,
        message: 'Could not load bookings from server',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.clientName.trim() || !createForm.clientEmail.trim()) {
      setSnackbar({ open: true, message: 'Client name and email are required', severity: 'error' })
      return
    }
    setSubmitting(true)
    try {
      const isOffline = createForm.paymentMethod === 'OFFLINE_CASH'
      const prefix = isOffline ? 'CASH_' : 'WEB_'
      const payload = {
        ...createForm,
        amount: Number(createForm.amount) || 0,
        bookingTime: createForm.bookingTime.length === 5 ? `${createForm.bookingTime}:00` : createForm.bookingTime,
        paymentId: createForm.paymentId.trim() || `${prefix}${Date.now()}`
      }
      await api.post('/bookings/admin', payload)
      setSnackbar({ open: true, message: 'New booking registered successfully!', severity: 'success' })
      setCreateOpen(false)
      // Reset form
      setCreateForm({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        serviceName: 'Profile Setup + Account Building Advice',
        bookingDate: new Date().toISOString().split('T')[0],
        bookingTime: '11:00:00',
        amount: 129,
        paymentMethod: 'OFFLINE_CASH',
        paymentId: '',
        status: 'CONFIRMED',
        meetingLink: '',
        notes: '',
      })
      fetchBookings()
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to create booking'
      setSnackbar({ open: true, message: errMsg, severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenEdit = (b: BookingItem) => {
    setEditBooking(b)
    const rawMethod = (b.paymentMethod || '').toUpperCase()
    const isOffline = rawMethod.includes('CASH') || rawMethod.includes('OFFLINE')
    const normalizedMethod = isOffline ? 'OFFLINE_CASH' : 'THROUGH_WEBSITE'

    setEditForm({
      clientName: b.clientName || '',
      clientEmail: b.clientEmail || '',
      clientPhone: b.clientPhone || '',
      serviceName: b.serviceName || '',
      bookingDate: b.bookingDate || b.preferredDate || new Date().toISOString().split('T')[0],
      bookingTime: b.bookingTime || b.preferredTime || '11:00:00',
      amount: b.amount || b.amountPaid || 0,
      paymentMethod: normalizedMethod,
      paymentId: b.paymentId || '',
      status: b.status || 'CONFIRMED',
      meetingLink: b.meetingLink || '',
      notes: b.notes || '',
    })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editBooking) return
    setSubmitting(true)
    try {
      const payload = {
        ...editForm,
        amount: Number(editForm.amount) || 0,
        bookingTime: editForm.bookingTime.length === 5 ? `${editForm.bookingTime}:00` : editForm.bookingTime,
      }
      await api.put(`/bookings/admin/${editBooking.id}`, payload)
      setSnackbar({ open: true, message: `Booking #${editBooking.id} updated successfully!`, severity: 'success' })
      setEditBooking(null)
      fetchBookings()
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update booking'
      setSnackbar({ open: true, message: errMsg, severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!deleteBooking) return
    setSubmitting(true)
    try {
      await api.delete(`/bookings/admin/${deleteBooking.id}`)
      setSnackbar({ open: true, message: `Booking #${deleteBooking.id} deleted successfully!`, severity: 'success' })
      setDeleteBooking(null)
      fetchBookings()
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete booking'
      setSnackbar({ open: true, message: errMsg, severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
      setSnackbar({ open: true, message: `Booking #${id} status changed to ${newStatus}`, severity: 'success' })
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' })
    }
  }

  // Filter and search
  const filteredBookings = bookings.filter(b => {
    const rawMethod = (b.paymentMethod || '').toUpperCase()
    const isOffline = rawMethod.includes('CASH') || rawMethod.includes('OFFLINE')
    const matchesSearch =
      (b.clientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.clientEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.serviceName || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.paymentId || '').toLowerCase().includes(search.toLowerCase()) ||
      (isOffline ? 'offline cash in person' : 'through website').includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || (b.status || '').toUpperCase() === statusFilter

    const matchesPayment =
      paymentFilter === 'ALL' ||
      (paymentFilter === 'OFFLINE_CASH' && isOffline) ||
      (paymentFilter === 'THROUGH_WEBSITE' && !isOffline)

    return matchesSearch && matchesStatus && matchesPayment
  })

  // Summary Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.amount || b.amountPaid) || 0), 0)
  const offlineCashCount = bookings.filter(b => {
    const m = (b.paymentMethod || '').toUpperCase()
    return m.includes('CASH') || m.includes('OFFLINE')
  }).length
  const throughWebsiteCount = bookings.length - offlineCashCount

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header with Title & Action */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: brandColors.text, letterSpacing: '-0.02em', mb: 0.5 }}>
              Bookings & Appointments ({bookings.length})
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.muted }}>
              Manage online consultations, record offline cash clients in person, and adjust bookings.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="outlined"
              onClick={fetchBookings}
              startIcon={<FiRefreshCw className={loading ? 'animate-spin' : ''} />}
              sx={{
                borderRadius: '14px',
                borderColor: brandColors.border,
                color: brandColors.text,
                px: 2.5,
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                '&:hover': { borderColor: brandColors.primary, backgroundColor: alpha(brandColors.primary, 0.04) }
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              onClick={() => setCreateOpen(true)}
              startIcon={<FiPlus />}
              sx={{
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#fff',
                px: 3,
                fontWeight: 700,
                boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.4)',
                '&:hover': { background: 'linear-gradient(135deg, #0369A1 0%, #075985 100%)' }
              }}
            >
              Add Booking (Offline Cash / Walk-in)
            </Button>
          </Stack>
        </Box>

        {/* Quick KPI Cards with Glassmorphism */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${brandColors.border}`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: alpha(brandColors.primary, 0.1), color: brandColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                <FiCalendar />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Sessions
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text }}>
                  {bookings.length}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${brandColors.border}`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: alpha('#10B981', 0.1), color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                <FiDollarSign />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Revenue
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text }}>
                  ₹{totalRevenue.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${brandColors.border}`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: alpha('#0284C7', 0.1), color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                <FiGlobe />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Through Website
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text }}>
                  {throughWebsiteCount}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${brandColors.border}`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: alpha('#10B981', 0.1), color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                <FiCreditCard />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Offline Cash In Person
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text }}>
                  {offlineCashCount}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Filter Controls Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${brandColors.border}`,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2
          }}
        >
          {/* Search Field */}
          <TextField
            size="small"
            placeholder="Search by client, email, plan, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch color={brandColors.muted} />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px', background: '#fff', fontSize: '0.9rem' }
            }}
            sx={{ width: { xs: '100%', md: 320 } }}
          />

          {/* Payment Method & Status Filter Pills */}
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: { xs: 1, md: 0 }, flexWrap: { xs: 'nowrap', md: 'wrap' } }}>
            {/* Payment Method Filter */}
            <Chip
              label="All Payment Modes"
              onClick={() => setPaymentFilter('ALL')}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                backgroundColor: paymentFilter === 'ALL' ? brandColors.text : alpha(brandColors.primary, 0.04),
                color: paymentFilter === 'ALL' ? '#fff' : brandColors.text,
              }}
            />
            <Chip
              label="🌐 Through Website"
              onClick={() => setPaymentFilter('THROUGH_WEBSITE')}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                backgroundColor: paymentFilter === 'THROUGH_WEBSITE' ? '#0284C7' : alpha('#0284C7', 0.08),
                color: paymentFilter === 'THROUGH_WEBSITE' ? '#fff' : '#0284C7',
                border: `1px solid ${alpha('#0284C7', 0.3)}`
              }}
            />
            <Chip
              label="💵 Offline Cash in Person"
              onClick={() => setPaymentFilter('OFFLINE_CASH')}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                backgroundColor: paymentFilter === 'OFFLINE_CASH' ? '#10B981' : alpha('#10B981', 0.08),
                color: paymentFilter === 'OFFLINE_CASH' ? '#fff' : '#10B981',
                border: `1px solid ${alpha('#10B981', 0.3)}`
              }}
            />
          </Stack>
        </Paper>

        {/* Table / List View */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
            <CircularProgress color="primary" />
            <Typography variant="body2" sx={{ mt: 2, color: brandColors.muted }}>Loading consultation bookings...</Typography>
          </Box>
        ) : filteredBookings.length === 0 ? (
          <Paper
            sx={{
              p: { xs: 3, sm: 6 },
              borderRadius: '24px',
              border: `1px dashed ${brandColors.border}`,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <FiCalendar size={26} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.text, mb: 1 }}>No bookings found</Typography>
            <Typography variant="body2" sx={{ color: brandColors.muted, maxWidth: 450, mx: 'auto', mb: 3 }}>
              {search || statusFilter !== 'ALL' || paymentFilter !== 'ALL'
                ? 'No consultation bookings match your current search and filter criteria.'
                : 'No bookings recorded in the system yet. Click below to add an offline cash client.'}
            </Typography>
            <Button
              onClick={() => setCreateOpen(true)}
              variant="contained"
              startIcon={<FiPlus />}
              sx={{ borderRadius: '12px', px: 3, py: 1.2, fontWeight: 700, background: brandColors.primary }}
            >
              Add Booking (Offline Cash / Walk-in)
            </Button>
          </Paper>
        ) : (
          <Box>
            {/* 1. MOBILE CARD VIEW (< md breakpoints) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
              {filteredBookings.map((b) => {
                const displayDate = b.bookingDate || b.preferredDate || 'Confirmed'
                const displayTime = b.bookingTime || b.preferredTime || ''
                const displayAmount = b.amount !== undefined ? b.amount : (b.amountPaid || 129)
                const rawMethod = (b.paymentMethod || '').toUpperCase()
                const isOffline = rawMethod.includes('CASH') || rawMethod.includes('OFFLINE')
                const paymentLabel = isOffline ? 'Offline cash in person' : 'Through website'
                const statusConf = STATUS_COLORS[b.status?.toUpperCase()] || STATUS_COLORS.PENDING

                return (
                  <Paper
                    key={b.id}
                    elevation={0}
                    sx={{
                      p: 2.2,
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(16px)',
                      border: `1px solid ${brandColors.border}`,
                      boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5
                    }}
                  >
                    {/* Header: Client & Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: brandColors.text, lineHeight: 1.2 }}>
                          {b.clientName || 'Valued Client'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', mt: 0.2, wordBreak: 'break-all' }}>
                          {b.clientEmail || 'No email provided'}
                        </Typography>
                        {b.clientPhone && b.clientPhone !== 'N/A' && (
                          <Box
                            component="a"
                            href={`tel:${b.clientPhone}`}
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.6,
                              color: brandColors.primary,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              mt: 0.3
                            }}
                          >
                            <FiPhone size={11} />
                            <span>{b.clientPhone}</span>
                          </Box>
                        )}
                      </Box>

                      {/* Edit & Delete Action Buttons */}
                      <Stack direction="row" spacing={0.8} sx={{ flexShrink: 0 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(b)}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '9px',
                            backgroundColor: alpha(brandColors.primary, 0.08),
                            color: brandColors.primary
                          }}
                        >
                          <FiEdit2 size={14} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteBooking(b)}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '9px',
                            backgroundColor: alpha('#EF4444', 0.08),
                            color: '#EF4444'
                          }}
                        >
                          <FiTrash2 size={14} />
                        </IconButton>
                      </Stack>
                    </Box>

                    {/* Service Plan */}
                    <Box sx={{ backgroundColor: alpha(brandColors.primary, 0.02), p: 1.4, borderRadius: '12px', border: `1px solid ${alpha(brandColors.border, 0.6)}` }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text }}>
                        {b.serviceName}
                      </Typography>
                      {b.notes && (
                        <Typography variant="caption" sx={{ color: brandColors.muted, display: 'flex', alignItems: 'center', gap: 0.6, mt: 0.5, fontStyle: 'italic' }}>
                          <FiFileText size={11} style={{ flexShrink: 0 }} />
                          <span>{b.notes}</span>
                        </Typography>
                      )}
                      {b.meetingLink && (
                        <Typography variant="caption" sx={{ color: '#0284C7', display: 'flex', alignItems: 'center', gap: 0.6, fontWeight: 700, mt: 0.4 }}>
                          <FiVideo size={11} style={{ flexShrink: 0 }} />
                          <span>Google Meet Linked</span>
                        </Typography>
                      )}
                    </Box>

                    {/* Meta Row: Date/Time, Amount & Payment */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: brandColors.text, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.6 }}>
                          <FiCalendar size={12} color={brandColors.primary} />
                          <span>{displayDate} {displayTime ? `· ${displayTime}` : ''}</span>
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#10B981', lineHeight: 1.1 }}>
                          ₹{displayAmount.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Footer Row: Payment Chip & Status Selector */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: `1px solid ${alpha(brandColors.border, 0.5)}`, gap: 1 }}>
                      <Chip
                        size="small"
                        icon={isOffline ? <FiCreditCard size={11} /> : <FiGlobe size={11} />}
                        label={paymentLabel}
                        sx={{
                          height: 24,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          backgroundColor: isOffline ? alpha('#10B981', 0.1) : alpha('#0284C7', 0.1),
                          color: isOffline ? '#10B981' : '#0284C7',
                          border: `1px solid ${isOffline ? alpha('#10B981', 0.25) : alpha('#0284C7', 0.25)}`,
                          '& .MuiChip-icon': { color: 'inherit', ml: '4px' }
                        }}
                      />

                      <Select
                        size="small"
                        value={b.status || 'CONFIRMED'}
                        onChange={(e) => handleQuickStatusChange(b.id, e.target.value)}
                        sx={{
                          height: 30,
                          minWidth: 115,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                          backgroundColor: statusConf.bg,
                          color: statusConf.color,
                          border: `1px solid ${statusConf.border}`,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          '& .MuiSelect-select': { py: 0.4, px: 1 }
                        }}
                      >
                        <MenuItem value="PENDING">PENDING</MenuItem>
                        <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                        <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                        <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                      </Select>
                    </Box>
                  </Paper>
                )
              })}
            </Box>

            {/* 2. DESKTOP & TABLET TABLE VIEW (>= md breakpoints) */}
            <Paper
              sx={{
                display: { xs: 'none', md: 'block' },
                borderRadius: '24px',
                border: `1px solid ${brandColors.border}`,
                boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.03)',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ overflowX: 'auto', width: '100%' }}>
                <Box sx={{ minWidth: 980 }}>
                  {/* Table Header */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '260px 260px 160px 180px 140px 90px',
                      gap: 2,
                      px: 3,
                      py: 2,
                      borderBottom: `1px solid ${brandColors.border}`,
                      backgroundColor: alpha(brandColors.primary, 0.03),
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>
                      CLIENT & CONTACT
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>
                      CONSULTATION PLAN
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>
                      DATE & TIME
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>
                      AMOUNT & METHOD
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>
                      STATUS
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em', textAlign: 'center' }}>
                      ACTIONS
                    </Typography>
                  </Box>

                  {/* Table Body Rows */}
                  {filteredBookings.map((b, i) => {
                    const displayDate = b.bookingDate || b.preferredDate || 'Confirmed'
                    const displayTime = b.bookingTime || b.preferredTime || ''
                    const displayAmount = b.amount !== undefined ? b.amount : (b.amountPaid || 129)
                    
                    const rawMethod = (b.paymentMethod || '').toUpperCase()
                    const isOffline = rawMethod.includes('CASH') || rawMethod.includes('OFFLINE')
                    const paymentLabel = isOffline ? 'Offline cash in person' : 'Through website'
                    const statusConf = STATUS_COLORS[b.status?.toUpperCase()] || STATUS_COLORS.PENDING

                    return (
                      <Box
                        key={b.id}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '260px 260px 160px 180px 140px 90px',
                          gap: 2,
                          px: 3,
                          py: 2.2,
                          borderBottom: i < filteredBookings.length - 1 ? `1px solid ${brandColors.border}` : 'none',
                          alignItems: 'center',
                          '&:hover': { backgroundColor: alpha(brandColors.primary, 0.02) },
                          transition: 'background 0.15s ease'
                        }}
                      >
                        {/* 1. Client Info */}
                        <Box sx={{ pr: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text, lineHeight: 1.3 }}>
                            {b.clientName || 'Valued Client'}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: brandColors.muted,
                              display: 'block',
                              mt: 0.3,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {b.clientEmail || 'No email provided'}
                          </Typography>
                          {b.clientPhone && b.clientPhone !== 'N/A' && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: brandColors.primary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.6,
                                fontWeight: 600,
                                mt: 0.3
                              }}
                            >
                              <FiPhone size={11} style={{ flexShrink: 0 }} />
                              <span>{b.clientPhone}</span>
                            </Typography>
                          )}
                        </Box>

                        {/* 2. Service Plan */}
                        <Box sx={{ pr: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, lineHeight: 1.3 }}>
                            {b.serviceName}
                          </Typography>
                          {b.notes && (
                            <Tooltip title={b.notes} placement="top" arrow>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: brandColors.muted,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.6,
                                  mt: 0.4,
                                  fontStyle: 'italic',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '100%'
                                }}
                              >
                                <FiFileText size={11} style={{ flexShrink: 0 }} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {b.notes}
                                </span>
                              </Typography>
                            </Tooltip>
                          )}
                          {b.meetingLink && (
                            <Typography variant="caption" sx={{ color: '#0284C7', display: 'flex', alignItems: 'center', gap: 0.6, fontWeight: 600, mt: 0.2 }}>
                              <FiVideo size={11} style={{ flexShrink: 0 }} />
                              <span>Google Meet Linked</span>
                            </Typography>
                          )}
                        </Box>

                        {/* 3. Date & Time */}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <FiCalendar size={13} color={brandColors.primary} style={{ flexShrink: 0 }} />
                            <span>{displayDate}</span>
                          </Typography>
                          {displayTime && (
                            <Typography variant="caption" sx={{ color: brandColors.muted, display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.4 }}>
                              <FiClock size={12} style={{ flexShrink: 0 }} />
                              <span>{displayTime}</span>
                            </Typography>
                          )}
                        </Box>

                        {/* 4. Payment Option & Amount */}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem' }}>
                            ₹{displayAmount.toLocaleString()}
                          </Typography>
                          <Chip
                            size="small"
                            icon={isOffline ? <FiCreditCard size={11} /> : <FiGlobe size={11} />}
                            label={paymentLabel}
                            sx={{
                              height: 22,
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              mt: 0.4,
                              borderRadius: '6px',
                              backgroundColor: isOffline ? alpha('#10B981', 0.1) : alpha('#0284C7', 0.1),
                              color: isOffline ? '#10B981' : '#0284C7',
                              border: `1px solid ${isOffline ? alpha('#10B981', 0.25) : alpha('#0284C7', 0.25)}`,
                              '& .MuiChip-icon': {
                                color: 'inherit',
                                ml: '4px'
                              }
                            }}
                          />
                        </Box>

                        {/* 5. Status Dropdown */}
                        <Box>
                          <Select
                            size="small"
                            value={b.status || 'CONFIRMED'}
                            onChange={(e) => handleQuickStatusChange(b.id, e.target.value)}
                            sx={{
                              height: 32,
                              width: '100%',
                              maxWidth: 125,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              borderRadius: '10px',
                              backgroundColor: statusConf.bg,
                              color: statusConf.color,
                              border: `1px solid ${statusConf.border}`,
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                              '& .MuiSelect-select': { py: 0.5, px: 1.2 }
                            }}
                          >
                            <MenuItem value="PENDING">PENDING</MenuItem>
                            <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                            <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                          </Select>
                        </Box>

                        {/* 6. Action Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.8 }}>
                          <Tooltip title="Edit Booking Details">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(b)}
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '9px',
                                backgroundColor: alpha(brandColors.primary, 0.07),
                                color: brandColors.primary,
                                '&:hover': { backgroundColor: alpha(brandColors.primary, 0.18) }
                              }}
                            >
                              <FiEdit2 size={14} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Booking">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteBooking(b)}
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '9px',
                                backgroundColor: alpha('#EF4444', 0.07),
                                color: '#EF4444',
                                '&:hover': { backgroundColor: alpha('#EF4444', 0.18) }
                              }}
                            >
                              <FiTrash2 size={14} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {/* ----------------- CREATE BOOKING MODAL ----------------- */}
        <Dialog
          open={createOpen}
          onClose={() => !submitting && setCreateOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              border: `1px solid ${brandColors.border}`,
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.15)',
              p: 1
            }
          }}
        >
          <DialogTitle sx={{ px: 3, pt: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text }}>
                Add Booking (Offline Cash / Through Website)
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted }}>
                Create a consultation booking for clients paying in person or through the website.
              </Typography>
            </Box>
            <IconButton onClick={() => setCreateOpen(false)} disabled={submitting}>
              <FiX />
            </IconButton>
          </DialogTitle>

          <form onSubmit={handleCreateSubmit}>
            <DialogContent sx={{ px: 3, py: 2 }}>
              <Grid container spacing={2.5}>
                {/* Client Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Client Full Name"
                    placeholder="e.g. Raghav Dhir"
                    value={createForm.clientName}
                    onChange={(e) => setCreateForm({ ...createForm, clientName: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><FiUser color={brandColors.muted} /></InputAdornment>,
                      sx: { borderRadius: '14px' }
                    }}
                  />
                </Grid>

                {/* Client Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    type="email"
                    label="Client Email"
                    placeholder="e.g. client@example.com"
                    value={createForm.clientEmail}
                    onChange={(e) => setCreateForm({ ...createForm, clientEmail: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><FiMail color={brandColors.muted} /></InputAdornment>,
                      sx: { borderRadius: '14px' }
                    }}
                  />
                </Grid>

                {/* Client Phone */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Client Phone / WhatsApp"
                    placeholder="e.g. +91 9876543210"
                    value={createForm.clientPhone}
                    onChange={(e) => setCreateForm({ ...createForm, clientPhone: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><FiPhone color={brandColors.muted} /></InputAdornment>,
                      sx: { borderRadius: '14px' }
                    }}
                  />
                </Grid>

                {/* Service Selection */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Consultation Plan / Service</InputLabel>
                    <Select
                      label="Consultation Plan / Service"
                      value={createForm.serviceName}
                      onChange={(e) => {
                        const sName = e.target.value
                        const match = SERVICE_PRESETS.find(p => p.name === sName)
                        setCreateForm({
                          ...createForm,
                          serviceName: sName,
                          amount: match ? match.price : createForm.amount
                        })
                      }}
                      sx={{ borderRadius: '14px' }}
                    >
                      {SERVICE_PRESETS.map(p => (
                        <MenuItem key={p.name} value={p.name}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <span>{p.name}</span>
                            <Chip size="small" label={`₹${p.price}`} sx={{ height: 22, fontWeight: 700, ml: 1.5, background: alpha(brandColors.primary, 0.1), color: brandColors.primary }} />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Booking Amount */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Amount (₹)"
                    value={createForm.amount}
                    onChange={(e) => setCreateForm({ ...createForm, amount: Number(e.target.value) })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontWeight: 700, color: brandColors.muted }}>₹</Typography></InputAdornment>,
                      sx: { borderRadius: '14px' }
                    }}
                  />
                </Grid>

                {/* Booking Date */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    type="date"
                    label="Booking Date"
                    value={createForm.bookingDate}
                    onChange={(e) => setCreateForm({ ...createForm, bookingDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: { borderRadius: '14px' } }}
                  />
                </Grid>

                {/* Booking Time */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    type="time"
                    label="Booking Time"
                    value={createForm.bookingTime.substring(0, 5)}
                    onChange={(e) => setCreateForm({ ...createForm, bookingTime: `${e.target.value}:00` })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: { borderRadius: '14px' } }}
                  />
                </Grid>

                {/* Payment Option: Exactly 2 Choices */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Option</InputLabel>
                    <Select
                      label="Payment Option"
                      value={createForm.paymentMethod}
                      onChange={(e) => setCreateForm({ ...createForm, paymentMethod: e.target.value })}
                      sx={{ borderRadius: '14px' }}
                    >
                      {PAYMENT_METHODS.map(m => (
                        <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Payment Reference ID */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Payment Ref / Transaction ID"
                    placeholder="Auto-generated if left blank"
                    value={createForm.paymentId}
                    onChange={(e) => setCreateForm({ ...createForm, paymentId: e.target.value })}
                    InputProps={{ sx: { borderRadius: '14px' } }}
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={createForm.status}
                      onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                      sx={{ borderRadius: '14px' }}
                    >
                      <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                      <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                      <MenuItem value="PENDING">PENDING</MenuItem>
                      <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Google Meet Link */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Google Meet / Meeting URL (Optional)"
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                    value={createForm.meetingLink}
                    onChange={(e) => setCreateForm({ ...createForm, meetingLink: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><FiVideo color={brandColors.muted} /></InputAdornment>,
                      sx: { borderRadius: '14px' }
                    }}
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Internal Notes / Client Requirements"
                    placeholder="e.g. Client requested focus on LinkedIn headline and creator mode"
                    value={createForm.notes}
                    onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><FiFileText color={brandColors.muted} /></InputAdornment>,
                      sx: { borderRadius: '14px' }
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
              <Button onClick={() => setCreateOpen(false)} disabled={submitting} sx={{ borderRadius: '12px', fontWeight: 600 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <FiPlus />}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  fontWeight: 700,
                  background: brandColors.primary,
                  boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.4)'
                }}
              >
                {submitting ? 'Creating...' : 'Create Booking'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* ----------------- EDIT BOOKING MODAL ----------------- */}
        <Dialog
          open={Boolean(editBooking)}
          onClose={() => !submitting && setEditBooking(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              border: `1px solid ${brandColors.border}`,
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.15)',
              p: 1
            }
          }}
        >
          <DialogTitle sx={{ px: 3, pt: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text }}>
                Edit Booking #{editBooking?.id}
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted }}>
                Modify client details, session date/time, fee, payment option, or appointment status.
              </Typography>
            </Box>
            <IconButton onClick={() => setEditBooking(null)} disabled={submitting}>
              <FiX />
            </IconButton>
          </DialogTitle>

          <form onSubmit={handleEditSubmit}>
            <DialogContent sx={{ px: 3, py: 2 }}>
              <Grid container spacing={2.5}>
                {/* Client Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Client Full Name"
                    value={editForm.clientName}
                    onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><FiUser color={brandColors.muted} /></InputAdornment>,
                      sx: { borderRadius: '14px' }
                    }}
                  />
                </Grid>

                {/* Client Phone */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Client Phone"
                    value={editForm.clientPhone}
                    onChange={(e) => setEditForm({ ...editForm, clientPhone: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><FiPhone color={brandColors.muted} /></InputAdornment>,
                      sx: { borderRadius: '14px' }
                    }}
                  />
                </Grid>

                {/* Service Plan */}
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Service Name / Plan"
                    value={editForm.serviceName}
                    onChange={(e) => setEditForm({ ...editForm, serviceName: e.target.value })}
                    InputProps={{ sx: { borderRadius: '14px' } }}
                  />
                </Grid>

                {/* Amount */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Amount (₹)"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Typography sx={{ fontWeight: 700, color: brandColors.muted }}>₹</Typography></InputAdornment>,
                      sx: { borderRadius: '14px' }
                    }}
                  />
                </Grid>

                {/* Booking Date */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Booking Date"
                    value={editForm.bookingDate}
                    onChange={(e) => setEditForm({ ...editForm, bookingDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: { borderRadius: '14px' } }}
                  />
                </Grid>

                {/* Booking Time */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Booking Time"
                    value={editForm.bookingTime.substring(0, 5)}
                    onChange={(e) => setEditForm({ ...editForm, bookingTime: `${e.target.value}:00` })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: { borderRadius: '14px' } }}
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      sx={{ borderRadius: '14px' }}
                    >
                      <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                      <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                      <MenuItem value="PENDING">PENDING</MenuItem>
                      <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Payment Option: Exactly 2 Choices */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Option</InputLabel>
                    <Select
                      label="Payment Option"
                      value={editForm.paymentMethod}
                      onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                      sx={{ borderRadius: '14px' }}
                    >
                      {PAYMENT_METHODS.map(m => (
                        <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Payment Reference ID */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Payment Reference / ID"
                    value={editForm.paymentId}
                    onChange={(e) => setEditForm({ ...editForm, paymentId: e.target.value })}
                    InputProps={{ sx: { borderRadius: '14px' } }}
                  />
                </Grid>

                {/* Meeting Link */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Meeting Link / Google Meet"
                    value={editForm.meetingLink}
                    onChange={(e) => setEditForm({ ...editForm, meetingLink: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><FiVideo color={brandColors.muted} /></InputAdornment>,
                      sx: { borderRadius: '14px' }
                    }}
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Notes / Special Instructions"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    InputProps={{ sx: { borderRadius: '14px' } }}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
              <Button onClick={() => setEditBooking(null)} disabled={submitting} sx={{ borderRadius: '12px', fontWeight: 600 }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <FiEdit2 />}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  fontWeight: 700,
                  background: brandColors.primary,
                  boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.4)'
                }}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* ----------------- DELETE CONFIRMATION MODAL ----------------- */}
        <Dialog
          open={Boolean(deleteBooking)}
          onClose={() => !submitting && setDeleteBooking(null)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              p: 1,
              border: `1px solid ${brandColors.border}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }
          }}
        >
          <DialogTitle sx={{ px: 3, pt: 3, pb: 1, textAlign: 'center' }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: alpha('#EF4444', 0.1), color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <FiAlertCircle size={28} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text }}>
              Delete Booking #{deleteBooking?.id}?
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.muted, mt: 1 }}>
              Are you sure you want to delete this booking for <strong>{deleteBooking?.clientName || 'Client'}</strong>? This action cannot be undone.
            </Typography>
          </DialogTitle>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, justifyContent: 'center', gap: 1.5 }}>
            <Button onClick={() => setDeleteBooking(null)} disabled={submitting} sx={{ borderRadius: '12px', fontWeight: 600, px: 2.5 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteSubmit}
              disabled={submitting}
              sx={{
                borderRadius: '12px',
                px: 3,
                fontWeight: 700,
                backgroundColor: '#EF4444',
                '&:hover': { backgroundColor: '#DC2626' }
              }}
            >
              {submitting ? 'Deleting...' : 'Delete Booking'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toast / Snackbar Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ borderRadius: '14px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Box>
  )
}
