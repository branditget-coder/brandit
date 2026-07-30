import { Box, Typography, Grid, Paper, Button, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi'
import { brandColors } from '../../theme'

const posts = [
  { id: 1, title: '10 LinkedIn Profile Mistakes That Cost You Job Offers', status: 'Published', date: 'Jan 15, 2025', views: 2840 },
  { id: 2, title: 'The Ultimate ATS Resume Guide: Beat the Bots in 2025', status: 'Published', date: 'Jan 8, 2025', views: 1920 },
  { id: 3, title: 'How to Negotiate Your Salary and Get What You Deserve', status: 'Draft', date: 'Dec 28, 2024', views: 0 },
]

export default function AdminBlog() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Blog</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted }}>Create and manage blog posts.</Typography>
          </Box>
          <Button variant="contained" startIcon={<FiPlus />} sx={{ px: 3 }}>New Post</Button>
        </Box>
        <Paper sx={{ borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', overflow: 'hidden' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 80px', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, backgroundColor: brandColors.background }}>
            {['Title', 'Status', 'Date', 'Views', ''].map(h => (
              <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>{h.toUpperCase()}</Typography>
            ))}
          </Box>
          {posts.map((p, i) => (
            <Box key={p.id} sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 80px', gap: 2, px: 3, py: 2.5, borderBottom: i < posts.length - 1 ? `1px solid ${brandColors.border}` : 'none', alignItems: 'center', '&:hover': { backgroundColor: alpha(brandColors.primary, 0.02) } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{p.title}</Typography>
              <Box sx={{ px: 1.5, py: 0.5, borderRadius: '100px', backgroundColor: p.status === 'Published' ? alpha(brandColors.success, 0.1) : alpha(brandColors.muted, 0.1), display: 'inline-flex', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: p.status === 'Published' ? '#059669' : brandColors.muted, fontWeight: 700 }}>{p.status}</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: brandColors.muted }}>{p.date}</Typography>
              <Typography variant="body2" sx={{ color: brandColors.text, fontWeight: 600 }}>{p.views.toLocaleString()}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Box sx={{ p: 0.75, borderRadius: '8px', cursor: 'pointer', '&:hover': { backgroundColor: alpha(brandColors.primary, 0.08) } }}><FiEdit3 size={16} color={brandColors.muted} /></Box>
                <Box sx={{ p: 0.75, borderRadius: '8px', cursor: 'pointer', '&:hover': { backgroundColor: alpha('#EF4444', 0.08) } }}><FiTrash2 size={16} color={brandColors.muted} /></Box>
              </Box>
            </Box>
          ))}
        </Paper>
      </motion.div>
    </Box>
  )
}
