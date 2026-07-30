import { Box, Typography, Paper, Chip, Stack, Button, IconButton, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'
import { brandColors } from '../../theme'

const invoices = [
  { id: 'INV-001', service: 'Professional Plan — LinkedIn Optimization', date: 'Jul 28, 2025', amount: '₹12,999', status: 'Paid' },
  { id: 'INV-002', service: 'Resume Writing Service', date: 'Jun 15, 2025', amount: '₹4,999', status: 'Paid' },
  { id: 'INV-003', service: 'Interview Coaching Session', date: 'May 20, 2025', amount: '₹1,999', status: 'Paid' },
]

export default function MyInvoices() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Invoices</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Download your payment receipts and invoices.</Typography>
        </Box>
        <Stack spacing={2}>
          {invoices.map(inv => (
            <Paper key={inv.id} sx={{ p: 3, borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>{inv.id}</Typography>
                    <Chip label={inv.status} size="small" sx={{ backgroundColor: alpha(brandColors.success, 0.08), color: '#059669', fontWeight: 600, fontSize: '0.7rem' }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.25 }}>{inv.service}</Typography>
                  <Typography variant="caption" sx={{ color: brandColors.muted }}>{inv.date}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" sx={{ color: brandColors.text }}>{inv.amount}</Typography>
                  <IconButton size="small" aria-label="Download invoice" sx={{ border: `1px solid ${brandColors.border}`, borderRadius: '10px', '&:hover': { borderColor: brandColors.primary, color: brandColors.primary } }}>
                    <FiDownload size={16} />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      </motion.div>
    </Box>
  )
}
