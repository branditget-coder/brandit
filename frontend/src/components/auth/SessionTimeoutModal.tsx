import { Dialog, DialogContent, Typography, Button, Box, alpha } from '@mui/material'
import { FiClock, FiLogIn } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { brandColors } from '../../theme'

interface SessionTimeoutModalProps {
  open: boolean
  onClose: () => void
}

export default function SessionTimeoutModal({ open, onClose }: SessionTimeoutModalProps) {
  const navigate = useNavigate()

  const handleLoginAgain = () => {
    onClose()
    navigate('/login')
  }

  return (
    <Dialog
      open={open}
      onClose={handleLoginAgain}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          p: { xs: 1, sm: 2 },
          maxWidth: '440px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          border: `1px solid ${brandColors.border}`,
          backgroundColor: '#fff',
        },
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
        {/* Animated Clock / Alert Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: alpha('#F59E0B', 0.12),
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 0 0 8px rgba(245, 158, 11, 0.08)',
          }}
        >
          <FiClock size={36} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, color: brandColors.text, mb: 1.5, fontSize: { xs: '1.4rem', sm: '1.6rem' } }}>
          Session Expired
        </Typography>

        <Typography variant="body1" sx={{ color: brandColors.muted, mb: 3.5, lineHeight: 1.6, fontSize: '0.95rem' }}>
          Your session timed out after <strong>10 minutes</strong> of inactivity for your security. Please log in again to access your account.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<FiLogIn size={18} />}
          onClick={handleLoginAgain}
          sx={{
            py: 1.5,
            borderRadius: '14px',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            backgroundColor: brandColors.primary,
            boxShadow: '0 4px 14px rgba(10, 102, 194, 0.3)',
            '&:hover': {
              backgroundColor: brandColors.secondary,
            },
          }}
        >
          Login Again
        </Button>
      </DialogContent>
    </Dialog>
  )
}
