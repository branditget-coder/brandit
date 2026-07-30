import { Box, Container, Typography, Grid, Avatar, Chip, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { FiPhone } from 'react-icons/fi'
import { brandColors } from '../../theme'

const team = [
  {
    name: 'Raghav Dhir',
    role: 'Founder & Lead Tech Strategist',
    phone: '+91 82644XXXXX',
    avatar: 'RD',
    bio: 'Drives technical infrastructure, strategic personal branding systems, and overall platform growth.',
    color: '#EFF6FF',
  },
  {
    name: 'Hritika Seth',
    role: 'LinkedIn Manager and Consultant',
    phone: '+91 8708231539',
    avatar: 'HS',
    bio: 'Expert in LinkedIn profile positioning, strategy-backed content calendars, and personal brand growth.',
    color: '#F0FDF4',
  },
  {
    name: 'Kritika Dhawan',
    role: 'Customer Outreach & Operations',
    phone: '+91 6284318951',
    avatar: 'KD',
    bio: 'Spearheads client onboarding, cold outreach strategy, follow-ups, and operational excellence.',
    color: '#FFF7ED',
  },
  {
    name: 'Stuti Sharma',
    role: 'Human Resource',
    phone: '+91 9015470950',
    avatar: 'SS',
    bio: 'Manages team operations, organizational culture, and client experience standards.',
    color: '#F5F3FF',
  },
  {
    name: 'Parinoor',
    role: 'Core Management',
    phone: '+91 6284318951',
    avatar: 'P',
    bio: 'Oversees business development, strategic execution, and client success roadmaps.',
    color: '#FFF1F2',
  },
  {
    name: 'Yash',
    role: 'Accounting and Finance',
    phone: '+91 9024469496',
    avatar: 'Y',
    bio: 'Handles financial planning, transaction transparency, and billing operations.',
    color: '#ECFDF5',
  },
]

interface TeamSectionProps {
  backgroundColor?: string
  showSubtitle?: boolean
}

export default function TeamSection({ backgroundColor = brandColors.background }: TeamSectionProps) {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <Chip label="OUR EXPERTS" sx={{ mb: 2, backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 700, display: 'flex', mx: 'auto', width: 'fit-content' }} />
          <Typography variant="h2" sx={{ textAlign: 'center', mb: 1.5, fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 800 }}>
            Meet the Team behind BrandIt
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: brandColors.muted, mb: { xs: 5, md: 8 }, maxWidth: 540, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
            The dedicated team of consultants, managers, and specialists behind your personal brand transformation.
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {team.map((member, i) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: '24px',
                    border: `1px solid ${brandColors.border}`,
                    backgroundColor: '#fff',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 30px rgba(10, 102, 194, 0.1)',
                      borderColor: alpha(brandColors.primary, 0.3),
                    },
                  }}
                >
                  <Avatar sx={{ width: 72, height: 72, bgcolor: member.color, color: brandColors.primary, fontWeight: 700, fontSize: '1.3rem', mb: 2, border: `2px solid ${alpha(brandColors.primary, 0.15)}` }}>
                    {member.avatar}
                  </Avatar>
                  <Typography variant="h6" sx={{ color: brandColors.text, fontWeight: 700, mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.primary, display: 'block', mb: 1.5, fontWeight: 700, letterSpacing: '0.02em' }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.6, fontSize: '0.88rem', flexGrow: 1, mb: 2.5 }}>
                    {member.bio}
                  </Typography>
                  <Chip
                    icon={<FiPhone size={12} />}
                    label={member.phone}
                    size="small"
                    component="a"
                    href={`tel:${member.phone.replace(/\s+/g, '')}`}
                    clickable
                    sx={{
                      backgroundColor: alpha(brandColors.primary, 0.06),
                      color: brandColors.primary,
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      py: 0.5,
                      px: 0.5,
                      '&:hover': { backgroundColor: alpha(brandColors.primary, 0.14) },
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
