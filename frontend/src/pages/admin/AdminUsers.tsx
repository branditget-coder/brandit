import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Paper, Avatar, Chip, alpha, TextField, InputAdornment,
  CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel,
  Alert, Snackbar, Tooltip
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  FiSearch, FiUserCheck, FiUsers, FiUserPlus, FiEdit2, FiTrash2,
  FiShield, FiAlertTriangle, FiX
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
  createdAt: string
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  // Modals state
  const [createOpen, setCreateOpen] = useState<boolean>(false)
  const [editUser, setEditUser] = useState<UserItem | null>(null)
  const [deleteUser, setDeleteUser] = useState<UserItem | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

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
  })

  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'USER',
    emailVerified: true,
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
      await api.post('/admin/users', createForm)
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
      await api.put(`/admin/users/${editUser.id}`, editForm)
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

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
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
              sx={{ width: 260, '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<FiUserPlus size={18} />}
              onClick={() => setCreateOpen(true)}
              sx={{ borderRadius: '10px', textTransform: 'none', px: 3, fontWeight: 600 }}
            >
              Add New User
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Paper sx={{ borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', overflowX: 'auto' }}>
            <Box sx={{ minWidth: 800 }}>
              {/* Header */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 1.2fr 1.2fr 1fr 1fr', gap: 2, px: 3, py: 2, borderBottom: `1px solid ${brandColors.border}`, backgroundColor: brandColors.background }}>
                {['User', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                  <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: brandColors.muted, letterSpacing: '0.06em' }}>{h.toUpperCase()}</Typography>
                ))}
              </Box>

              {/* Rows */}
              {filteredUsers.length === 0 ? (
                <Box sx={{ p: 5, textAlign: 'center' }}>
                  <FiUsers size={32} color={brandColors.muted} style={{ marginBottom: 12 }} />
                  <Typography variant="h6" sx={{ color: brandColors.text, mb: 0.5 }}>No registered users match your search</Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted }}>Try refining your search terms.</Typography>
                </Box>
              ) : (
                filteredUsers.map((u, i) => {
                  const initials = `${u.firstName?.[0] || 'U'}${u.lastName?.[0] || ''}`.toUpperCase()
                  const formattedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
                  const isCurrentSession = currentUser?.email?.toLowerCase() === u.email?.toLowerCase()

                  return (
                    <Box key={u.id} sx={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 1.2fr 1.2fr 1fr 1fr', gap: 2, px: 3, py: 2.5, borderBottom: i < filteredUsers.length - 1 ? `1px solid ${brandColors.border}` : 'none', alignItems: 'center', '&:hover': { backgroundColor: alpha(brandColors.primary, 0.02) }, transition: 'background-color 0.15s' }}>
                      {/* User Avatar & Name */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(u.role === 'ADMIN' ? '#7C3AED' : brandColors.primary, 0.1), color: u.role === 'ADMIN' ? '#7C3AED' : brandColors.primary, fontSize: '0.8rem', fontWeight: 700 }}>
                          {initials}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.text }}>{u.firstName} {u.lastName}</Typography>
                          {isCurrentSession && (
                            <Chip label="Active Session" size="small" icon={<FiUserCheck size={12} />} sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, backgroundColor: alpha(brandColors.primary, 0.1), color: brandColors.primary, border: 'none' }} />
                          )}
                        </Box>
                      </Box>

                      {/* Email */}
                      <Typography variant="body2" sx={{ color: brandColors.muted, overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</Typography>

                      {/* Role Chip */}
                      <Chip
                        label={u.role}
                        size="small"
                        icon={u.role === 'ADMIN' ? <FiShield size={12} /> : undefined}
                        sx={{
                          backgroundColor: alpha(u.role === 'ADMIN' ? '#7C3AED' : u.role === 'TEAM' ? '#0284C7' : brandColors.primary, 0.1),
                          color: u.role === 'ADMIN' ? '#7C3AED' : u.role === 'TEAM' ? '#0284C7' : brandColors.primary,
                          fontWeight: 600,
                          fontSize: '0.72rem',
                          width: 'fit-content'
                        }}
                      />

                      {/* Joined Date */}
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>{formattedDate}</Typography>

                      {/* Status Chip */}
                      <Chip
                        label={u.emailVerified ? 'Verified' : 'Active'}
                        size="small"
                        sx={{ backgroundColor: alpha(brandColors.success, 0.1), color: '#059669', fontWeight: 600, fontSize: '0.72rem', width: 'fit-content' }}
                      />

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Tooltip title="Edit User">
                          <IconButton size="small" onClick={() => handleOpenEdit(u)} sx={{ color: brandColors.muted, '&:hover': { color: brandColors.primary } }}>
                            <FiEdit2 size={16} />
                          </IconButton>
                        </Tooltip>

                        {isCurrentSession ? (
                          <Tooltip title="You cannot delete your own active session account">
                            <span>
                              <IconButton size="small" disabled sx={{ opacity: 0.3 }}>
                                <FiTrash2 size={16} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Delete User Account">
                            <IconButton size="small" onClick={() => setDeleteUser(u)} sx={{ color: brandColors.muted, '&:hover': { color: '#EF4444' } }}>
                              <FiTrash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  )
                })
              )}
            </Box>
          </Paper>
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
                required
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
