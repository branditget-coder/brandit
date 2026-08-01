import { useState, useMemo, useEffect } from 'react'
import {
  Box, Container, Typography, Grid, Paper, Chip, Button, InputAdornment, TextField,
  Stack, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, alpha, Divider,
  Snackbar, Alert
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  FiSearch, FiClock, FiArrowRight, FiX, FiShare2, FiBookOpen,
  FiTrendingUp, FiBriefcase, FiFeather, FiCheckCircle, FiCheck
} from 'react-icons/fi'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'

interface BlogPost {
  id: string
  title: string
  category: 'LinkedIn Tips' | 'Interview Q&A' | 'Viral Posts' | 'Entrepreneurship'
  categoryKey: string
  readTime: string
  date: string
  author: {
    name: string
    role: string
    avatar: string
  }
  excerpt: string
  coverGradient: string
  accentColor: string
  content: {
    intro: string
    takeaways: string[]
    sections: {
      title: string
      body: string
      bullets?: string[]
    }[]
  }
}

const blogPosts: BlogPost[] = [
  {
    id: 'linkedin-algorithm-2026',
    title: 'The 2026 LinkedIn Algorithm Playbook: How Executive Accounts Gain 300% Reach',
    category: 'LinkedIn Tips',
    categoryKey: 'linkedin',
    readTime: '6 min read',
    date: 'July 28, 2026',
    author: {
      name: 'Hritika Seth',
      role: 'LinkedIn Manager & Consultant',
      avatar: '/assets/team/hritika.jpg',
    },
    excerpt: 'Discover the exact post structures, comment timing ratios, and visual carousel formats that top tech leaders and consultants use to dominate B2B feeds.',
    coverGradient: 'linear-gradient(135deg, #0A66C2 0%, #1E3A8A 100%)',
    accentColor: '#0A66C2',
    content: {
      intro: 'The LinkedIn feed algorithm has undergone a major shift toward high-relevance niche authority and dwell-time optimization. Accounts that post generic corporate announcements are losing visibility, while founders and leaders using structured storytelling are capturing massive mindshare.',
      takeaways: [
        'Dwell time is the #1 metric: Carousels (PDFs) generate 4x longer session engagement.',
        'The First 60 Minutes: Early comments from industry peers boost distribution by 250%.',
        'Headline Indexing: Rich keyword density in your headline doubles profile search appearances.',
      ],
      sections: [
        {
          title: '1. The 3-Line Hook Masterclass',
          body: 'Users scroll past 90% of content in under 2 seconds. Your first 3 lines are the make-or-break filter determining whether they click "See More".',
          bullets: [
            'Pattern Interrupt: Start with a bold counter-intuitive stat or story hook.',
            'Line Breaks: Never bundle more than 15 words into line 1. Keep white space generous.',
            'Curiosity Gap: Hint at a solution without giving away the full framework in line 1.',
          ],
        },
        {
          title: '2. Carousel Posts (PDFs) vs Text+Image',
          body: 'Document posts (PDF carousels) consistently outperform single static images on LinkedIn. Aim for 6-10 slide decks with high typography contrast and clean 1:1 square dimensions.',
        },
        {
          title: '3. The Outbound Comment Strategy',
          body: 'Posting content is only 50% of the equation. To trigger algorithmic velocity, drop 10 insightful, value-add comments on top voice profiles in your domain immediately before publishing your own post.',
        },
      ],
    },
  },
  {
    id: 'executive-interview-qna',
    title: 'Mastering Executive Leadership Interviews: Top 10 High-Stakes Questions & Frameworks',
    category: 'Interview Q&A',
    categoryKey: 'interview',
    readTime: '8 min read',
    date: 'July 25, 2026',
    author: {
      name: 'Raghav Dhir',
      role: 'Lead Tech Strategist',
      avatar: '/assets/team/raghav.jpg',
    },
    excerpt: 'How to answer situational leadership questions, explain strategic pivots, and negotiate top-tier compensation using the STAR-E (Evidence) framework.',
    coverGradient: 'linear-gradient(135deg, #10B981 0%, #065F46 100%)',
    accentColor: '#10B981',
    content: {
      intro: 'Landing high-stakes senior management and executive roles requires more than technical competency. Interviewers are testing your strategic vision, emotional intelligence under crisis, and your personal leadership brand.',
      takeaways: [
        'Use STAR-E (Situation, Task, Action, Result + Evidence): Quantify every impact with concrete revenue, team growth, or ROI metrics.',
        'Reframing Failure: Structure mistake scenarios around organizational learning and systematic process upgrades.',
        'Compensation Alignment: Postpone salary numbers until executive value is firmly established in final round interviews.',
      ],
      sections: [
        {
          title: 'Q1: "Tell me about a time you led a team through a high-risk strategic pivot."',
          body: 'Focus on communication clarity, team alignment, and risk mitigation tactics rather than just technical execution.',
          bullets: [
            'Outline the market trigger that necessitated the pivot.',
            'Explain how you addressed team friction and maintained morale.',
            'Highlight the final outcome with percentage metrics (e.g. 40% reduction in burn rate).',
          ],
        },
        {
          title: 'Q2: "How do you align cross-functional engineering, product, and sales teams?"',
          body: 'Demonstrate cross-department empathy and unified metrics. Show that you speak the financial language of executives as well as technical depth.',
        },
      ],
    },
  },
  {
    id: 'viral-post-copywriting-hooks',
    title: '15 High-Converting Hook Formulas That Generated 1M+ Organic Impressions',
    category: 'Viral Posts',
    categoryKey: 'posts',
    readTime: '5 min read',
    date: 'July 20, 2026',
    author: {
      name: 'Kritika Dhawan',
      role: 'Customer Outreach & Operations',
      avatar: '/assets/team/kritika.jpg',
    },
    excerpt: 'Stop writing boring intros. Use these 15 battle-tested copywriting templates to skyrocket your "See More" click rates on LinkedIn and Twitter.',
    coverGradient: 'linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)',
    accentColor: '#8B5CF6',
    content: {
      intro: 'Copywriting is the multiplier of personal branding. A brilliant business insight wrapped in a dull opening sentence will get 500 impressions, while the same insight preceded by a high-curiosity hook will reach 50,000 readers.',
      takeaways: [
        'Curiosity over clarity in line 1: Make readers pause their scroll.',
        'Vulnerability + Authority: Combine personal vulnerability with actionable frameworks.',
        'Formatting: Use bullet emojis and short line breaks to maximize readability on mobile devices.',
      ],
      sections: [
        {
          title: 'The 3 Highest-Performing Hook Types',
          body: 'Here are 3 evergreen hook formulas you can adapt immediately:',
          bullets: [
            'The Contrarian Stat: "90% of founders fail at [X]. Here is the 1 habit that separates the top 10%:"',
            'The Time-Wasted Reset: "I spent 5 years making [Mistake]. Here is the 3-step checklist to avoid it:"',
            'The Unspoken Truth: "Unpopular opinion: [Industry Best Practice] is actually costing you [Problem]. Here is why:"',
          ],
        },
      ],
    },
  },
  {
    id: 'entrepreneurship-personal-branding',
    title: 'Zero to 1 Personal Branding for Tech Founders: Building In Public Without Noise',
    category: 'Entrepreneurship',
    categoryKey: 'entrepreneurship',
    readTime: '7 min read',
    date: 'July 15, 2026',
    author: {
      name: 'Stuti Sharma',
      role: 'Human Resource & Growth',
      avatar: '/assets/team/stuti.jpg',
    },
    excerpt: 'Why founders who build personal brands close 3x more enterprise deals, attract top 1% talent, and raise capital faster.',
    coverGradient: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
    accentColor: '#F59E0B',
    content: {
      intro: 'Modern buyers buy from people, not anonymous logos. For early-stage and growth-phase founders, an authoritative personal brand is the highest leverage distribution channel available.',
      takeaways: [
        'Trust Transfer: Personal profile trust transfers directly to enterprise product credibility.',
        'Talent Magnet: Top-tier engineers and operators reach out directly to authentic founders.',
        'Investor Warm Leads: VCs follow active founder updates long before formal pitch decks.',
      ],
      sections: [
        {
          title: 'The Founder Content Engine',
          body: 'You do not need to spend hours writing posts daily. Convert your existing customer calls, product releases, and hiring challenges into authentic post updates.',
          bullets: [
            'Document, Don’t Create: Share actual business lessons and real metrics.',
            'Show Behind-the-Scenes: Photos of team brainstorming and product teardowns.',
            'Direct Call-to-Action: Pin your high-ticket booking link to your profile Featured section.',
          ],
        },
      ],
    },
  },
]

export default function BlogPage() {
  const [searchParams] = useSearchParams()
  const categoryFilterParam = searchParams.get('category') || 'all'

  const [activeCategory, setActiveCategory] = useState<string>(categoryFilterParam)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null)
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState('')

  useEffect(() => {
    const articleId = searchParams.get('article')
    if (articleId) {
      const found = blogPosts.find((p) => p.id === articleId)
      if (found) {
        setSelectedArticle(found)
      }
    }
  }, [searchParams])

  const handleShareArticle = async (post: BlogPost, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    const shareUrl = `${window.location.origin}/blog?article=${post.id}`
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: shareUrl,
    }

    let sharedViaNative = false
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
        sharedViaNative = true
      } catch (err) {
        // User cancelled share dialog or native share not allowed
      }
    }

    if (!sharedViaNative) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl)
        } else {
          const dummy = document.createElement('input')
          document.body.appendChild(dummy)
          dummy.value = shareUrl
          dummy.select()
          document.execCommand('copy')
          document.body.removeChild(dummy)
        }
        setCopiedArticleId(post.id)
        setSnackbarMsg('Article link copied to clipboard!')
        setSnackbarOpen(true)
        setTimeout(() => setCopiedArticleId(null), 2500)
      } catch (err) {
        setSnackbarMsg('Failed to copy article link.')
        setSnackbarOpen(true)
      }
    }
  }

  const categories = [
    { label: 'All Articles', key: 'all', icon: FiBookOpen },
    { label: 'LinkedIn Tips & Growth', key: 'linkedin', icon: FiTrendingUp },
    { label: 'Interview Q&A Guide', key: 'interview', icon: FiBriefcase },
    { label: 'Viral Posts & Copywriting', key: 'posts', icon: FiFeather },
    { label: 'Entrepreneurship & Founders', key: 'entrepreneurship', icon: FiCheckCircle },
  ]

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = activeCategory === 'all' || post.categoryKey === activeCategory
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#FAFAFC', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        {/* Header & Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: 6 }}>
            <Chip
              label="BRANDIT INSIGHTS & PLAYBOOKS"
              sx={{
                mb: 2,
                backgroundColor: alpha(brandColors.primary, 0.1),
                color: brandColors.primary,
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
              }}
            />
            <Typography variant="h2" sx={{ fontWeight: 800, color: brandColors.text, mb: 1.5, fontSize: { xs: '2.2rem', md: '3rem' } }}>
              Executive Branding & Growth Articles
            </Typography>
            <Typography variant="body1" sx={{ color: brandColors.muted, fontSize: '1.1rem', lineHeight: 1.6 }}>
              Actionable guides on LinkedIn algorithm strategies, high-stakes interview Q&As, viral copywriting frameworks, and founder positioning.
            </Typography>
          </Box>
        </motion.div>

        {/* Search & Category Tabs */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <TextField
              size="medium"
              placeholder="Search guides by keywords (e.g. LinkedIn, Interview, Hooks...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch color={brandColors.primary} size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: '100%', sm: 520 },
                backgroundColor: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                '& .MuiOutlinedInput-root': { borderRadius: '16px', border: `1px solid ${brandColors.border}` },
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1.5}>
            {categories.map((cat) => {
              const active = activeCategory === cat.key
              return (
                <Button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  startIcon={<cat.icon size={16} />}
                  sx={{
                    borderRadius: '14px',
                    px: 2.5,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    backgroundColor: active ? brandColors.primary : '#FFFFFF',
                    color: active ? '#FFFFFF' : brandColors.text,
                    border: `1px solid ${active ? brandColors.primary : brandColors.border}`,
                    boxShadow: active ? '0 4px 16px rgba(10, 102, 194, 0.25)' : 'none',
                    '&:hover': {
                      backgroundColor: active ? brandColors.primary : alpha(brandColors.primary, 0.06),
                      borderColor: brandColors.primary,
                    },
                  }}
                >
                  {cat.label}
                </Button>
              )
            })}
          </Stack>
        </Box>

        {/* Blog Cards Grid */}
        {filteredPosts.length === 0 ? (
          <Box sx={{ textCenter: 'center', py: 8, px: 3, backgroundColor: '#fff', borderRadius: '24px', border: `1px dashed ${brandColors.border}` }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.text, mb: 1 }}>
              No guides found for "{searchQuery}"
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.muted }}>
              Try searching for terms like "LinkedIn", "Hooks", "Interview", or reset the category filter.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredPosts.map((post, i) => (
              <Grid item xs={12} md={6} key={post.id}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Paper
                    sx={{
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: `1px solid ${brandColors.border}`,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 16px 40px rgba(10, 102, 194, 0.12)',
                        borderColor: alpha(post.accentColor, 0.4),
                      },
                    }}
                  >
                    {/* Modern Top Header Accent */}
                    <Box
                      sx={{
                        p: 3,
                        background: post.coverGradient,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                      }}
                    >
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{ backgroundColor: 'rgba(255,255,255,0.22)', color: '#fff', fontWeight: 800, fontSize: '0.75rem', backdropFilter: 'blur(4px)' }}
                      />
                      <Stack direction="row" spacing={0.8} alignItems="center" sx={{ opacity: 0.9 }}>
                        <FiClock size={14} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {post.readTime}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Body Content */}
                    <Box sx={{ p: 3.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text, mb: 1.5, lineHeight: 1.35 }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.65, mb: 3 }}>
                          {post.excerpt}
                        </Typography>
                      </Box>

                      <Box sx={{ pt: 2, borderTop: `1px solid ${brandColors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Author */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={post.author.avatar} sx={{ width: 38, height: 38, border: `2px solid ${alpha(post.accentColor, 0.3)}` }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text, fontSize: '0.85rem' }}>
                              {post.author.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: brandColors.muted, display: 'block', fontSize: '0.75rem' }}>
                              {post.date}
                            </Typography>
                          </Box>
                        </Box>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconButton
                            onClick={(e) => handleShareArticle(post, e)}
                            size="small"
                            title="Share Article"
                            sx={{
                              color: copiedArticleId === post.id ? '#10B981' : brandColors.muted,
                              '&:hover': { color: post.accentColor, backgroundColor: alpha(post.accentColor, 0.08) },
                            }}
                          >
                            {copiedArticleId === post.id ? <FiCheck size={18} /> : <FiShare2 size={18} />}
                          </IconButton>
                          <Button
                            variant="text"
                            onClick={() => setSelectedArticle(post)}
                            endIcon={<FiArrowRight size={16} />}
                            sx={{
                              color: post.accentColor,
                              fontWeight: 800,
                              textTransform: 'none',
                              fontSize: '0.9rem',
                              '&:hover': { backgroundColor: alpha(post.accentColor, 0.08) },
                            }}
                          >
                            Read Article
                          </Button>
                        </Stack>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* CTA Card at Bottom */}
        <Paper
          sx={{
            mt: 8,
            p: { xs: 4, md: 6 },
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E3E8A 60%, #2563EB 100%)',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(15, 23, 42, 0.3)',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, color: '#fff !important' }}>
            Ready to Build Your Executive Digital Brand?
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 640, mx: 'auto', mb: 3.5, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Book a 1-on-1 personal branding strategy session with BrandIt experts to optimize your profile, content framework, and executive positioning.
          </Typography>
          <Button
            component={RouterLink}
            to="/book"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#fff',
              color: brandColors.primary,
              fontWeight: 800,
              borderRadius: '14px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#F8FAFC' },
            }}
          >
            Book Strategy Call (₹99)
          </Button>
        </Paper>

        {/* Full Article Reader Modal */}
        <Dialog
          open={Boolean(selectedArticle)}
          onClose={() => setSelectedArticle(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '28px', p: { xs: 1, sm: 2 } },
          }}
        >
          {selectedArticle && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Chip
                    label={selectedArticle.category}
                    size="small"
                    sx={{ backgroundColor: alpha(selectedArticle.accentColor, 0.12), color: selectedArticle.accentColor, fontWeight: 800 }}
                  />
                  <IconButton onClick={() => setSelectedArticle(null)} size="small">
                    <FiX size={20} />
                  </IconButton>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: brandColors.text, lineHeight: 1.3 }}>
                  {selectedArticle.title}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                  <Avatar src={selectedArticle.author.avatar} sx={{ width: 42, height: 42 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.text }}>
                      {selectedArticle.author.name} • <span style={{ color: brandColors.muted, fontWeight: 500 }}>{selectedArticle.author.role}</span>
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.muted }}>
                      Published on {selectedArticle.date} • {selectedArticle.readTime}
                    </Typography>
                  </Box>
                </Stack>
              </DialogTitle>

              <DialogContent dividers sx={{ py: 3 }}>
                <Typography variant="body1" sx={{ color: brandColors.text, fontSize: '1.05rem', lineHeight: 1.7, mb: 3.5, fontWeight: 500 }}>
                  {selectedArticle.content.intro}
                </Typography>

                {/* Key Takeaways Callout Box */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: '16px',
                    backgroundColor: alpha(selectedArticle.accentColor, 0.05),
                    border: `1px solid ${alpha(selectedArticle.accentColor, 0.2)}`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, color: selectedArticle.accentColor, mb: 1.5 }}>
                    💡 Executive Takeaways
                  </Typography>
                  <Stack spacing={1}>
                    {selectedArticle.content.takeaways.map((point, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <FiCheckCircle size={18} color={selectedArticle.accentColor} style={{ marginTop: 2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: brandColors.text, fontWeight: 600, lineHeight: 1.6 }}>
                          {point}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                {/* Sections */}
                <Stack spacing={3}>
                  {selectedArticle.content.sections.map((sec, idx) => (
                    <Box key={idx}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.text, mb: 1.5 }}>
                        {sec.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: brandColors.text, lineHeight: 1.7, mb: 2 }}>
                        {sec.body}
                      </Typography>
                      {sec.bullets && (
                        <Stack spacing={1} sx={{ pl: 2 }}>
                          {sec.bullets.map((b, bIdx) => (
                            <Typography key={bIdx} variant="body2" sx={{ color: brandColors.muted, lineHeight: 1.6 }}>
                              • {b}
                            </Typography>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  ))}
                </Stack>
              </DialogContent>

              <DialogActions sx={{ pt: 2, px: 3, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Button
                  startIcon={copiedArticleId === selectedArticle.id ? <FiCheck color="#10B981" /> : <FiShare2 />}
                  onClick={(e) => handleShareArticle(selectedArticle, e)}
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: copiedArticleId === selectedArticle.id ? '#10B981' : brandColors.muted,
                    fontWeight: 700,
                    '&:hover': { backgroundColor: alpha(brandColors.primary, 0.08) },
                  }}
                >
                  {copiedArticleId === selectedArticle.id ? 'Link Copied!' : 'Share Article'}
                </Button>
                <Button
                  component={RouterLink}
                  to="/book"
                  variant="contained"
                  sx={{ borderRadius: '12px', fontWeight: 700, textTransform: 'none', px: 3 }}
                >
                  Book 1-on-1 Strategy Session
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Share Toast Notification */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}
