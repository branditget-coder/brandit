import { Box, Typography, Grid, TextField, Button, Avatar, Paper, Divider, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiSave } from 'react-icons/fi'
import { brandColors } from '../../theme'

export default function ProfilePage() {
  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>My Profile</Typography>
          <Typography variant="body1" sx={{ color: brandColors.muted }}>Manage your personal information and preferences.</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none', textAlign: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: alpha(brandColors.primary, 0.12), color: brandColors.primary, fontWeight: 700, fontSize: '1.75rem', mx: 'auto', mb: 2 }}>JD</Avatar>
              <Typography variant="h5" sx={{ color: brandColors.text, mb: 0.5 }}>John Doe</Typography>
              <Typography variant="body2" sx={{ color: brandColors.muted, mb: 2 }}>Professional Plan</Typography>
              <Button variant="outlined" size="small" fullWidth>Change Photo</Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ mb: 3, color: brandColors.text }}>Personal Information</Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}><TextField label="First Name" defaultValue="John" fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Last Name" defaultValue="Doe" fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Email Address" defaultValue="john.doe@email.com" fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Phone Number" defaultValue="+91 98765 43210" fullWidth /></Grid>
                <Grid item xs={12}><TextField label="LinkedIn Profile URL" defaultValue="https://linkedin.com/in/johndoe" fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Current Role" defaultValue="Software Engineer" fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Bio" multiline rows={3} fullWidth placeholder="Tell us about yourself and your career goals..." /></Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Button variant="contained" size="large" startIcon={<FiSave />} sx={{ px: 4 }}>Save Changes</Button>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}
