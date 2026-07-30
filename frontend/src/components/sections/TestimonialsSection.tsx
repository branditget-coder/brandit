import { useState } from 'react'
import { Box, Container, Grid, Typography, alpha, Rating, Avatar, IconButton } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { brandColors } from '../../theme'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Product Manager',
    company: 'Google',
    avatar: 'PS',
    rating: 5,
    result: 'Received 3 job offers within 4 weeks',
    content: "BrandIt completely transformed my LinkedIn profile. I went from getting no responses to being flooded with recruiter messages. The team understood exactly what I needed and delivered beyond expectations.",
    bgColor: '#EFF6FF',
  },
  {
    name: 'Rahul Mehta',
    role: 'Software Engineer',
    company: 'Microsoft',
    avatar: 'RM',
    rating: 5,
    result: 'Profile views up 420% in 2 months',
    content: "My resume was the bottleneck in my job search. After BrandIt rewrote it, I started getting calls from companies I thought were out of reach. Absolutely worth every rupee.",
    bgColor: '#F0FDF4',
  },
  {
    name: 'Ananya Krishnan',
    role: 'Marketing Director',
    company: 'Adobe',
    avatar: 'AK',
    rating: 5,
    result: '60% salary increase in next role',
    content: "The executive branding package was exactly what I needed to make the leap to Director. BrandIt helped me articulate my leadership story in a way that truly resonated with top-tier companies.",
    bgColor: '#FFF7ED',
  },
  {
    name: 'Vikram Singh',
    role: 'Data Scientist',
    company: 'Amazon',
    avatar: 'VS',
    rating: 5,
    result: 'Landed dream job at FAANG company',
    content: "I had the skills but couldn't get past the screening stage. BrandIt's interview coaching gave me the confidence and frameworks to crack Amazon's notorious interview process on the first try.",
    bgColor: '#F5F3FF',
  },
]

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)

  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length)
  const next = () => setActive((p) => (p + 1) % testimonials.length)

  return (
    <Box sx={{ py: { xs: 10, md: 16 }, backgroundColor: '#fff' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography variant="caption" sx={{ color: brandColors.primary, display: 'block', mb: 1.5, letterSpacing: '0.1em' }}>
              SUCCESS STORIES
            </Typography>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Real Results from Real{' '}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Professionals
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 480, mx: 'auto', color: brandColors.muted }}>
              Don't take our word for it — hear from professionals who transformed their careers with BrandIt.
            </Typography>
          </Box>
        </motion.div>

        {/* Carousel */}
        <Box sx={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Box
                sx={{
                  maxWidth: 700,
                  mx: 'auto',
                  p: { xs: 3, md: 5 },
                  borderRadius: '24px',
                  border: `1px solid ${brandColors.border}`,
                  backgroundColor: '#fff',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
                  textAlign: 'center',
                }}
              >
                {/* Result badge */}
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 2,
                    py: 0.75,
                    borderRadius: '100px',
                    backgroundColor: alpha(brandColors.success, 0.1),
                    mb: 3,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669', fontSize: '0.8rem' }}>
                    {testimonials[active].result}
                  </Typography>
                </Box>

                <Typography
                  variant="h5"
                  sx={{ color: brandColors.text, fontWeight: 400, lineHeight: 1.7, mb: 4, fontStyle: 'italic' }}
                >
                  "{testimonials[active].content}"
                </Typography>

                <Rating value={testimonials[active].rating} readOnly size="small" sx={{ mb: 2.5 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: alpha(brandColors.primary, 0.15),
                      color: brandColors.primary,
                      fontWeight: 700,
                    }}
                  >
                    {testimonials[active].avatar}
                  </Avatar>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.text }}>
                      {testimonials[active].name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>
                      {testimonials[active].role} · {testimonials[active].company}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 4 }}>
            <IconButton onClick={prev} aria-label="Previous testimonial" sx={{ border: `1px solid ${brandColors.border}`, borderRadius: '12px' }}>
              <FiChevronLeft size={20} />
            </IconButton>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {testimonials.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setActive(i)}
                  sx={{
                    width: i === active ? 24 : 8,
                    height: 8,
                    borderRadius: '4px',
                    backgroundColor: i === active ? brandColors.primary : brandColors.border,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
            <IconButton onClick={next} aria-label="Next testimonial" sx={{ border: `1px solid ${brandColors.border}`, borderRadius: '12px' }}>
              <FiChevronRight size={20} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
