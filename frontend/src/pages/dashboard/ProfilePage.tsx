import React, { useState, useEffect, useRef } from 'react'
import {
  Box, Typography, Grid, TextField, Button, Avatar, Paper,
  Divider, Alert, CircularProgress, alpha, IconButton, Stack
} from '@mui/material'
import { motion } from 'framer-motion'
import { FiSave, FiCheckCircle, FiCamera, FiLock, FiShield, FiUser } from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    linkedinUrl: user?.linkedinUrl || '',
    currentRole: user?.currentRole || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  })

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [profileSuccessMsg, setProfileSuccessMsg] = useState('')
  const [profileErrorMsg, setProfileErrorMsg] = useState('')

  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('')
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        linkedinUrl: user.linkedinUrl || '',
        currentRole: user.currentRole || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
      })
    }
  }, [user])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Handle profile image DP upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setProfileErrorMsg('Image size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Image = reader.result as string
      setFormData(prev => ({ ...prev, avatarUrl: base64Image }))
      try {
        await updateProfile({ avatarUrl: base64Image })
        setProfileSuccessMsg('Profile picture updated successfully!')
      } catch (err: any) {
        setProfileErrorMsg('Failed to save profile picture.')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileSuccessMsg('')
    setProfileErrorMsg('')

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        linkedinUrl: formData.linkedinUrl,
        currentRole: formData.currentRole,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
      })
      setProfileSuccessMsg('Profile updated successfully!')
    } catch (err: any) {
      setProfileErrorMsg(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSuccessMsg('')
    setPasswordErrorMsg('')

    if (passwordData.newPassword.length < 6) {
      setPasswordErrorMsg('New password must be at least 6 characters long.')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrorMsg('New password and confirm password do not match.')
      return
    }

    setSavingPassword(true)
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordSuccessMsg(res.data.message || 'Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      setPasswordErrorMsg(err.response?.data?.message || 'Failed to change password. Verify your current password.')
    } finally {
      setSavingPassword(false)
    }
  }

  const initials = `${formData.firstName?.[0] || 'U'}${formData.lastName?.[0] || ''}`.toUpperCase()

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5, fontWeight: 800 }}>My Profile & Security</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Manage your personal branding profile, picture, and account credentials.</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column: Avatar DP Card */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
              <Box sx={{ position: 'relative', width: 110, height: 110, mx: 'auto', mb: 2.5 }}>
                <Avatar
                  src={formData.avatarUrl}
                  sx={{
                    width: 110,
                    height: 110,
                    bgcolor: alpha(brandColors.primary, 0.12),
                    color: brandColors.primary,
                    fontWeight: 700,
                    fontSize: '2.2rem',
                    border: `3px solid ${alpha(brandColors.primary, 0.25)}`,
                    boxShadow: '0 6px 18px rgba(10, 102, 194, 0.15)',
                    '& img': { objectFit: 'cover' },
                  }}
                >
                  {initials}
                </Avatar>

                {/* Upload Camera Button Overlay */}
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: brandColors.primary,
                    color: '#fff',
                    p: 1,
                    boxShadow: '0 4px 12px rgba(10, 102, 194, 0.4)',
                    '&:hover': {
                      backgroundColor: brandColors.secondary,
                    },
                  }}
                  aria-label="Upload profile picture"
                >
                  <FiCamera size={16} />
                </IconButton>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </Box>

              <Typography variant="h5" sx={{ color: brandColors.text, fontWeight: 700, mb: 0.5 }}>
                {formData.firstName} {formData.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted, mb: 2 }}>
                {formData.email}
              </Typography>
              <Typography variant="caption" sx={{ display: 'inline-block', px: 2, py: 0.6, borderRadius: '100px', backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 700, letterSpacing: '0.02em' }}>
                {user?.role === 'ADMIN' ? 'Administrator' : 'Client Profile'}
              </Typography>

              <Divider sx={{ my: 3, borderColor: brandColors.border }} />

              <Button
                variant="outlined"
                size="small"
                startIcon={<FiCamera size={14} />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: brandColors.border,
                  color: brandColors.text,
                  '&:hover': { borderColor: brandColors.primary, color: brandColors.primary },
                }}
              >
                Change Display Photo
              </Button>
            </Paper>
          </Grid>

          {/* Right Column: Profile Form & Change Password */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Personal Details Form */}
              <Paper component="form" onSubmit={handleProfileSubmit} sx={{ p: { xs: 3, sm: 4 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <FiUser size={20} color={brandColors.primary} />
                  <Typography variant="h6" sx={{ color: brandColors.text, fontWeight: 700 }}>
                    Personal Details
                  </Typography>
                </Box>

                {profileSuccessMsg && (
                  <Alert severity="success" icon={<FiCheckCircle size={18} />} sx={{ mb: 3, borderRadius: '12px' }}>
                    {profileSuccessMsg}
                  </Alert>
                )}

                {profileErrorMsg && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {profileErrorMsg}
                  </Alert>
                )}

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleProfileChange} fullWidth required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleProfileChange} fullWidth required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Email Address" name="email" value={formData.email} disabled fullWidth helperText="Registered email address cannot be changed." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleProfileChange} fullWidth placeholder="+91 82644XXXXX" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Current Role" name="currentRole" value={formData.currentRole} onChange={handleProfileChange} fullWidth placeholder="e.g. Founder / Senior Product Lead" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="LinkedIn Profile URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleProfileChange} fullWidth placeholder="https://linkedin.com/in/username" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Professional Bio" name="bio" value={formData.bio} onChange={handleProfileChange} multiline rows={3} fullWidth placeholder="Summary of your executive achievements and career trajectory..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Button type="submit" variant="contained" size="large" disabled={savingProfile} startIcon={savingProfile ? <CircularProgress size={18} color="inherit" /> : <FiSave />} sx={{ px: 4, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}>
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </Paper>

              {/* Change Password Form */}
              <Paper component="form" onSubmit={handlePasswordSubmit} sx={{ p: { xs: 3, sm: 4 }, borderRadius: '24px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <FiLock size={20} color={brandColors.primary} />
                  <Typography variant="h6" sx={{ color: brandColors.text, fontWeight: 700 }}>
                    Change Account Password
                  </Typography>
                </Box>

                {passwordSuccessMsg && (
                  <Alert severity="success" icon={<FiCheckCircle size={18} />} sx={{ mb: 3, borderRadius: '12px' }}>
                    {passwordSuccessMsg}
                  </Alert>
                )}

                {passwordErrorMsg && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {passwordErrorMsg}
                  </Alert>
                )}

                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      required
                      helperText="Must be at least 6 characters"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Button type="submit" variant="contained" size="large" disabled={savingPassword} startIcon={savingPassword ? <CircularProgress size={18} color="inherit" /> : <FiShield />} sx={{ px: 4, borderRadius: '12px', fontWeight: 700, textTransform: 'none', backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' } }}>
                  {savingPassword ? 'Updating Password...' : 'Update Password'}
                </Button>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}
