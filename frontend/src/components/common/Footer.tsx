import { Box, Container, Grid, Typography, Link, IconButton, Divider, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { FiLinkedin, FiInstagram, FiMail, FiPhone } from 'react-icons/fi'
import { brandColors } from '../../theme'
import BrandLogo from './BrandLogo'

const footerLinks = {
  Services: [
    { label: 'Profile Setup & Advice (₹99)', href: '/services#setup-advice' },
    { label: 'Profile Setup + Branding (₹320/mo)', href: '/services#branding-basic' },
    { label: 'Branding + Network Growth (₹400/mo)', href: '/services#branding-network' },
    { label: 'LinkedIn Consulting (₹250/mo)', href: '/services#linkedin-consulting' },
  ],
  'Blogs & Guides': [
    { label: 'LinkedIn Tips & Growth', href: '/blogs?category=linkedin' },
    { label: 'Interview Q&A Guide', href: '/blogs?category=interview' },
    { label: 'Viral Posts & Copywriting', href: '/blogs?category=posts' },
    { label: 'Entrepreneurship & Founders', href: '/blogs?category=entrepreneurship' },
    { label: 'All Articles & Guides', href: '/blogs' },
  ],
  Company: [
    { label: 'About Us & Team', href: '/about' },
    { label: 'Our Process', href: '/about#process' },
    { label: 'Pricing & Plans', href: '/pricing' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Non-Refundable Policy', href: '/refund' },
  ],
}

const socials = [
  { icon: FiLinkedin, href: 'https://www.linkedin.com/in/brandit-team/', label: 'LinkedIn' },
  { icon: FiInstagram, href: 'https://www.instagram.com/brandit.team', label: 'Instagram' },
]

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: brandColors.dark,
        color: '#E5E7EB',
        pt: { xs: 8, md: 12 },
        pb: { xs: 4, md: 6 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 4 }}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <BrandLogo variant="light" size="large" showSlogan={true} />
              <Typography variant="body2" sx={{ color: '#9CA3AF', lineHeight: 1.7, maxWidth: 340, mt: 1.5 }}>
                Professional personal branding, LinkedIn growth, and career consulting for job seekers and industry leaders.
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FiMail size={15} color={brandColors.primary} />
                <Link
                  href="mailto:brandit.get@gmail.com"
                  underline="hover"
                  sx={{ color: '#9CA3AF', fontSize: '0.875rem', '&:hover': { color: brandColors.primary } }}
                >
                  brandit.get@gmail.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <FiPhone size={15} color={brandColors.primary} style={{ marginTop: 3 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                    <strong>Hritika Seth</strong> (Consultant):{' '}
                    <Link href="tel:+918708231539" underline="hover" sx={{ color: '#9CA3AF', '&:hover': { color: brandColors.primary } }}>
                      +91 8708231539
                    </Link>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9CA3AF', mt: 0.5 }}>
                    <strong>Kritika Dhawan</strong> (Operations):{' '}
                    <Link href="tel:+916284318951" underline="hover" sx={{ color: '#9CA3AF', '&:hover': { color: brandColors.primary } }}>
                      +91 6284318951
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {socials.map((s) => (
                <IconButton
                  key={s.label}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  size="small"
                  sx={{
                    color: '#9CA3AF',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    width: 38,
                    height: 38,
                    '&:hover': {
                      color: '#fff',
                      borderColor: brandColors.primary,
                      backgroundColor: `${brandColors.primary}20`,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <s.icon size={16} />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid item xs={6} sm={3} md={2} key={title}>
              <Typography
                variant="caption"
                sx={{ color: '#6B7280', display: 'block', mb: 2.5, letterSpacing: '0.08em', fontWeight: 700 }}
              >
                {title.toUpperCase()}
              </Typography>
              <Stack spacing={1.5}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    component={RouterLink}
                    to={link.href}
                    onClick={() => {
                      if (!link.href.includes('#')) {
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
                      }
                    }}
                    underline="none"
                    sx={{
                      color: '#9CA3AF',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      transition: 'color 0.2s ease',
                      '&:hover': { color: '#fff' },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mt: 8, mb: 4 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            © {new Date().getFullYear()} BrandIt. All rights reserved. All transactions are non-refundable.
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Elevate your digital footprint with BrandIt.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
