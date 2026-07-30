import { Box, Container, Typography, alpha, Chip } from '@mui/material'
import { motion } from 'framer-motion'
import { brandColors } from '../../theme'

const domains = [
  { name: 'Software & Cloud Engineering', icon: '💻' },
  { name: 'Finance, Banking & VC', icon: '📊' },
  { name: 'Product Management & Design', icon: '🚀' },
  { name: 'Strategy & Management Consulting', icon: '💡' },
  { name: 'Marketing & Corporate Strategy', icon: '🎯' },
  { name: 'Executive Leadership & C-Suite', icon: '⚡' },
  { name: 'Data Science & AI Engineering', icon: '🤖' },
]

export default function TrustedBySection() {
  return (
    <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: brandColors.background, overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: brandColors.muted,
              mb: 3,
              letterSpacing: '0.12em',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            TAILORED CAREER BRANDING ACROSS KEY INDUSTRIES
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 1, sm: 1.5 },
              maxWidth: 900,
              mx: 'auto',
            }}
          >
            {domains.map((d) => (
              <Chip
                key={d.name}
                icon={<Box component="span" sx={{ fontSize: '1rem', ml: 1 }}>{d.icon}</Box>}
                label={d.name}
                sx={{
                  py: 2.2,
                  px: 1,
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  border: `1px solid ${brandColors.border}`,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  fontWeight: 600,
                  color: brandColors.text,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  '&:hover': {
                    borderColor: alpha(brandColors.primary, 0.4),
                    backgroundColor: alpha(brandColors.primary, 0.02),
                  },
                }}
              />
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
