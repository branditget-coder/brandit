import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Avatar, Rating, Button, Chip, alpha, Stack, CircularProgress, Alert } from '@mui/material'
import { motion } from 'framer-motion'
import { FiCheck, FiX } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface TestimonialItem {
  id: number
  clientName: string
  clientRole?: string
  clientCompany?: string
  rating: number
  result?: string
  content: string
}

export default function AdminTestimonials() {
  const [pending, setPending] = useState<TestimonialItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const fetchPending = async () => {
    try {
      const res = await api.get<TestimonialItem[]>('/admin/testimonials/pending')
      setPending(res.data)
    } catch (err: any) {
      setError('Failed to fetch pending testimonials.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const handleApprove = async (id: number) => {
    try {
      await api.patch(`/admin/testimonials/${id}/approve`)
      fetchPending()
    } catch (err) {
      alert('Failed to approve testimonial.')
    }
  }

  const handleReject = async (id: number) => {
    try {
      await api.delete(`/admin/testimonials/${id}`)
      fetchPending()
    } catch (err) {
      alert('Failed to reject testimonial.')
    }
  }

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Testimonials</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Review and approve client testimonials.</Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: brandColors.text }}>Pending Approval ({pending.length})</Typography>

            {pending.length === 0 ? (
              <Paper sx={{ p: 4, borderRadius: '20px', border: `1px solid ${brandColors.border}`, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: brandColors.muted }}>No pending testimonials to review.</Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {pending.map((t) => {
                  const avatar = `${t.clientName?.[0] || 'U'}`.toUpperCase()
                  return (
                    <Paper key={t.id} sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 700 }}>{avatar}</Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text }}>{t.clientName}</Typography>
                            <Typography variant="caption" sx={{ color: brandColors.muted }}>{t.clientCompany || t.clientRole || 'Client'}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" onClick={() => handleApprove(t.id)} startIcon={<FiCheck size={14} />} sx={{ px: 2, py: 0.75 }}>Approve</Button>
                          <Button size="small" variant="outlined" onClick={() => handleReject(t.id)} startIcon={<FiX size={14} />} sx={{ px: 2, py: 0.75, borderColor: '#EF4444', color: '#EF4444', '&:hover': { borderColor: '#DC2626', backgroundColor: alpha('#EF4444', 0.04), boxShadow: 'none', transform: 'none' } }}>Reject</Button>
                        </Box>
                      </Box>
                      {t.result && <Chip label={t.result} size="small" sx={{ mb: 1.5, backgroundColor: alpha(brandColors.success, 0.08), color: '#059669', fontWeight: 600 }} />}
                      <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.8, mb: 1.5, fontStyle: 'italic' }}>"{t.content}"</Typography>
                      <Rating value={t.rating} readOnly size="small" />
                    </Paper>
                  )
                })}
              </Stack>
            )}
          </>
        )}
      </motion.div>
    </Box>
  )
}
