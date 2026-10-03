import { Box, Typography, Grid, TextField } from '@mui/material'
import { brandColors } from '../../../theme'

interface StepContactDetailsProps {
  name: string
  email: string
  phone: string
  notes: string
  onChangeField: (field: string, value: string) => void
}

export function StepContactDetails({ name, email, phone, notes, onChangeField }: StepContactDetailsProps) {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: brandColors.text, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        Your Contact & Profile Details
      </Typography>

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Full Name"
            fullWidth
            required
            value={name}
            onChange={e => onChangeField('name', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Email Address (For Confirmation)"
            type="email"
            fullWidth
            required
            value={email}
            onChange={e => onChangeField('email', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Phone / WhatsApp Number"
            fullWidth
            required
            value={phone}
            onChange={e => onChangeField('phone', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="LinkedIn Profile URL or Special Requirements"
            multiline
            rows={3}
            fullWidth
            value={notes}
            onChange={e => onChangeField('notes', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
