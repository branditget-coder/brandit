import { useState } from 'react'
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip,
  TextField, InputAdornment, Tabs, Tab, Avatar, alpha
} from '@mui/material'
import { motion } from 'framer-motion'
import { FiSearch, FiClock, FiArrowRight } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'

const categories = ['All', 'LinkedIn', 'Resume', 'Career', 'Interview', 'Branding', 'Networking']

const posts = [
  { slug: 'linkedin-profile-optimization-2024', title: '10 LinkedIn Profile Mistakes That Cost You Job Offers', category: 'LinkedIn', readTime: '8 min', date: 'Jan 15, 2025', author: 'Arjun Kapoor', avatar: 'AK', excerpt: 'Most professionals are unknowingly sabotaging their LinkedIn profiles. Here are the 10 most common mistakes and exactly how to fix them.' },
  { slug: 'ats-resume-guide', title: 'The Ultimate ATS Resume Guide: Beat the Bots in 2025', category: 'Resume', readTime: '12 min', date: 'Jan 8, 2025', author: 'Priyanka Iyer', avatar: 'PI', excerpt: 'Applicant tracking systems reject 75% of resumes before a human ever sees them. Here\'s how to ensure yours makes it through.' },
  { slug: 'salary-negotiation-tips', title: 'How to Negotiate Your Salary and Get What You Deserve', category: 'Career', readTime: '10 min', date: 'Dec 28, 2024', author: 'Rohan Gupta', avatar: 'RG', excerpt: 'Most professionals leave money on the table by not negotiating. Learn the exact scripts and strategies that work in India\'s job market.' },
  { slug: 'star-method-interview', title: 'Mastering the STAR Method for Behavioral Interviews', category: 'Interview', readTime: '7 min', date: 'Dec 20, 2024', author: 'Rohan Gupta', avatar: 'RG', excerpt: 'The STAR method is the gold standard for behavioral interview answers. Here\'s how to use it to tell compelling stories that land offers.' },
  { slug: 'personal-brand-linkedin', title: 'Building a Personal Brand on LinkedIn: From Zero to Thought Leader', category: 'Branding', readTime: '15 min', date: 'Dec 12, 2024', author: 'Sneha Patel', avatar: 'SP', excerpt: 'A strong personal brand on LinkedIn can transform your career. Here\'s the exact strategy we use with our clients.' },
  { slug: 'networking-strategy', title: 'The Introvert\'s Guide to Professional Networking', category: 'Networking', readTime: '9 min', date: 'Dec 5, 2024', author: 'Arjun Kapoor', avatar: 'AK', excerpt: 'Networking doesn\'t have to feel forced or awkward. Here\'s a framework that works even if you\'re naturally introverted.' },
]

const categoryColors: Record<string, string> = {
  LinkedIn: brandColors.primary,
  Resume: brandColors.success,
  Career: '#F59E0B',
  Interview: '#EC4899',
  Branding: '#7C3AED',
  Networking: '#059669',
}

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState(0)

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = tab === 0 || p.category === categories[tab]
    return matchSearch && matchCat
  })

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: brandColors.background }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="caption" sx={{ color: brandColors.primary, display: 'block', mb: 1.5, letterSpacing: '0.1em' }}>BLOG</Typography>
            <Typography variant="h1" sx={{ mb: 2 }}>
              Career Insights &{' '}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Expert Advice
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, maxWidth: 480, mx: 'auto', mb: 4 }}>
              Actionable career strategies from the BrandIt team. Free, every week.
            </Typography>
            <TextField
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><FiSearch size={18} color={brandColors.muted} /></InputAdornment> }}
              sx={{ maxWidth: 420, width: '100%', '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
            />
          </Box>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 5, '& .MuiTabs-indicator': { backgroundColor: brandColors.primary } }}>
            {categories.map(c => <Tab key={c} label={c} />)}
          </Tabs>
        </motion.div>

        <Grid container spacing={3}>
          {filtered.map((post, i) => (
            <Grid item xs={12} md={6} lg={4} key={post.slug}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}>
                <Box
                  component={RouterLink}
                  to={`/blog/${post.slug}`}
                  sx={{
                    display: 'block', textDecoration: 'none', p: 3.5, borderRadius: '20px',
                    border: `1px solid ${brandColors.border}`, backgroundColor: '#fff', height: '100%',
                    transition: 'box-shadow 0.25s, transform 0.25s',
                    '&:hover': { boxShadow: '0 12px 40px rgba(0,0,0,0.08)', transform: 'translateY(-3px)' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                    <Chip label={post.category} size="small" sx={{ backgroundColor: alpha(categoryColors[post.category] || brandColors.primary, 0.1), color: categoryColors[post.category] || brandColors.primary, fontWeight: 600, fontSize: '0.72rem' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FiClock size={13} color={brandColors.muted} />
                      <Typography variant="caption" sx={{ color: brandColors.muted }}>{post.readTime} read</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1.5, color: brandColors.text, lineHeight: 1.4 }}>{post.title}</Typography>
                  <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.7, mb: 3, fontSize: '0.85rem' }}>{post.excerpt}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(brandColors.primary, 0.1), color: brandColors.primary, fontSize: '0.7rem', fontWeight: 700 }}>{post.avatar}</Avatar>
                      <Typography variant="caption" sx={{ color: brandColors.muted, fontWeight: 500 }}>{post.author}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>{post.date}</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
