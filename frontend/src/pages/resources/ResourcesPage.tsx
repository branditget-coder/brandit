import { Box, Container, Typography, Grid, Button, Chip, alpha, Stack } from '@mui/material'
import { motion } from 'framer-motion'
import { FiDownload, FiExternalLink, FiFileText, FiVideo, FiBookOpen, FiTarget } from 'react-icons/fi'
import { brandColors } from '../../theme'

const resources = [
  { icon: FiFileText, title: 'LinkedIn Profile Checklist', desc: '50-point checklist to audit and optimize your LinkedIn profile from top to bottom.', type: 'PDF', free: true, color: '#EFF6FF', iconColor: brandColors.primary },
  { icon: FiFileText, title: 'ATS Resume Template', desc: 'Professionally designed, ATS-optimized resume template in Google Docs format.', type: 'Template', free: true, color: '#F0FDF4', iconColor: brandColors.success },
  { icon: FiTarget, title: 'STAR Method Interview Framework', desc: 'Step-by-step guide to crafting compelling behavioral interview answers with examples.', type: 'PDF', free: true, color: '#FFF7ED', iconColor: '#F59E0B' },
  { icon: FiBookOpen, title: 'Salary Negotiation Scripts', desc: 'Word-for-word scripts for salary negotiation in 5 different scenarios.', type: 'Guide', free: false, color: '#F5F3FF', iconColor: '#7C3AED' },
  { icon: FiVideo, title: 'LinkedIn Content Strategy', desc: 'A 30-day content calendar template to build your thought leadership on LinkedIn.', type: 'Template', free: false, color: '#FDF2F8', iconColor: '#EC4899' },
  { icon: FiTarget, title: 'Job Search Tracker', desc: 'Google Sheets template to organize your job applications, contacts, and follow-ups.', type: 'Template', free: true, color: '#ECFDF5', iconColor: '#059669' },
]

export default function ResourcesPage() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: brandColors.background }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip label="RESOURCES" sx={{ mb: 3, backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 600 }} />
            <Typography variant="h1" sx={{ mb: 2 }}>
              Free Career{' '}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Resources
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, maxWidth: 480, mx: 'auto' }}>
              Templates, checklists, and guides to accelerate your career journey — most of them free.
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {resources.map((r, i) => (
            <Grid item xs={12} sm={6} lg={4} key={r.title}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                <Box sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.25s', '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.07)' } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <r.icon size={22} color={r.iconColor} />
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Chip label={r.type} size="small" sx={{ fontSize: '0.7rem', backgroundColor: alpha(r.iconColor, 0.08), color: r.iconColor, fontWeight: 600 }} />
                      <Chip label={r.free ? 'Free' : 'Pro'} size="small" sx={{ fontSize: '0.7rem', backgroundColor: r.free ? alpha(brandColors.success, 0.1) : alpha(brandColors.primary, 0.1), color: r.free ? '#059669' : brandColors.primary, fontWeight: 700 }} />
                    </Stack>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, color: brandColors.text }}>{r.title}</Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.7, flexGrow: 1, mb: 3 }}>{r.desc}</Typography>
                  <Button variant={r.free ? 'outlined' : 'contained'} size="medium" startIcon={r.free ? <FiDownload /> : <FiExternalLink />} fullWidth>
                    {r.free ? 'Download Free' : 'Get with Pro Plan'}
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
