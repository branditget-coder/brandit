import { Box, Typography, Paper, Avatar, Chip, alpha, TextField, InputAdornment, Stack, IconButton } from '@mui/material'
import { motion } from 'framer-motion'
import { FiSearch, FiMoreVertical } from 'react-icons/fi'
import { brandColors } from '../../theme'

const users = [
  { id: 1, name: 'Priya Sharma', email: 'priya@email.com', plan: 'Professional', joined: 'Jul 15, 2025', status: 'Active', avatar: 'PS' },
  { id: 2, name: 'Rahul Mehta', email: 'rahul@email.com', plan: 'Starter', joined: 'Jul 10, 2025', status: 'Active', avatar: 'RM' },
  { id: 3, name: 'Ananya Krishnan', email: 'ananya@email.com', plan: 'Executive', joined: 'Jun 28, 2025', status: 'Active', avatar: 'AK' },
  { id: 4, name: 'Vikram Singh', email: 'vikram@email.com', plan: 'Professional', joined: 'Jun 15, 2025', status: 'Inactive', avatar: 'VS' },
  { id: 5, name: 'Meera Nair', email: 'meera@email.com', plan: 'Starter', joined: 'May 30, 2025', status: 'Active', avatar: 'MN' },
]

const planColor: Record<string, string> = {
  Starter: '#6B7280',
  Professional: brandColors.primary,
  Executive: '#7C3AED',
}

export default function AdminUsers() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Users</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted }}>Manage all registered users.</Typography>
          </Box>
          <TextField
            placeholder="Search users..."
            size="small"
            InputProps={{ startAdornment: <InputAdornment position="start"><FiSearch size={16} color={brandColors.muted} /></InputAdornment> }}
            sx={{ width: 280, '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
          />
        </Box>

        <Paper sx={{ borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 40px', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, backgroundColor: brandColors.background }}>
            {['User', 'Email', 'Plan', 'Joined', 'Status', ''].map(h => (
              <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>{h.toUpperCase()}</Typography>
            ))}
          </Box>
          {/* Rows */}
          {users.map((user, i) => (
            <Box key={user.id} sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 40px', gap: 2, px: 3, py: 2.5, borderBottom: i < users.length - 1 ? `1px solid ${brandColors.border}` : 'none', alignItems: 'center', '&:hover': { backgroundColor: alpha(brandColors.primary, 0.02) }, transition: 'background-color 0.15s' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontSize: '0.8rem', fontWeight: 700 }}>{user.avatar}</Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{user.name}</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: brandColors.muted }}>{user.email}</Typography>
              <Chip label={user.plan} size="small" sx={{ backgroundColor: alpha(planColor[user.plan] || brandColors.muted, 0.1), color: planColor[user.plan], fontWeight: 600, fontSize: '0.72rem' }} />
              <Typography variant="caption" sx={{ color: brandColors.muted }}>{user.joined}</Typography>
              <Chip label={user.status} size="small" sx={{ backgroundColor: user.status === 'Active' ? alpha(brandColors.success, 0.1) : alpha(brandColors.muted, 0.1), color: user.status === 'Active' ? '#059669' : brandColors.muted, fontWeight: 600, fontSize: '0.72rem' }} />
              <IconButton size="small" aria-label="User options"><FiMoreVertical size={16} color={brandColors.muted} /></IconButton>
            </Box>
          ))}
        </Paper>
      </motion.div>
    </Box>
  )
}
