import { Box, Typography, Paper, Avatar, Rating, Button, Chip, alpha, Stack } from '@mui/material'
import { motion } from 'framer-motion'
import { FiCheck, FiX } from 'react-icons/fi'
import { brandColors } from '../../theme'

const pending = [
  { id: 1, name: 'Aryan Bose', company: 'Infosys', rating: 5, result: '5x profile views', content: 'BrandIt gave me a completely new perspective on personal branding. My profile now gets daily recruiter views.', avatar: 'AB' },
  { id: 2, name: 'Nidhi Sharma', company: 'Capgemini', rating: 4, result: 'Got promoted in 3 months', content: "After the career coaching sessions, I felt confident enough to push for the promotion I'd been eyeing for a year.", avatar: 'NS' },
]

export default function AdminTestimonials() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Testimonials</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Review and approve client testimonials.</Typography>
        </Box>
        <Typography variant="h6" sx={{ mb: 2, color: brandColors.text }}>Pending Approval ({pending.length})</Typography>
        <Stack spacing={2}>
          {pending.map((t) => (
            <Paper key={t.id} sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 700 }}>{t.avatar}</Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text }}>{t.name}</Typography>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>{t.company}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="contained" startIcon={<FiCheck size={14} />} sx={{ px: 2, py: 0.75 }}>Approve</Button>
                  <Button size="small" variant="outlined" startIcon={<FiX size={14} />} sx={{ px: 2, py: 0.75, borderColor: '#EF4444', color: '#EF4444', '&:hover': { borderColor: '#DC2626', backgroundColor: alpha('#EF4444', 0.04), boxShadow: 'none', transform: 'none' } }}>Reject</Button>
                </Box>
              </Box>
              <Chip label={t.result} size="small" sx={{ mb: 1.5, backgroundColor: alpha(brandColors.success, 0.08), color: '#059669', fontWeight: 600 }} />
              <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.8, mb: 1.5, fontStyle: 'italic' }}>"{t.content}"</Typography>
              <Rating value={t.rating} readOnly size="small" />
            </Paper>
          ))}
        </Stack>
      </motion.div>
    </Box>
  )
}
