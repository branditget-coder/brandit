import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Avatar, Chip, alpha, TextField, InputAdornment, CircularProgress, Alert } from '@mui/material'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import { brandColors } from '../../theme'
import api from '../../services/api'

interface UserItem {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  emailVerified: boolean
  createdAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get<UserItem[]>('/admin/users')
        setUsers(res.data)
      } catch (err: any) {
        setError('Failed to fetch users list.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Users ({users.length})</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted }}>Manage all registered users on BrandIt.</Typography>
          </Box>
          <TextField
            placeholder="Search users..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><FiSearch size={16} color={brandColors.muted} /></InputAdornment> }}
            sx={{ width: 280, '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>
        ) : (
          <Paper sx={{ borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, backgroundColor: brandColors.background }}>
              {['User', 'Email', 'Role', 'Joined', 'Status'].map(h => (
                <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>{h.toUpperCase()}</Typography>
              ))}
            </Box>
            {/* Rows */}
            {filteredUsers.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: brandColors.muted }}>No users found.</Typography>
              </Box>
            ) : (
              filteredUsers.map((u, i) => {
                const initials = `${u.firstName?.[0] || 'U'}${u.lastName?.[0] || ''}`.toUpperCase()
                const formattedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
                return (
                  <Box key={u.id} sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: 2, px: 3, py: 2.5, borderBottom: i < filteredUsers.length - 1 ? `1px solid ${brandColors.border}` : 'none', alignItems: 'center', '&:hover': { backgroundColor: alpha(brandColors.primary, 0.02) }, transition: 'background-color 0.15s' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontSize: '0.8rem', fontWeight: 700 }}>{initials}</Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{u.firstName} {u.lastName}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: brandColors.muted }}>{u.email}</Typography>
                    <Chip label={u.role} size="small" sx={{ backgroundColor: alpha(u.role === 'ADMIN' ? '#7C3AED' : brandColors.primary, 0.1), color: u.role === 'ADMIN' ? '#7C3AED' : brandColors.primary, fontWeight: 600, fontSize: '0.72rem' }} />
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>{formattedDate}</Typography>
                    <Chip label={u.emailVerified ? 'Verified' : 'Active'} size="small" sx={{ backgroundColor: alpha(brandColors.success, 0.1), color: '#059669', fontWeight: 600, fontSize: '0.72rem' }} />
                  </Box>
                )
              })
            )}
          </Paper>
        )}
      </motion.div>
    </Box>
  )
}
