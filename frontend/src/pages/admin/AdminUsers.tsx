import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Paper, Avatar, Chip, alpha, TextField, InputAdornment,
  CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel,
  Alert, Snackbar, Tooltip, Stack
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  FiSearch, FiUserCheck, FiUsers, FiUserPlus, FiEdit2, FiTrash2,
  FiShield, FiAlertTriangle, FiX, FiKey, FiBriefcase, FiLayers
} from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

interface UserItem {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  emailVerified: boolean
  birthDay?: number
  birthMonth?: number
  birthYear?: number
  dateOfBirth?: string
  createdAt: string
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [activeRoleTab, setActiveRoleTab] = useState<'ALL' | 'ADMIN' | 'TEAM' | 'USER'>('ALL')

  // Modals state
  const [createOpen, setCreateOpen] = useState<boolean>(false)
  const [editUser, setEditUser] = useState<UserItem | null>(null)
  const [passwordUser, setPasswordUser] = useState<UserItem | null>(null)
  const [deleteUser, setDeleteUser] = useState<UserItem | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [newPasswordVal, setNewPasswordVal] = useState<string>('')

  // Toast notification
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  // Create form state
  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER',
    emailVerified: true,
    birthDay: '',
    birthMonth: '',
    birthYear: '',
  })

  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'USER',
    emailVerified: true,
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    password: '',
  })

  const fetchUsers = async () => {
    try {
      const res = await api.get<UserItem[]>('/admin/users')
      if (res.data && res.data.length > 0) {
        setUsers(res.data)
      } else if (currentUser) {
        setUsers([{
          id: currentUser.id || 1,
          firstName: currentUser.firstName || 'Admin',
          lastName: currentUser.lastName || 'User',
          email: currentUser.email || 'admin@brandit.com',
          phone: currentUser.phone,
          role: currentUser.role || 'ADMIN',
          emailVerified: true,
          birthDay: currentUser.birthDay,
          birthMonth: currentUser.birthMonth,
          birthYear: currentUser.birthYear,
          dateOfBirth: currentUser.dateOfBirth,
          createdAt: new Date().toISOString(),
        }])
      }
    } catch (err: any) {
      if (currentUser) {
        setUsers([{
          id: currentUser.id || 1,
          firstName: currentUser.firstName || 'Admin',
          lastName: currentUser.lastName || 'User',
          email: currentUser.email || 'admin@brandit.com',
          phone: currentUser.phone,
          role: currentUser.role || 'ADMIN',
          emailVerified: true,
          birthDay: currentUser.birthDay,
          birthMonth: currentUser.birthMonth,
          birthYear: currentUser.birthYear,
          dateOfBirth: currentUser.dateOfBirth,
          createdAt: new Date().toISOString(),
        }])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentUser])

  const handleOpenEdit = (u: UserItem) => {
    setEditUser(u)
    setEditForm({
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role || 'USER',
      emailVerified: u.emailVerified ?? true,
      birthDay: u.birthDay ? String(u.birthDay) : '',
      birthMonth: u.birthMonth ? String(u.birthMonth) : '',
      birthYear: u.birthYear ? String(u.birthYear) : '',
      password: '',
    })
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.firstName || !createForm.email || !createForm.password) {
      setSnackbar({ open: true, message: 'Please fill in all required fields.', severity: 'error' })
      return
    }
    setSubmitting(true)
    try {
      await api.post('/admin/users', {
        ...createForm,
        birthDay: createForm.birthDay ? parseInt(createForm.birthDay, 10) : null,
        birthMonth: createForm.birthMonth ? parseInt(createForm.birthMonth, 10) : null,
        birthYear: createForm.birthYear ? parseInt(createForm.birthYear, 10) : null,
      })
      setSnackbar({ open: true, message: 'User created successfully!', severity: 'success' })
      setCreateOpen(false)
      setCreateForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: 'USER',
        emailVerified: true,
        birthDay: '',
        birthMonth: '',
        birthYear: '',
      })
      await fetchUsers()
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create user.'
      setSnackbar({ open: true, message: msg, severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUser) return
    setSubmitting(true)
    try {
      await api.put(`/admin/users/${editUser.id}`, {
        ...editForm,
        birthDay: editForm.birthDay ? parseInt(editForm.birthDay, 10) : null,
        birthMonth: editForm.birthMonth ? parseInt(editForm.birthMonth, 10) : null,
        birthYear: editForm.birthYear ? parseInt(editForm.birthYear, 10) : null,
      })
      setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' })
      setEditUser(null)
      await fetchUsers()
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update user.'
      setSnackbar({ open: true, message: msg, severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordUser || !newPasswordVal || newPasswordVal.length < 6) {
      setSnackbar({ open: true, message: 'Password must be at least 6 characters long.', severity: 'error' })
      return
    }
    setSubmitting(true)
    try {
      await api.post(`/admin/users/${passwordUser.id}/password`, { newPassword: newPasswordVal })
      setSnackbar({ open: true, message: `Password for ${passwordUser.firstName} reset successfully!`, severity: 'success' })
      setPasswordUser(null)
      setNewPasswordVal('')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to reset password.'
      setSnackbar({ open: true, message: msg, severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return
    setSubmitting(true)
    try {
      await api.delete(`/admin/users/${deleteUser.id}`)
      setSnackbar({ open: true, message: `User "${deleteUser.firstName} ${deleteUser.lastName}" deleted successfully.`, severity: 'success' })
      setDeleteUser(null)
      await fetchUsers()
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete user.'
      setSnackbar({ open: true, message: msg, severity: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase())
  )

  const renderUserTable = (userList: UserItem[], emptyMessage: string, roleAccentColor: string) => {
    return (
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 800 }}>
          {/* Header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 1.2fr 1.2fr 1fr 1.2fr', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, backgroundColor: alpha(roleAccentColor, 0.04), borderRadius: '12px' }}>
            {['User', 'Email', 'Role & DOB', 'Joined', 'Status', 'Actions'].map(h => (
              <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>{h.toUpperCase()}</Typography>
            ))}
          </Box>

          {/* Rows */}
          {userList.length === 0 ? (
            <Box sx={{ p: 5, textAlign: 'center' }}>
              <FiUsers size={32} color={brandColors.muted} style={{ marginBottom: 12 }} />
              <Typography variant="h6" sx={{ color: brandColors.text, mb: 0.5 }}>{emptyMessage}</Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted }}>Try refining your search terms.</Typography>
            </Box>
          ) : (
            userList.map((u, i) => {
              const initials = `${u.firstName?.[0] || 'U'}${u.lastName?.[0] || ''}`.toUpperCase()
              const formattedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
              const isCurrentSession = currentUser?.email?.toLowerCase() === u.email?.toLowerCase()

              return (
                <Box key={u.id} sx={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 1.2fr 1.2fr 1fr 1.2fr', gap: 2, px: 3, py: 2.5, borderBottom: i < userList.length - 1 ? `1px solid ${brandColors.border}` : 'none', alignItems: 'center', '&:hover': { backgroundColor: alpha(roleAccentColor, 0.03) }, transition: 'background-color 0.15s' }}>
                  {/* User Avatar & Name */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(roleAccentColor, 0.12), color: roleAccentColor, fontSize: '0.8rem', fontWeight: 700 }}>
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{u.firstName} {u.lastName}</Typography>
                      {isCurrentSession && (
                        <Chip label="Active Session" size="small" icon={<FiUserCheck size={12} />} sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, backgroundColor: alpha(brandColors.primary, 0.1), color: brandColors.primary, border: 'none', mt: 0.3 }} />
                      )}
                    </Box>
                  </Box>

                  {/* Email */}
                  <Typography variant="body2" sx={{ color: brandColors.muted, overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</Typography>

                  {/* Role Chip & DOB */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                    <Chip
                      label={u.role}
                      size="small"
                      icon={u.role === 'ADMIN' ? <FiShield size={12} /> : undefined}
                      sx={{
                        backgroundColor: alpha(u.role === 'ADMIN' ? '#7C3AED' : u.role === 'TEAM' ? '#0284C7' : brandColors.primary, 0.1),
                        color: u.role === 'ADMIN' ? '#7C3AED' : u.role === 'TEAM' ? '#0284C7' : brandColors.primary,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        width: 'fit-content'
                      }}
                    />
                    {(u.dateOfBirth || (u.birthDay && u.birthMonth && u.birthYear)) && (
                      <Typography variant="caption" sx={{ color: brandColors.muted, fontSize: '0.7rem' }}>
                        DOB: {u.dateOfBirth || `${u.birthDay}/${u.birthMonth}/${u.birthYear}`}
                      </Typography>
                    )}
                  </Box>

                  {/* Joined Date */}
                  <Typography variant="caption" sx={{ color: brandColors.muted }}>{formattedDate}</Typography>

                  {/* Status Chip */}
                  <Chip
                    label={u.emailVerified ? 'Verified' : 'Active'}
                    size="small"
                    sx={{ backgroundColor: alpha(brandColors.success, 0.1), color: '#059669', fontWeight: 600, fontSize: '0.72rem', width: 'fit-content' }}
                  />

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <Tooltip title="Edit User Details">
                      <IconButton size="small" onClick={() => handleOpenEdit(u)} sx={{ color: brandColors.muted, '&:hover': { color: brandColors.primary } }}>
                        <FiEdit2 size={15} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Reset Password">
                      <IconButton size="small" onClick={() => { setPasswordUser(u); setNewPasswordVal('') }} sx={{ color: brandColors.muted, '&:hover': { color: '#F59E0B' } }}>
                        <FiKey size={15} />
                      </IconButton>
                    </Tooltip>

                    {isCurrentSession ? (
                      <Tooltip title="You cannot delete your own active session account">
                        <span>
                          <IconButton size="small" disabled sx={{ opacity: 0.3 }}>
                            <FiTrash2 size={15} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Delete User Account">
                        <IconButton size="small" onClick={() => setDeleteUser(u)} sx={{ color: brandColors.muted, '&:hover': { color: '#EF4444' } }}>
                          <FiTrash2 size={15} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              )
            })
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Registered Users ({users.length})</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted }}>Manage all accounts, administrative privileges, and registered clients on BrandIt.</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search users or roles..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><FiSearch size={16} color={brandColors.muted} /></InputAdornment> }}
              sx={{ width: 260, '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '10px' } }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<FiUserPlus size={18} />}
              onClick={() => setCreateOpen(true)}
              sx={{ borderRadius: '10px', textTransform: 'none', px: 3, fontWeight: 700 }}
            >
              Add New User
            </Button>
          </Box>
        </Box>

        {/* Role Category Filter Tabs */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3.5, flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Roles', count: filteredUsers.length, icon: FiLayers, color: brandColors.primary },
            { id: 'ADMIN', label: 'Admin (Admin)', count: filteredUsers.filter(u => u.role === 'ADMIN').length, icon: FiShield, color: '#7C3AED' },
            { id: 'TEAM', label: 'Team (Team + Admin)', count: filteredUsers.filter(u => u.role === 'TEAM' || u.role === 'ADMIN').length, icon: FiBriefcase, color: '#0284C7' },
            { id: 'USER', label: 'Users (Client Users)', count: filteredUsers.filter(u => u.role === 'USER').length, icon: FiUserCheck, color: brandColors.success },
          ].map(tab => {
            const isActive = (activeRoleTab || 'ALL') === tab.id
            return (
              <Chip
                key={tab.id}
                icon={<tab.icon size={14} color={isActive ? '#fff' : tab.color} />}
                label={`${tab.label} (${tab.count})`}
                clickable
                onClick={() => setActiveRoleTab(tab.id as any)}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  py: 2.2,
                  px: 1.2,
                  borderRadius: '10px',
                  backgroundColor: isActive ? tab.color : alpha(tab.color, 0.08),
                  color: isActive ? '#fff' : tab.color,
                  border: `1px solid ${isActive ? tab.color : alpha(tab.color, 0.2)}`,
                  '&:hover': {
                    backgroundColor: isActive ? tab.color : alpha(tab.color, 0.15),
                  }
                }}
              />
            )
          })}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Stack spacing={3.5}>
            {/* 1. ADMIN CARD */}
            {((activeRoleTab || 'ALL') === 'ALL' || activeRoleTab === 'ADMIN') && (
              <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: '20px', border: `1px solid ${alpha('#7C3AED', 0.25)}`, boxShadow: '0 4px 20px rgba(124, 58, 237, 0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: alpha('#7C3AED', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiShield size={20} color="#7C3AED" />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text }}>
                        Admin: Platform Administrators
                      </Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>
                        Super-users with elevated administrative controls, system management, and financial overview access.
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label={`${filteredUsers.filter(u => u.role === 'ADMIN').length} Admins`} sx={{ backgroundColor: alpha('#7C3AED', 0.1), color: '#7C3AED', fontWeight: 800, fontSize: '0.75rem' }} />
                </Box>

                {renderUserTable(
                  filteredUsers.filter(u => u.role === 'ADMIN'),
                  'No administrator accounts match your search.',
                  '#7C3AED'
                )}
              </Paper>
            )}

            {/* 2. TEAM CARD (Team + Admin) */}
            {((activeRoleTab || 'ALL') === 'ALL' || activeRoleTab === 'TEAM') && (
              <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: '20px', border: `1px solid ${alpha('#0284C7', 0.25)}`, boxShadow: '0 4px 20px rgba(2, 132, 199, 0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: alpha('#0284C7', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiBriefcase size={20} color="#0284C7" />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text }}>
                        Team: BrandIt Staff & Team (Team + Admin)
                      </Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>
                        Official internal team members and administrators responsible for consultation sessions and operations.
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label={`${filteredUsers.filter(u => u.role === 'TEAM' || u.role === 'ADMIN').length} Team & Staff`} sx={{ backgroundColor: alpha('#0284C7', 0.1), color: '#0284C7', fontWeight: 800, fontSize: '0.75rem' }} />
                </Box>

                {renderUserTable(
                  filteredUsers.filter(u => u.role === 'TEAM' || u.role === 'ADMIN'),
                  'No team or staff members match your search.',
                  '#0284C7'
                )}
              </Paper>
            )}

            {/* 3. USERS CARD (Client Users) */}
            {((activeRoleTab || 'ALL') === 'ALL' || activeRoleTab === 'USER') && (
              <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: '20px', border: `1px solid ${alpha(brandColors.primary, 0.25)}`, boxShadow: '0 4px 20px rgba(37, 99, 235, 0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: alpha(brandColors.primary, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiUserCheck size={20} color={brandColors.primary} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: brandColors.text }}>
                        Users: Registered Clients & Customers (User)
                      </Typography>
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>
                        Standard clients registered on BrandIt for personal branding, consulting, and growth packages.
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label={`${filteredUsers.filter(u => u.role === 'USER').length} Clients`} sx={{ backgroundColor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontWeight: 800, fontSize: '0.75rem' }} />
                </Box>

                {renderUserTable(
                  filteredUsers.filter(u => u.role === 'USER'),
                  'No client user accounts match your search.',
                  brandColors.primary
                )}
              </Paper>
            )}
          </Stack>
        )}
      </motion.div>

      {/* CREATE USER DIALOG */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Register New User Account</Typography>
          <IconButton onClick={() => setCreateOpen(false)} size="small"><FiX /></IconButton>
        </DialogTitle>
        <form onSubmit={handleCreateSubmit}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                fullWidth
                required
                value={createForm.firstName}
                onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
              />
              <TextField
                label="Last Name"
                fullWidth
                value={createForm.lastName}
                onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
              />
            </Box>

            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            />

            <TextField
              label="Initial Password"
              type="password"
              fullWidth
              required
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            />

            <TextField
              label="Phone Number"
              fullWidth
              value={createForm.phone}
              onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
            />

            {/* Birth Date Selectors */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.muted, mb: 0.5, display: 'block' }}>
                DATE OF BIRTH (OPTIONAL FOR ADMIN CREATION)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel id="create-dob-day-label">Day</InputLabel>
                  <Select
                    labelId="create-dob-day-label"
                    label="Day"
                    value={createForm.birthDay}
                    onChange={(e) => setCreateForm({ ...createForm, birthDay: e.target.value })}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <MenuItem key={d} value={String(d)}>{String(d).padStart(2, '0')}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: 1.5 }}>
                  <InputLabel id="create-dob-month-label">Month</InputLabel>
                  <Select
                    labelId="create-dob-month-label"
                    label="Month"
                    value={createForm.birthMonth}
                    onChange={(e) => setCreateForm({ ...createForm, birthMonth: e.target.value })}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                      <MenuItem key={idx + 1} value={String(idx + 1)}>{m}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: 1.2 }}>
                  <InputLabel id="create-dob-year-label">Year</InputLabel>
                  <Select
                    labelId="create-dob-year-label"
                    label="Year"
                    value={createForm.birthYear}
                    onChange={(e) => setCreateForm({ ...createForm, birthYear: e.target.value })}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {Array.from({ length: 80 }, (_, i) => 2026 - i).map((y) => (
                      <MenuItem key={y} value={String(y)}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <FormControl fullWidth>
              <InputLabel id="create-role-label">Role</InputLabel>
              <Select
                labelId="create-role-label"
                label="Role"
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
              >
                <MenuItem value="USER">USER (Standard Client)</MenuItem>
                <MenuItem value="TEAM">TEAM (Team Member)</MenuItem>
                <MenuItem value="ADMIN">ADMIN (Administrator)</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={createForm.emailVerified}
                  onChange={(e) => setCreateForm({ ...createForm, emailVerified: e.target.checked })}
                  color="primary"
                />
              }
              label="Mark Email as Verified"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setCreateOpen(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting} startIcon={submitting ? <CircularProgress size={16} /> : undefined}>
              {submitting ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* EDIT USER DIALOG */}
      <Dialog open={Boolean(editUser)} onClose={() => setEditUser(null)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Edit User Details & Role</Typography>
          <IconButton onClick={() => setEditUser(null)} size="small"><FiX /></IconButton>
        </DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                fullWidth
                required
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              />
              <TextField
                label="Last Name"
                fullWidth
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              />
            </Box>

            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />

            <TextField
              label="Phone Number"
              fullWidth
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />

            {/* Birth Date Selectors */}
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.muted, mb: 0.5, display: 'block' }}>
                DATE OF BIRTH
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel id="edit-dob-day-label">Day</InputLabel>
                  <Select
                    labelId="edit-dob-day-label"
                    label="Day"
                    value={editForm.birthDay}
                    onChange={(e) => setEditForm({ ...editForm, birthDay: e.target.value })}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <MenuItem key={d} value={String(d)}>{String(d).padStart(2, '0')}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: 1.5 }}>
                  <InputLabel id="edit-dob-month-label">Month</InputLabel>
                  <Select
                    labelId="edit-dob-month-label"
                    label="Month"
                    value={editForm.birthMonth}
                    onChange={(e) => setEditForm({ ...editForm, birthMonth: e.target.value })}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => (
                      <MenuItem key={idx + 1} value={String(idx + 1)}>{m}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: 1.2 }}>
                  <InputLabel id="edit-dob-year-label">Year</InputLabel>
                  <Select
                    labelId="edit-dob-year-label"
                    label="Year"
                    value={editForm.birthYear}
                    onChange={(e) => setEditForm({ ...editForm, birthYear: e.target.value })}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {Array.from({ length: 80 }, (_, i) => 2026 - i).map((y) => (
                      <MenuItem key={y} value={String(y)}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <TextField
              label="Update Password (Optional)"
              type="password"
              placeholder="Leave blank to keep unchanged"
              fullWidth
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel id="edit-role-label">System Role</InputLabel>
              <Select
                labelId="edit-role-label"
                label="System Role"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              >
                <MenuItem value="USER">USER (Standard Client)</MenuItem>
                <MenuItem value="TEAM">TEAM (Team Member)</MenuItem>
                <MenuItem value="ADMIN">ADMIN (Administrator)</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={editForm.emailVerified}
                  onChange={(e) => setEditForm({ ...editForm, emailVerified: e.target.checked })}
                  color="primary"
                />
              }
              label="Email Address Verified"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setEditUser(null)} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting} startIcon={submitting ? <CircularProgress size={16} /> : undefined}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* RESET PASSWORD DIALOG */}
      <Dialog open={Boolean(passwordUser)} onClose={() => setPasswordUser(null)} maxWidth="xs" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiKey color={brandColors.primary} size={20} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Reset Password</Typography>
          </Box>
          <IconButton onClick={() => setPasswordUser(null)} size="small"><FiX /></IconButton>
        </DialogTitle>
        <form onSubmit={handlePasswordSubmit}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" sx={{ color: brandColors.text }}>
              Set a new password for <strong>{passwordUser?.firstName} {passwordUser?.lastName}</strong> ({passwordUser?.email}):
            </Typography>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
              value={newPasswordVal}
              onChange={(e) => setNewPasswordVal(e.target.value)}
              helperText="Minimum 6 characters"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setPasswordUser(null)} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" color="warning" disabled={submitting} startIcon={submitting ? <CircularProgress size={16} /> : <FiKey />}>
              {submitting ? 'Resetting...' : 'Set Password'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={Boolean(deleteUser)} onClose={() => setDeleteUser(null)} maxWidth="xs" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ pt: 3, pb: 1, textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: alpha('#EF4444', 0.1), color: '#EF4444', mx: 'auto', mb: 1.5, width: 48, height: 48 }}>
            <FiAlertTriangle size={24} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Delete User Account?</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body2" sx={{ color: brandColors.text, mb: 1 }}>
            Are you sure you want to delete <strong>{deleteUser?.firstName} {deleteUser?.lastName}</strong> ({deleteUser?.email})?
          </Typography>
          <Alert severity="warning" sx={{ textAlign: 'left', borderRadius: 2, mt: 1.5, fontSize: '0.82rem' }}>
            This action will permanently purge the user and all associated bookings, invoices, activity logs, and scans from the database.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, justifyContent: 'center', gap: 1 }}>
          <Button onClick={() => setDeleteUser(null)} disabled={submitting} variant="outlined" sx={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={submitting}
            variant="contained"
            color="error"
            sx={{ borderRadius: '8px', fontWeight: 600 }}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <FiTrash2 />}
          >
            {submitting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* NOTIFICATION SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
