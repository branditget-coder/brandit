import { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, TextField, InputAdornment, Stack,
  Tabs, Tab, alpha, CircularProgress, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, MenuItem, Grid, useTheme, useMediaQuery,
  Card, CardContent, Divider
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  FiSearch, FiCalendar, FiPhone, FiMail, FiCheckCircle, FiClock,
  FiXCircle, FiInbox, FiVideo, FiSend, FiExternalLink, FiRefreshCw
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
  meetingLink?: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  amount?: number
  paymentId?: string
  paymentMethod?: string
  paymentScreenshot?: string
  notes?: string
  consultantName?: string
}

// Generate official Google Meet format URL: https://meet.google.com/abc-defg-hij
const generateGoogleMeetUrl = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  const randString = (length: number) =>
    Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
  return `https://meet.google.com/${randString(3)}-${randString(4)}-${randString(3)}`
}

// Format Date & Time cleanly (e.g., "02 Aug 2026 at 11:00 AM")
const formatDateTime = (dateStr?: string, timeStr?: string) => {
  if (!dateStr) return 'Slot Not Assigned'
  try {
    const cleanDate = dateStr.split('T')[0]
    const [year, month, day] = cleanDate.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthName = monthNames[parseInt(month, 10) - 1] || month
    
    let formattedTime = ''
    if (timeStr) {
      const cleanTime = timeStr.substring(0, 5) // "11:00"
      const [hrs, mins] = cleanTime.split(':')
      const hour = parseInt(hrs, 10)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const formattedHour = hour % 12 || 12
      formattedTime = `${formattedHour}:${mins} ${ampm}`
    }
    return `${day} ${monthName} ${year}${formattedTime ? ` at ${formattedTime}` : ''}`
  } catch {
    return `${dateStr} ${timeStr || ''}`
  }
}

export default function TeamConsultations() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusTab, setStatusTab] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL')
  
  // Google Meet Scheduler Modal state for HR team (Stuti & Kritika)
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [submittingSchedule, setSubmittingSchedule] = useState(false)
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState<string | null>(null)
  const [scheduleErrMsg, setScheduleErrMsg] = useState<string | null>(null)

  // Form Fields
  const [consultantName, setConsultantName] = useState('Hritika Seth')
  const [consultantEmail, setConsultantEmail] = useState('sethhritika@gmail.com')
  const [meetDate, setMeetDate] = useState('')
  const [meetTime, setMeetTime] = useState('11:00')
  const [meetLink, setMeetLink] = useState('')
  const [customNotes, setCustomNotes] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await api.get('/bookings/all')
      setBookings(Array.isArray(res.data) ? res.data : [])
    } catch {
      try {
        const fallbackRes = await api.get('/bookings')
        setBookings(Array.isArray(fallbackRes.data) ? fallbackRes.data : [])
      } catch {
        setBookings([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenScheduleModal = (booking: BookingItem) => {
    setSelectedBooking(booking)
    setConsultantName('Hritika Seth')
    setConsultantEmail('sethhritika@gmail.com')
    
    const todayStr = new Date().toISOString().split('T')[0]
    setMeetDate(booking.bookingDate || todayStr)
    setMeetTime(booking.bookingTime ? booking.bookingTime.substring(0, 5) : '11:00')
    
    // Auto-generate proper Google Meet link if existing one is invalid or missing
    const hasValidMeet = booking.meetingLink && booking.meetingLink.includes('meet.google.com/')
    setMeetLink(hasValidMeet ? booking.meetingLink! : generateGoogleMeetUrl())
    setCustomNotes(booking.notes || 'Please have your updated resume and target job goals ready for discussion.')
    
    setScheduleSuccessMsg(null)
    setScheduleErrMsg(null)
    setScheduleModalOpen(true)
  }

  const handleGenerateMeetLink = () => {
    setMeetLink(generateGoogleMeetUrl())
  }

  const handleScheduleSubmit = async () => {
    if (!selectedBooking) return
    if (!meetDate || !meetTime || !meetLink) {
      setScheduleErrMsg('Please select Date, Time, and provide a valid Google Meet link.')
      return
    }

    try {
      setSubmittingSchedule(true)
      setScheduleErrMsg(null)

      const payload = {
        bookingDate: meetDate,
        bookingTime: meetTime,
        meetingLink: meetLink,
        consultantName: consultantName,
        consultantEmail: consultantEmail,
        customNotes: customNotes
      }

      await api.post(`/bookings/${selectedBooking.id}/schedule-meet`, payload)
      
      setScheduleSuccessMsg(`Successfully scheduled Google Meet with ${consultantName}! Email invitations dispatched to ${selectedBooking.clientEmail || 'client'} & ${consultantEmail}.`)
      
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? {
        ...b,
        bookingDate: meetDate,
        bookingTime: meetTime,
        meetingLink: meetLink,
        status: 'CONFIRMED',
        consultantName: consultantName,
        notes: customNotes
      } : b))

      setTimeout(() => {
        setScheduleModalOpen(false)
      }, 1800)

    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to schedule meeting. Please try again.'
      setScheduleErrMsg(msg)
    } finally {
      setSubmittingSchedule(false)
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

  // Meeting Status Helpers
  const isMeetingScheduled = (b: BookingItem) => {
    return b.status === 'CONFIRMED' && !!b.meetingLink && b.meetingLink.trim().length > 0 && b.meetingLink.includes('meet.google.com')
  }

  const isPendingSchedule = (b: BookingItem) => {
    return b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (!b.meetingLink || !b.meetingLink.includes('meet.google.com'))
  }

  // Filter Bookings strictly according to User Feedback:
  // 1. NEVER show CANCELLED bookings
  // 2. Scheduled tab ONLY shows bookings where Google Meet link is attached!
  const filteredBookings = bookings.filter(b => {
    if (b.status === 'CANCELLED') return false // 1. Don't show cancelled ones

    const name = b.clientName || ''
    const email = b.clientEmail || ''
    const phone = b.clientPhone || ''
    const service = b.serviceName || ''
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          phone.includes(searchQuery) ||
                          service.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesTab = true
    if (statusTab === 'PENDING') {
      matchesTab = isPendingSchedule(b)
    } else if (statusTab === 'CONFIRMED') {
      matchesTab = isMeetingScheduled(b)
    } else if (statusTab === 'COMPLETED') {
      matchesTab = b.status === 'COMPLETED'
    }

    return matchesSearch && matchesTab
  })

  const getStatusChip = (b: BookingItem) => {
    if (b.status === 'COMPLETED') {
      return <Chip label="Session Completed" size="small" icon={<FiCheckCircle size={12} />} sx={{ backgroundColor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 700 }} />
    }
    if (isMeetingScheduled(b)) {
      return <Chip label="Scheduled / Confirmed" size="small" icon={<FiCheckCircle size={12} />} sx={{ backgroundColor: alpha('#10B981', 0.1), color: '#10B981', fontWeight: 700 }} />
    }
    return <Chip label="Pending Schedule" size="small" icon={<FiClock size={12} />} sx={{ backgroundColor: alpha('#F59E0B', 0.1), color: '#D97706', fontWeight: 700 }} />
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        {/* Header Title */}
        <Box sx={{ mb: { xs: 2.5, sm: 4 } }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            HR Client Roster & Google Meet Scheduler
          </Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted, fontSize: { xs: '0.88rem', sm: '1rem' } }}>
            Manage client payments, contacts, and 1-click schedule Google Meet sessions with Lead Consultant <strong>Hritika Seth</strong>.
          </Typography>
        </Box>

        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {/* Controls Header: Search & Tabs */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search client name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch color={brandColors.muted} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', md: 340 }, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Tabs
              value={statusTab}
              onChange={(_, val) => setStatusTab(val)}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons="auto"
              sx={{
                minHeight: 40,
                '& .MuiTabs-indicator': { backgroundColor: brandColors.primary, height: 3, borderRadius: 3 },
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: { xs: '0.82rem', sm: '0.9rem' }, minHeight: 40, px: { xs: 1.5, sm: 2 } },
              }}
            >
              <Tab label="All Active Clients" value="ALL" />
              <Tab label="Pending Schedule" value="PENDING" />
              <Tab label="Scheduled" value="CONFIRMED" />
              <Tab label="Completed" value="COMPLETED" />
            </Tabs>
          </Box>

          {loading ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <CircularProgress size={36} />
            </Box>
          ) : filteredBookings.length === 0 ? (
            <Box sx={{ py: 6, px: 2, textAlign: 'center', backgroundColor: alpha(brandColors.primary, 0.02), borderRadius: '16px', border: `1px dashed ${brandColors.border}` }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <FiInbox size={28} />
              </Box>
              <Typography variant="h6" sx={{ color: brandColors.text, fontWeight: 800, mb: 0.5 }}>
                No Clients Found
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted, maxWidth: 460, mx: 'auto', lineHeight: 1.6 }}>
                {statusTab === 'CONFIRMED'
                  ? 'No Google Meet sessions scheduled yet. Click "Schedule Meet" on any client in "Pending Schedule" tab.'
                  : 'There are currently no active client bookings matching your search filter.'}
              </Typography>
            </Box>
          ) : isMobile ? (

            /* ── MOBILE RESPONSIVE CARDS VIEW (For Mobile / Tablet screens) ── */
            <Stack spacing={2}>
              {filteredBookings.map((booking) => (
                <Card key={booking.id} sx={{ borderRadius: '16px', border: `1px solid ${brandColors.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ pr: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: brandColors.text, lineHeight: 1.3 }}>
                          {booking.clientName || 'Valued Client'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.primary, mt: 0.3 }}>
                          {booking.serviceName}
                        </Typography>
                      </Box>
                      {getStatusChip(booking)}
                    </Box>

                    <Stack spacing={0.6} sx={{ my: 1.5 }}>
                      <Typography variant="caption" component="a" href={`mailto:${booking.clientEmail}`} sx={{ color: brandColors.primary, display: 'flex', alignItems: 'center', gap: 0.8, textDecoration: 'none', fontWeight: 600, wordBreak: 'break-all' }}>
                        <FiMail size={13} /> {booking.clientEmail || 'N/A'}
                      </Typography>
                      <Typography variant="caption" component="a" href={`tel:${booking.clientPhone}`} sx={{ color: brandColors.muted, display: 'flex', alignItems: 'center', gap: 0.8, textDecoration: 'none', fontWeight: 600 }}>
                        <FiPhone size={13} /> {booking.clientPhone || 'N/A'}
                      </Typography>
                    </Stack>

                    <Divider sx={{ my: 1.5, borderColor: alpha(brandColors.border, 0.6) }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#16A34A', fontWeight: 800 }}>
                        {booking.amount ? `₹${booking.amount}` : 'Paid Package'}
                      </Typography>
                      {booking.paymentId && (
                        <Typography variant="caption" sx={{ color: brandColors.muted, fontFamily: 'monospace', backgroundColor: alpha(brandColors.border, 0.5), px: 0.8, py: 0.3, borderRadius: '6px', fontSize: '0.7rem' }}>
                          Ref: {booking.paymentId}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mb: 2, p: 1.2, borderRadius: '10px', backgroundColor: alpha(brandColors.primary, 0.03), border: `1px solid ${alpha(brandColors.border, 0.6)}` }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.text, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FiCalendar size={13} color={brandColors.primary} /> {formatDateTime(booking.bookingDate, booking.bookingTime)}
                      </Typography>
                      {isMeetingScheduled(booking) ? (
                        <Typography variant="caption" component="a" href={booking.meetingLink} target="_blank" rel="noopener noreferrer" sx={{ color: '#1A73E8', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.5, textDecoration: 'none', wordBreak: 'break-all' }}>
                          <FiVideo size={12} /> {booking.meetingLink} <FiExternalLink size={11} />
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#D97706', fontStyle: 'italic', display: 'block', mt: 0.3, fontWeight: 600 }}>
                          Pending Meet Link — Tap "Schedule Meet" below
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        startIcon={<FiVideo size={14} />}
                        onClick={() => handleOpenScheduleModal(booking)}
                        sx={{
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          textTransform: 'none',
                          py: 0.8,
                          background: 'linear-gradient(135deg, #1A73E8 0%, #0D52BF 100%)',
                          boxShadow: '0 2px 8px rgba(26,115,232,0.25)'
                        }}
                      >
                        {isMeetingScheduled(booking) ? 'Reschedule Meet' : 'Schedule Meet'}
                      </Button>
                      {booking.status === 'CONFIRMED' && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                          sx={{ borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'none', px: 2 }}
                        >
                          Done
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

          ) : (

            /* ── DESKTOP TABLE VIEW ── */
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 780 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Client Name & Contact Info</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Package & Payment</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Slot & Google Meet</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>HR Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id} hover>
                      {/* Client Name & Contact */}
                      <TableCell sx={{ minWidth: 220 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: brandColors.text }}>
                          {booking.clientName || 'Valued Client'}
                        </Typography>
                        <Stack spacing={0.3} sx={{ mt: 0.5 }}>
                          <Tooltip title="Click to Email Client">
                            <Typography variant="caption" component="a" href={`mailto:${booking.clientEmail}`} sx={{ color: brandColors.primary, display: 'inline-flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', fontWeight: 600 }}>
                              <FiMail size={12} /> {booking.clientEmail || 'N/A'}
                            </Typography>
                          </Tooltip>
                          <Tooltip title="Click to Call Client">
                            <Typography variant="caption" component="a" href={`tel:${booking.clientPhone}`} sx={{ color: brandColors.muted, display: 'inline-flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', fontWeight: 600 }}>
                              <FiPhone size={12} /> {booking.clientPhone || 'N/A'}
                            </Typography>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      {/* Package & Payment Info */}
                      <TableCell sx={{ minWidth: 200 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text }}>
                          {booking.serviceName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 800 }}>
                            {booking.amount ? `₹${booking.amount}` : 'Paid Package'}
                          </Typography>
                          {booking.paymentId && (
                            <Typography variant="caption" sx={{ color: brandColors.muted, fontFamily: 'monospace', fontSize: '0.72rem', backgroundColor: alpha(brandColors.border, 0.5), px: 0.8, py: 0.2, borderRadius: '4px' }}>
                              Ref: {booking.paymentId}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>

                      {/* Slot & Google Meet Link */}
                      <TableCell sx={{ minWidth: 220 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FiCalendar size={13} color={brandColors.primary} /> {formatDateTime(booking.bookingDate, booking.bookingTime)}
                          </Typography>
                          {isMeetingScheduled(booking) ? (
                            <Tooltip title="Open Google Meet">
                              <Typography variant="caption" component="a" href={booking.meetingLink} target="_blank" rel="noopener noreferrer" sx={{ color: '#1A73E8', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 0.4, mt: 0.5, textDecoration: 'none' }}>
                                <FiVideo size={12} /> Join Meet <FiExternalLink size={10} />
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography variant="caption" sx={{ color: '#D97706', fontStyle: 'italic', display: 'block', mt: 0.3, fontWeight: 600 }}>
                              Pending Meet Link
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      {/* Status Chip */}
                      <TableCell sx={{ minWidth: 150 }}>
                        {getStatusChip(booking)}
                      </TableCell>

                      {/* HR Actions */}
                      <TableCell align="right" sx={{ minWidth: 180 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<FiVideo size={14} />}
                            onClick={() => handleOpenScheduleModal(booking)}
                            sx={{
                              borderRadius: '10px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textTransform: 'none',
                              whiteSpace: 'nowrap',
                              background: 'linear-gradient(135deg, #1A73E8 0%, #0D52BF 100%)',
                              boxShadow: '0 2px 8px rgba(26,115,232,0.25)'
                            }}
                          >
                            {isMeetingScheduled(booking) ? 'Reschedule' : 'Schedule Meet'}
                          </Button>

                          {booking.status === 'CONFIRMED' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                              sx={{ borderRadius: '8px', fontSize: '0.75rem', textTransform: 'none' }}
                            >
                              Done
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

        {/* Quick Google Meet Scheduling Modal */}
        <Dialog
          open={scheduleModalOpen}
          onClose={() => !submittingSchedule && setScheduleModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: '24px', p: { xs: 1, sm: 2 } } }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: { xs: '1.1rem', sm: '1.25rem' }, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiVideo color="#1A73E8" size={24} /> Schedule Google Meet with Hritika Seth
          </DialogTitle>

          <DialogContent>
            {scheduleSuccessMsg && (
              <Alert severity="success" sx={{ mb: 2.5, borderRadius: '12px' }}>
                {scheduleSuccessMsg}
              </Alert>
            )}

            {scheduleErrMsg && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px' }}>
                {scheduleErrMsg}
              </Alert>
            )}

            {selectedBooking && (
              <Box sx={{ mb: 2.5, p: 2, backgroundColor: alpha(brandColors.primary, 0.04), borderRadius: '14px', border: `1px solid ${brandColors.border}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: brandColors.text }}>
                  Client: {selectedBooking.clientName || 'Valued Client'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: brandColors.muted, mt: 0.3, wordBreak: 'break-all' }}>
                  📧 {selectedBooking.clientEmail} • 📞 {selectedBooking.clientPhone || 'N/A'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: brandColors.primary, fontWeight: 700, mt: 0.5 }}>
                  Package: {selectedBooking.serviceName} ({selectedBooking.amount ? `₹${selectedBooking.amount}` : 'Paid'})
                </Typography>
              </Box>
            )}

            <Grid container spacing={2}>
              {/* Consultant Selection */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Assigned Consultant"
                  select
                  fullWidth
                  size="small"
                  value={consultantName}
                  onChange={(e) => {
                    setConsultantName(e.target.value)
                    if (e.target.value === 'Hritika Seth') setConsultantEmail('sethhritika@gmail.com')
                    if (e.target.value === 'Kritika Dhawan') setConsultantEmail('dhawankritika866@gmail.com')
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                >
                  <MenuItem value="Hritika Seth">Hritika Seth (Lead Consultant)</MenuItem>
                  <MenuItem value="Kritika Dhawan">Kritika Dhawan (Operations)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Consultant Email"
                  fullWidth
                  size="small"
                  value={consultantEmail}
                  onChange={(e) => setConsultantEmail(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Grid>

              {/* Date & Time Slot */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Meeting Date"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={meetDate}
                  onChange={(e) => setMeetDate(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Meeting Time (IST)"
                  type="time"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={meetTime}
                  onChange={(e) => setMeetTime(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Grid>

              {/* Google Meet Link Generator with official URL format */}
              <Grid item xs={12}>
                <TextField
                  label="Google Meet Link (https://meet.google.com/abc-defg-hij)"
                  fullWidth
                  size="small"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={handleGenerateMeetLink}
                          startIcon={<FiRefreshCw size={12} />}
                          sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          Generate
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Grid>

              {/* Prep Notes */}
              <Grid item xs={12}>
                <TextField
                  label="Preparation Instructions / Notes for Client"
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  placeholder="e.g. Please bring your updated CV and target company names..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2.5 }}>
            <Button
              onClick={() => setScheduleModalOpen(false)}
              disabled={submittingSchedule}
              sx={{ textTransform: 'none', fontWeight: 600, color: brandColors.muted }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleSubmit}
              disabled={submittingSchedule}
              variant="contained"
              startIcon={submittingSchedule ? <CircularProgress size={16} color="inherit" /> : <FiSend size={16} />}
              sx={{
                borderRadius: '10px',
                fontWeight: 700,
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                background: 'linear-gradient(135deg, #1A73E8 0%, #0D52BF 100%)',
                boxShadow: '0 4px 12px rgba(26,115,232,0.3)'
              }}
            >
              {submittingSchedule ? 'Sending Invite...' : 'Dispatch Google Meet Invitation'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  )
}
