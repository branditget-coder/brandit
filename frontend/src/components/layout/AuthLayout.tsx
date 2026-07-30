import { Box, Container, alpha } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { brandColors } from '../../theme'

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: brandColors.background,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '50%',
          height: '60%',
          background: `radial-gradient(circle, ${alpha(brandColors.primary, 0.08)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '40%',
          height: '50%',
          background: `radial-gradient(circle, ${alpha(brandColors.secondary, 0.06)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', py: 6, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
