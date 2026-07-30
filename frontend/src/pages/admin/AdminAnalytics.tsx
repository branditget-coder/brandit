import { Box, Typography, Grid, Paper, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { brandColors } from '../../theme'

const trafficData = [
  { week: 'W1', organic: 320, direct: 180, referral: 95 },
  { week: 'W2', organic: 380, direct: 210, referral: 112 },
  { week: 'W3', organic: 420, direct: 195, referral: 140 },
  { week: 'W4', organic: 510, direct: 240, referral: 165 },
]

const serviceBreakdown = [
  { name: 'LinkedIn Opt.', value: 38 },
  { name: 'Resume Writing', value: 27 },
  { name: 'Career Consulting', value: 18 },
  { name: 'Interview Coaching', value: 10 },
  { name: 'Other', value: 7 },
]

const COLORS = [brandColors.primary, brandColors.success, '#F59E0B', '#EC4899', '#7C3AED']

export default function AdminAnalytics() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Analytics</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Platform traffic and service performance insights.</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ mb: 3, color: brandColors.text }}>Weekly Traffic</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={brandColors.border} />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: brandColors.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: brandColors.muted }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="organic" stroke={brandColors.primary} strokeWidth={2} dot={{ r: 4 }} name="Organic" />
                  <Line type="monotone" dataKey="direct" stroke={brandColors.success} strokeWidth={2} dot={{ r: 4 }} name="Direct" />
                  <Line type="monotone" dataKey="referral" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} name="Referral" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ mb: 3, color: brandColors.text }}>Service Breakdown</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={serviceBreakdown} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ percent }: { percent?: number }) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {serviceBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}
