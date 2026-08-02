import React, { useEffect, useState, useCallback } from 'react'
import { Box, Typography, Paper, Chip, Stack, CircularProgress, alpha, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { FiFileText, FiDownload, FiRefreshCw } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface InvoiceItem {
  id: number
  serviceName: string
  bookingDate?: string
  preferredDate?: string
  amount?: number
  amountPaid?: number
  paymentStatus?: string
  status: string
}

export default function MyInvoices() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await api.get<InvoiceItem[]>('/bookings')
      const data = Array.isArray(res.data) ? res.data : []
      // Filter paid/confirmed sessions for invoices
      setInvoices(data.filter(b => b.amount || b.amountPaid || b.status === 'CONFIRMED' || b.status === 'COMPLETED'))
    } catch (err: any) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

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
        ) : error || invoices.length === 0 ? (
          <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <Box sx={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: alpha(brandColors.primary, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5, color: brandColors.primary }}>
              <FiFileText size={32} />
            </Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: brandColors.text }}>No Invoices Yet</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, mb: 3.5, maxWidth: 460, mx: 'auto', lineHeight: 1.6 }}>
              You don't have any payment receipts or invoices generated yet. Your invoices will automatically appear here once you schedule a session!
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button component={RouterLink} to="/pricing" variant="contained" sx={{ px: 4, py: 1.3, borderRadius: '12px', fontWeight: 700 }}>
                Explore Packages
              </Button>
              {error && (
                <Button onClick={fetchInvoices} variant="outlined" startIcon={<FiRefreshCw />} sx={{ px: 3, py: 1.3, borderRadius: '12px' }}>
                  Refresh
                </Button>
              )}
            </Stack>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {invoices.map(inv => {
              const displayDate = inv.bookingDate || inv.preferredDate || 'Confirmed'
              const displayAmount = inv.amount || inv.amountPaid || 1499
              return (
                <Paper key={inv.id} sx={{ p: 3, borderRadius: '18px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 600 }}>INV-00{inv.id}</Typography>
                        <Chip label="Paid" size="small" sx={{ backgroundColor: alpha(brandColors.success, 0.08), color: '#059669', fontWeight: 600, fontSize: '0.7rem' }} />
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: brandColors.text, mb: 0.25 }}>{inv.serviceName}</Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>{displayDate}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h5" sx={{ color: brandColors.text }}>₹{displayAmount.toLocaleString()}</Typography>
                      <Button size="small" variant="outlined" startIcon={<FiDownload size={14} />} onClick={() => window.print()} sx={{ borderRadius: '10px' }}>
                        Receipt
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              )
            })}
          </Stack>
        )}
      </motion.div>
    </Box>
  )
}
