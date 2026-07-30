import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Chip, Stack, CircularProgress, Alert, alpha, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { FiFileText, FiDownload } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface InvoiceItem {
  id: number
  serviceName: string
  preferredDate: string
  amountPaid?: number
  paymentStatus?: string
  status: string
}

export default function MyInvoices() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get<InvoiceItem[]>('/bookings')
        // Filter only paid/confirmed sessions for invoices
        setInvoices(res.data.filter(b => b.amountPaid || b.status === 'CONFIRMED' || b.status === 'COMPLETED'))
      } catch (err: any) {
        setError('Could not load invoices.')
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Invoices</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Download your payment receipts and invoices.</Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>
        ) : invoices.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', textAlign: 'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: alpha(brandColors.primary, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <FiFileText size={28} color={brandColors.primary} />
            </Box>
            <Typography variant="h5" sx={{ mb: 1, color: brandColors.text }}>No Invoices Yet</Typography>
            <Typography variant="body2" sx={{ color: brandColors.muted, mb: 3, maxWidth: 400, mx: 'auto' }}>
              You don't have any payment receipts or invoices generated yet.
            </Typography>
            <Button component={RouterLink} to="/pricing" variant="outlined">
              Explore Our Plans
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {invoices.map(inv => (
              <Paper key={inv.id} sx={{ p: 3, borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>INV-00{inv.id}</Typography>
                      <Chip label="Paid" size="small" sx={{ backgroundColor: alpha(brandColors.success, 0.08), color: '#059669', fontWeight: 600, fontSize: '0.7rem' }} />
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.25 }}>{inv.serviceName}</Typography>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>{inv.preferredDate}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5" sx={{ color: brandColors.text }}>₹{inv.amountPaid || '99'}</Typography>
                    <Button size="small" variant="outlined" startIcon={<FiDownload size={14} />} onClick={() => window.print()} sx={{ borderRadius: '10px' }}>
                      Receipt
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </motion.div>
    </Box>
  )
}
