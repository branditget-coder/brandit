import { Box, alpha } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import Footer from '../common/Footer'
import { brandColors } from '../../theme'

export default function MainLayout() {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', backgroundColor: brandColors.background }}>
      {/* Ambient Glassmorphic Background Glow Orbs */}
      <Box
        sx={{
          position: 'fixed',
          top: '-10%',
          left: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(brandColors.primary, 0.12)} 0%, ${alpha(brandColors.primary, 0.02)} 60%, transparent 80%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: '40%',
          right: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#7C3AED', 0.08)} 0%, ${alpha('#0284C7', 0.03)} 60%, transparent 80%)`,
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '5%',
          left: '-5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(brandColors.secondary, 0.09)} 0%, ${alpha(brandColors.primary, 0.02)} 60%, transparent 80%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </Box>
    </Box>
  )
}
