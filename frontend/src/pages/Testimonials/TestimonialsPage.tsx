import { Box, Container, Typography, Grid, Avatar, Rating, Chip, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import { brandColors } from '../../theme'

const testimonials = [
  { name: 'Priya Sharma', role: 'Product Manager', company: 'Google', avatar: 'PS', rating: 5, result: '3 job offers in 4 weeks', content: "BrandIt completely transformed my LinkedIn profile. I went from getting no responses to being flooded with recruiter messages.", color: '#EFF6FF' },
  { name: 'Rahul Mehta', role: 'Software Engineer', company: 'Microsoft', avatar: 'RM', rating: 5, result: 'Profile views up 420%', content: "My resume was the bottleneck in my job search. After BrandIt rewrote it, I started getting calls from companies I thought were out of reach.", color: '#F0FDF4' },
  { name: 'Ananya Krishnan', role: 'Marketing Director', company: 'Adobe', avatar: 'AK', rating: 5, result: '60% salary increase', content: "The executive branding package was exactly what I needed to make the leap to Director level.", color: '#FFF7ED' },
  { name: 'Vikram Singh', role: 'Data Scientist', company: 'Amazon', avatar: 'VS', rating: 5, result: 'Landed FAANG role', content: "I had the skills but couldn't get past the screening stage. BrandIt's interview coaching gave me the confidence to crack Amazon.", color: '#F5F3FF' },
  { name: 'Meera Nair', role: 'Finance Analyst', company: 'Deloitte', avatar: 'MN', rating: 5, result: 'Promoted within 6 months', content: "My LinkedIn was completely invisible before BrandIt. Now I have senior partners reaching out to connect.", color: '#FDF2F8' },
  { name: 'Aryan Bose', role: 'UX Designer', company: 'Infosys', avatar: 'AB', rating: 5, result: '5x connection requests', content: "The personal branding strategy they built for me was a game-changer. My portfolio now gets views from top companies daily.", color: '#ECFDF5' },
]

export default function TestimonialsPage() {
  return (
    <Box>
      <Box sx={{ py: { xs: 10, md: 14 }, backgroundColor: brandColors.background, textAlign: 'center' }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Chip label="TESTIMONIALS" sx={{ mb: 3, backgroundColor: alpha(brandColors.primary, 0.08), color: brandColors.primary, fontWeight: 600 }} />
            <Typography variant="h1" sx={{ mb: 2 }}>
              Real Results from Real{' '}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Professionals
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted }}>500+ professionals have transformed their careers with BrandIt.</Typography>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {testimonials.map((t, i) => (
              <Grid item xs={12} md={6} lg={4} key={t.name}>
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                  <Box sx={{ p: 3.5, borderRadius: '20px', border: `1px solid ${brandColors.border}`, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: '100px', backgroundColor: alpha(brandColors.success, 0.08), mb: 2.5, alignSelf: 'flex-start' }}>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>{t.result}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.8, flexGrow: 1, mb: 3, fontStyle: 'italic' }}>
                      "{t.content}"
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: t.color, color: brandColors.primary, fontWeight: 700 }}>{t.avatar}</Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text }}>{t.name}</Typography>
                          <Typography variant="caption" sx={{ color: brandColors.muted }}>{t.role} · {t.company}</Typography>
                        </Box>
                      </Box>
                      <Rating value={t.rating} readOnly size="small" />
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
