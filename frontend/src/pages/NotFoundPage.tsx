import { Box, Container, Typography, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import { brandColors } from '../theme'

export default function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: brandColors.background }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '6rem', fontWeight: 800, color: brandColors.border, lineHeight: 1, mb: 2 }}>404</Typography>
            <Typography variant="h3" sx={{ mb: 1.5 }}>Page not found</Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, mb: 4 }}>
              The page you're looking for doesn't exist or has been moved.
            </Typography>
            <Button component={RouterLink} to="/" variant="contained" size="large" startIcon={<FiArrowLeft />} sx={{ px: 4 }}>
              Back to Home
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
