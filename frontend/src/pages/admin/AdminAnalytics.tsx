import React from 'react'
import { Box, Typography, Grid, Paper, Chip, Stack, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts'
import { FiTrendingUp, FiTarget, FiZap, FiAward } from 'react-icons/fi'
import { brandColors } from '../../theme'

// Real + Projected growth data
const growthForecastData = [
  { month: 'Q1 (Actual)', organic: 320, projected: 320 },
  { month: 'Q2 (Actual)', organic: 480, projected: 480 },
  { month: 'Q3 (Forecast)', organic: null, projected: 750 },
  { month: 'Q4 (Forecast)', organic: null, projected: 1200 },
]

const serviceBreakdown = [
  { name: 'LinkedIn Opt.', value: 38 },
  { name: 'Resume Writing', value: 27 },
  { name: 'Career Consulting', value: 18 },
  { name: 'Interview Coaching', value: 10 },
  { name: 'AI Resume Optimization', value: 7 },
]

const COLORS = [brandColors.primary, brandColors.success, '#F59E0B', '#EC4899', '#7C3AED']

const futureGrowthCards = [
  {
    title: 'Client Profile Impact',
    metric: '3.8x Growth',
    subtitle: 'Projected increase in interview callbacks for optimized client profiles',
    icon: FiTrendingUp,
    color: '#EFF6FF',
    iconColor: brandColors.primary,
  },
  {
    title: 'Market Expansion Target',
    metric: '+45% YoY',
    subtitle: 'Targeted user growth projection driven by AI career assistant launch',
    icon: FiTarget,
    color: '#F0FDF4',
    iconColor: brandColors.success,
  },
  {
    title: 'Client Placement Rate',
    metric: '92% Goal',
    subtitle: 'Target career transition success rate for Q3/Q4 cohorts',
    icon: FiAward,
    color: '#FFF7ED',
    iconColor: '#F59E0B',
  },
  {
    title: 'Efficiency Uplift',
    metric: '5x Faster',
    subtitle: 'Turnaround time reduction using AI-assisted resume reviewing',
    icon: FiZap,
    color: '#F5F3FF',
    iconColor: '#7C3AED',
  },
]

export default function AdminAnalytics() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Analytics & Future Growth Projections</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted }}>
              Platform performance linked to future growth potential and projected career impact metrics.
            </Typography>
          </Box>
          <Chip label="Forecast Horizon: Q3 - Q4" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
        </Box>

        {/* Future Growth Cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {futureGrowthCards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Paper sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', height: '100%' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '14px', backgroundColor: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <card.icon size={22} color={card.iconColor} />
                </Box>
                <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600, display: 'block', mb: 0.5 }}>
                  {card.title.toUpperCase()}
                </Typography>
                <Typography variant="h4" sx={{ color: brandColors.text, fontWeight: 700, mb: 1 }}>
                  {card.metric}
                </Typography>
                <Typography variant="caption" sx={{ color: brandColors.muted, lineHeight: 1.5, display: 'block' }}>
                  {card.subtitle}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Projected Growth Forecast Chart */}
          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: brandColors.text }}>Projected User Growth Trajectory</Typography>
                <Chip label="Projected +150%" size="small" sx={{ backgroundColor: alpha(brandColors.success, 0.1), color: '#059669', fontWeight: 700 }} />
              </Box>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={growthForecastData}>
                  <defs>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={brandColors.primary} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={brandColors.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={brandColors.border} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: brandColors.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: brandColors.muted }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: any) => [`${v} Users`, 'Volume']} />
                  <Area type="monotone" dataKey="projected" stroke={brandColors.primary} strokeWidth={2.5} strokeDasharray="4 4" fill="url(#colorProjected)" name="Projected Growth" />
                  <Area type="monotone" dataKey="organic" stroke={brandColors.success} strokeWidth={3} fill="none" name="Actual Performance" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Service Share & Expansion Potential */}
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ mb: 3, color: brandColors.text }}>Service Demand & Growth Share</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={serviceBreakdown} cx="50%" cy="38%" outerRadius={68} dataKey="value" label={({ percent }: { percent?: number }) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {serviceBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} />
                  <Legend verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{ fontSize: '0.75rem', paddingTop: '15px' }} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}
