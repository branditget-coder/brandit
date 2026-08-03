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
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse 90% 60% at 30% -10%, ${alpha(brandColors.primary, 0.09)} 0%, ${alpha(brandColors.primary, 0.02)} 50%, transparent 80%)`,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse 70% 50% at 80% 90%, ${alpha(brandColors.secondary, 0.06)} 0%, transparent 70%)`,
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
