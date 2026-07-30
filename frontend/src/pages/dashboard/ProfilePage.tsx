import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, TextField, Button, Avatar, Paper, Divider, Alert, CircularProgress, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiSave, FiCheckCircle } from 'react-icons/fi'
import { brandColors } from '../../theme'
import { useAuth } from '../../context/AuthContext'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    linkedinUrl: user?.linkedinUrl || '',
    currentRole: user?.currentRole || '',
    bio: user?.bio || '',
  })

  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

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
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        linkedinUrl: formData.linkedinUrl,
        currentRole: formData.currentRole,
        bio: formData.bio,
      })
      setSuccessMsg('Profile updated successfully!')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const initials = `${formData.firstName?.[0] || 'U'}${formData.lastName?.[0] || ''}`.toUpperCase()

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>My Profile</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Manage your personal information and account preferences.</Typography>
        </Box>

        {successMsg && (
          <Alert severity="success" icon={<FiCheckCircle size={18} />} sx={{ mb: 3, borderRadius: '12px' }}>
            {successMsg}
          </Alert>
        )}

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {errorMsg}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', textAlign: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: alpha(brandColors.primary, 0.12), color: brandColors.primary, fontWeight: 700, fontSize: '1.75rem', mx: 'auto', mb: 2 }}>
                {initials}
              </Avatar>
              <Typography variant="h5" sx={{ color: brandColors.text, mb: 0.5 }}>{formData.firstName} {formData.lastName}</Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted, mb: 2 }}>{formData.email}</Typography>
              <Typography variant="caption" sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: '100px', backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 600 }}>
                {user?.role === 'ADMIN' ? 'Administrator' : 'Standard Account'}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ mb: 3, color: brandColors.text }}>Personal Information</Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Email Address" name="email" value={formData.email} disabled fullWidth helperText="Email cannot be changed." />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} fullWidth placeholder="+91 98765 43210" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Current Role" name="currentRole" value={formData.currentRole} onChange={handleChange} fullWidth placeholder="e.g. Senior Software Engineer" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="LinkedIn Profile URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} fullWidth placeholder="https://linkedin.com/in/username" />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Bio" name="bio" value={formData.bio} onChange={handleChange} multiline rows={3} fullWidth placeholder="Tell us about your background and career goals..." />
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Button type="submit" variant="contained" size="large" disabled={saving} startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <FiSave />} sx={{ px: 4 }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}
