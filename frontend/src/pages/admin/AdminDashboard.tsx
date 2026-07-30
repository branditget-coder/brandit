import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Paper, alpha, CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface AnalyticsData {
  totalUsers: number
  totalBookings: number
  totalRevenue: number
  satisfactionRate: number
}

const revenueData = [
  { month: 'Feb', revenue: 45000 }, { month: 'Mar', revenue: 62000 }, { month: 'Apr', revenue: 58000 },
  { month: 'May', revenue: 78000 }, { month: 'Jun', revenue: 95000 }, { month: 'Jul', revenue: 112000 },
]

const bookingData = [
  { month: 'Feb', bookings: 12 }, { month: 'Mar', bookings: 18 }, { month: 'Apr', bookings: 15 },
  { month: 'May', bookings: 22 }, { month: 'Jun', bookings: 28 }, { month: 'Jul', bookings: 35 },
]

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get<AnalyticsData>('/admin/analytics')
        setData(res.data)
      } catch (err) {
        // Fallback default
        setData({ totalUsers: 0, totalBookings: 0, totalRevenue: 0, satisfactionRate: 98.0 })
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const kpis = [
    { label: 'Registered Users', value: data ? String(data.totalUsers) : '1', change: 'Live Active', icon: FiUsers, color: '#EFF6FF', iconColor: brandColors.primary },
    { label: 'Total Bookings', value: data ? String(data.totalBookings) : '0', change: 'Goal: 50/mo', icon: FiCalendar, color: '#F0FDF4', iconColor: brandColors.success },
    { label: 'Projected Monthly Revenue', value: '₹1.8L Target', change: '+24% Forecast', icon: FiDollarSign, color: '#FFF7ED', iconColor: '#F59E0B' },
    { label: 'Satisfaction Goal', value: '98.5%', change: 'Target Benchmark', icon: FiTrendingUp, color: '#F5F3FF', iconColor: '#7C3AED' },
  ]

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Admin Dashboard</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted }}>Real-time platform activity and future growth projections.</Typography>
          </Box>
          <Box sx={{ px: 2, py: 0.75, borderRadius: '100px', backgroundColor: alpha(brandColors.primary, 0.08), border: `1px solid ${alpha(brandColors.primary, 0.2)}` }}>
            <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 700 }}>🚀 Growth Target Mode: Active</Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            {/* KPIs */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              {kpis.map((k) => (
                <Grid item xs={6} lg={3} key={k.label}>
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <Paper sx={{ p: 3, borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: '14px', backgroundColor: k.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <k.icon size={20} color={k.iconColor} />
                        </Box>
                        <Box sx={{ px: 1.5, py: 0.5, borderRadius: '100px', backgroundColor: alpha(brandColors.primary, 0.08), alignSelf: 'flex-start' }}>
                          <Typography variant="caption" sx={{ color: brandColors.primary, fontWeight: 700 }}>{k.change}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="h3" sx={{ color: brandColors.text, mb: 0.25 }}>{k.value}</Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>{k.label}</Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              {/* Projected Revenue Growth Chart */}
              <Grid item xs={12} lg={7}>
                <Paper sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: brandColors.text }}>Projected Revenue Trajectory</Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>Forecasted platform revenue trajectory based on growth targets</Typography>
                    </Box>
                    <Box sx={{ px: 1.5, py: 0.5, borderRadius: '100px', backgroundColor: alpha(brandColors.success, 0.1) }}>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>Future Forecast</Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={brandColors.primary} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={brandColors.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={brandColors.border} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: brandColors.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: brandColors.muted }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Projected Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke={brandColors.primary} strokeWidth={2.5} strokeDasharray="4 4" fill="url(#colorRevenue)" dot={{ fill: brandColors.primary, r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Projected Monthly Bookings Chart */}
              <Grid item xs={12} lg={5}>
                <Paper sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: brandColors.text }}>Projected Session Volume</Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>Forecasted consultation bookings per month</Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={bookingData} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke={brandColors.border} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: brandColors.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: brandColors.muted }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v: any) => [`${v} Sessions`, 'Projected Target']} />
                      <Bar dataKey="bookings" fill={brandColors.primary} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </motion.div>
    </Box>
  )
}
