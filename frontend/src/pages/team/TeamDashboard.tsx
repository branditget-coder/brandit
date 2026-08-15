import { useState, useEffect } from 'react'
import {
  Box, Typography, Grid, Paper, Chip, Button, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, alpha, CircularProgress, Tooltip,
  Card, CardContent, Divider, useTheme, useMediaQuery
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  FiUsers, FiCalendar, FiBookOpen, FiClock, FiCheckCircle,
  FiPhone, FiMail, FiExternalLink, FiFileText, FiShield, FiInbox
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { Link as RouterLink } from 'react-router-dom'

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

const teamRoster = [
  { name: 'Raghav Dhir', role: 'Lead Tech Strategist', phone: '+91 8264452182' },
  { name: 'Hritika Seth', role: 'LinkedIn Manager & Consultant', phone: '+91 8708231539' },
  { name: 'Kritika Dhawan', role: 'Customer Outreach & Ops', phone: '+91 6284318951' },
  { name: 'Stuti Sharma', role: 'Human Resource', phone: '+91 9015470950' },
  { name: 'Yash', role: 'Accounting & Finance', phone: '+91 9024469496' },
]

export default function TeamDashboard() {
  const { user } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)

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

  const handleStatusUpdate = async (id: number, newStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus })
      fetchBookings()
    } catch {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    }
  }

  const stats = [
    { label: 'Assigned Consultations', value: bookings.length.toString(), icon: FiCalendar, color: brandColors.primary, bg: alpha(brandColors.primary, 0.1) },
    { label: 'Pending Calls', value: bookings.filter(b => b.status === 'PENDING').length.toString(), icon: FiClock, color: '#F59E0B', bg: alpha('#F59E0B', 0.1) },
    { label: 'Confirmed Sessions', value: bookings.filter(b => b.status === 'CONFIRMED').length.toString(), icon: FiCheckCircle, color: '#10B981', bg: alpha('#10B981', 0.1) },
    { label: 'Team Online', value: teamRoster.length.toString(), icon: FiUsers, color: '#8B5CF6', bg: alpha('#8B5CF6', 0.1) },
  ]

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Chip label="Confirmed" size="small" sx={{ backgroundColor: alpha('#10B981', 0.1), color: '#10B981', fontWeight: 700 }} />
      case 'COMPLETED':
        return <Chip label="Completed" size="small" sx={{ backgroundColor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 700 }} />
      case 'CANCELLED':
        return <Chip label="Cancelled" size="small" sx={{ backgroundColor: alpha('#EF4444', 0.1), color: '#EF4444', fontWeight: 700 }} />
      default:
        return <Chip label="Pending" size="small" sx={{ backgroundColor: alpha('#F59E0B', 0.1), color: '#D97706', fontWeight: 700 }} />
    }
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        
        {/* Modernized Responsive Welcome Banner */}
        <Paper
          sx={{
            p: { xs: 2.5, sm: 3.5, md: 4.5 },
            borderRadius: { xs: '20px', md: '24px' },
            background: 'linear-gradient(135deg, #0F172A 0%, #1E3E8A 55%, #2563EB 100%)',
            color: '#FFFFFF',
            mb: 3.5,
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Blur Accents */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, position: 'relative', zIndex: 1 }}>
            <Box sx={{ maxWidth: '720px', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  label="BRANDIT TEAM WORKSPACE"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.68rem',
                    letterSpacing: '0.04em',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Internal Operations
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  color: '#FFFFFF !important',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.3rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                Hello, {user?.firstName || 'Team Member'}!
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.92) !important',
                  fontSize: { xs: '0.88rem', sm: '0.98rem' },
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Welcome to your BrandIt Team Workspace. Manage client consultations, team SOPs, and growth operations.
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/team/resources"
              variant="contained"
              startIcon={<FiBookOpen size={17} />}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                backgroundColor: '#FFFFFF',
                color: '#1E3A8A',
                fontWeight: 700,
                borderRadius: '14px',
                px: 3,
                py: 1.2,
                fontSize: '0.9rem',
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              Access Team SOPs
            </Button>
          </Box>
        </Paper>

        {/* Responsive 2x2 Stats Grid on Mobile */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3.5 }}>
          {stats.map((stat, i) => (
            <Grid item xs={6} sm={6} md={3} key={stat.label}>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: '12px', backgroundColor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <stat.icon size={isMobile ? 20 : 24} />
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: brandColors.text, mb: 0.3, fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2rem' } }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted, fontWeight: 600, fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Client Consultations & Playbooks Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <FiCalendar size={20} color={brandColors.primary} />
                  <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    Assigned Consultations
                  </Typography>
                </Box>
                <Button component={RouterLink} to="/team/consultations" size="small" endIcon={<FiExternalLink />}>
                  View All
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <CircularProgress size={32} />
                </Box>
              ) : bookings.length === 0 ? (
                <Box sx={{ py: 5, px: 2, textAlign: 'center', backgroundColor: alpha(brandColors.primary, 0.02), borderRadius: '16px', border: `1px dashed ${brandColors.border}` }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                    <FiInbox size={24} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brandColors.text, mb: 0.5 }}>
                    No Client Consultations Yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted, maxWidth: 440, mx: 'auto', mb: 2, lineHeight: 1.6, fontSize: '0.85rem' }}>
                    As soon as clients schedule personal branding sessions, their details will appear here in real-time.
                  </Typography>
                  <Button component={RouterLink} to="/book" variant="outlined" size="small" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
                    Test Client Booking Link
                  </Button>
                </Box>
              ) : isMobile ? (
                /* Mobile Cards View for Client Consultations */
                <Stack spacing={1.5}>
                  {bookings.map((booking) => (
                    <Card key={booking.id} sx={{ borderRadius: '14px', border: `1px solid ${brandColors.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: brandColors.text }}>
                              {booking.clientName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 700, display: 'block' }}>
                              {booking.servicePackage}
                            </Typography>
                          </Box>
                          {getStatusChip(booking.status)}
                        </Box>

                        <Stack spacing={0.3} sx={{ my: 1 }}>
                          <Typography variant="caption" component="a" href={`tel:${booking.clientPhone}`} sx={{ color: brandColors.text, display: 'flex', alignItems: 'center', gap: 0.6, textDecoration: 'none', fontWeight: 600 }}>
                            <FiPhone size={12} color={brandColors.primary} /> {booking.clientPhone}
                          </Typography>
                          <Typography variant="caption" component="a" href={`mailto:${booking.clientEmail}`} sx={{ color: brandColors.muted, display: 'flex', alignItems: 'center', gap: 0.6, textDecoration: 'none' }}>
                            <FiMail size={12} /> {booking.clientEmail}
                          </Typography>
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>
                            📅 {booking.preferredDate}
                          </Typography>

                          <Stack direction="row" spacing={1}>
                            {booking.status === 'PENDING' && (
                              <Button size="small" variant="contained" color="success" onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')} sx={{ borderRadius: '8px', fontSize: '0.72rem', py: 0.3, px: 1 }}>
                                Confirm
                              </Button>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <Button size="small" variant="outlined" color="primary" onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')} sx={{ borderRadius: '8px', fontSize: '0.72rem', py: 0.3, px: 1 }}>
                                Done
                              </Button>
                            )}
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                /* Desktop Table View */
                <TableContainer>
                  <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Package</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text }}>
                              {booking.clientName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Tooltip title="Call Client">
                                <Typography variant="caption" component="a" href={`tel:${booking.clientPhone}`} sx={{ color: brandColors.primary, display: 'flex', alignItems: 'center', gap: 0.3, textDecoration: 'none' }}>
                                  <FiPhone size={11} /> {booking.clientPhone}
                                </Typography>
                              </Tooltip>
                              <Typography variant="caption" sx={{ color: brandColors.muted }}>•</Typography>
                              <Tooltip title="Email Client">
                                <Typography variant="caption" component="a" href={`mailto:${booking.clientEmail}`} sx={{ color: brandColors.muted, display: 'flex', alignItems: 'center', gap: 0.3, textDecoration: 'none' }}>
                                  <FiMail size={11} /> {booking.clientEmail}
                                </Typography>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{booking.servicePackage}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.text }}>{booking.preferredDate}</Typography>
                          </TableCell>
                          <TableCell>
                            {getStatusChip(booking.status)}
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              {booking.status === 'PENDING' && (
                                <Button size="small" variant="contained" color="success" onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')} sx={{ borderRadius: '8px', fontSize: '0.75rem', textTransform: 'none', py: 0.4, px: 1.2 }}>
                                  Confirm
                                </Button>
                              )}
                              {booking.status === 'CONFIRMED' && (
                                <Button size="small" variant="outlined" color="primary" onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')} sx={{ borderRadius: '8px', fontSize: '0.75rem', textTransform: 'none', py: 0.4, px: 1.2 }}>
                                  Complete
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
          </Grid>

          {/* Quick Tools & Team Directory */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Quick Company SOPs Card */}
              <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                  <FiFileText size={18} color={brandColors.primary} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                    Quick Company Playbooks
                  </Typography>
                </Box>
                <Stack spacing={1.2}>
                  {[
                    { label: 'LinkedIn Optimization Standard (SOP-01)', href: '/team/resources' },
                    { label: 'Client Onboarding Consultation Protocol', href: '/team/resources' },
                    { label: 'Brand Alignment & Strategy Template', href: '/team/resources' },
                  ].map((sop) => (
                    <Button
                      key={sop.label}
                      component={RouterLink}
                      to={sop.href}
                      variant="outlined"
                      fullWidth
                      startIcon={<FiBookOpen size={15} />}
                      sx={{
                        justifyContent: 'flex-start',
                        borderRadius: '12px',
                        py: 0.9,
                        px: 1.8,
                        textTransform: 'none',
                        fontSize: '0.82rem',
                        borderColor: brandColors.border,
                        color: brandColors.text,
                        textAlign: 'left',
                        '&:hover': { borderColor: brandColors.primary, color: brandColors.primary },
                      }}
                    >
                      {sop.label}
                    </Button>
                  ))}
                </Stack>
              </Paper>

              {/* Team Roster Card */}
              <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                  <FiShield size={18} color="#7C3AED" />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                    BrandIt Team Directory
                  </Typography>
                </Box>
                <Stack spacing={1.5}>
                  {teamRoster.map((member) => (
                    <Box key={member.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ minWidth: 0, pr: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text, fontSize: '0.85rem' }}>
                          {member.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', fontSize: '0.72rem' }}>
                          {member.role}
                        </Typography>
                      </Box>
                      <Button
                        component="a"
                        href={`tel:${member.phone.replace(/\s+/g, '')}`}
                        size="small"
                        variant="outlined"
                        startIcon={<FiPhone size={12} />}
                        sx={{ borderRadius: '8px', fontSize: '0.72rem', textTransform: 'none', px: 1.2, py: 0.3 }}
                      >
                        Call
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}
