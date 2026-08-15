import { Box, Container, Typography, Grid, Chip, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiTarget, FiHeart, FiUsers } from 'react-icons/fi'
import { brandColors } from '../../theme'
import TeamSection from '../../components/sections/TeamSection'

const values = [
  { icon: FiTarget, title: 'Results-Driven', desc: 'Every strategy is built around measurable outcomes — clearer positioning, higher response rates, and career progression.', color: '#EFF6FF', iconColor: brandColors.primary },
  { icon: FiHeart, title: 'Authentic First', desc: 'We amplify your real story. No fluff, no fabrication — just your genuine value, articulated powerfully.', color: '#FDF2F8', iconColor: '#EC4899' },
  { icon: FiUsers, title: 'Client-Obsessed', desc: 'Your career growth is our benchmark. We dedicate personalized attention to every engagement.', color: '#F0FDF4', iconColor: brandColors.success },
]

export default function AboutPage() {
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ py: { xs: 8, md: 14 }, backgroundColor: brandColors.background, textAlign: 'center' }}>
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Chip label="OUR MISSION" sx={{ mb: 3, backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 700 }} />
            <Typography variant="h1" sx={{ mb: 3, fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.5rem' } }}>
              Dedicated to Building Your{' '}
              <Box component="span" sx={{ color: brandColors.primary }}>
                Personal Brand
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, maxWidth: 640, mx: 'auto', lineHeight: 1.8, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
              BrandIt (operated by legal entity <strong>RAGHAV DHIR</strong>) is a specialized <strong>Career & Personal Branding Consulting Services</strong> firm. Operating out of DeraBassi, Punjab, 140507, India, we help career professionals, job seekers, and executives build industry authority through structured profile setup, content publishing, and targeted network outreach.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Values */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#fff' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography variant="h2" sx={{ textAlign: 'center', mb: { xs: 5, md: 8 }, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>What Drives Us</Typography>
          <Grid container spacing={4}>
            {values.map((v, i) => (
              <Grid item xs={12} md={4} key={v.title}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <Box sx={{ p: 4, borderRadius: '20px', border: `1px solid ${brandColors.border}`, height: '100%', textAlign: 'center' }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '16px', backgroundColor: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                      <v.icon size={24} color={v.iconColor} />
                    </Box>
                    <Typography variant="h5" sx={{ mb: 1.5, color: brandColors.text }}>{v.title}</Typography>
                    <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.8 }}>{v.desc}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <TeamSection backgroundColor={brandColors.background} />
    </Box>
  )
}
