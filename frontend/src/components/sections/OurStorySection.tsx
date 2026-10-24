import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  alpha,
  Stack,
  Dialog,
  IconButton,
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  FiAward,
  FiMaximize2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import { brandColors } from '../../theme'

interface StoryPhoto {
  src: string
  title: string
  subtitle: string
  tag: string
  tagColor: string
  description: string
}

const storyPhotos: StoryPhoto[] = [
  {
    src: '/assets/story/campus-team-full.jpg',
    title: 'The Founding Team on Campus',
    subtitle: 'Where the BrandIt journey officially kicked off',
    tag: 'Ground Zero',
    tagColor: '#0A66C2',
    description:
      'We set up our first official stall right under the trees on campus, armed with our blue BrandIt banner, printed frameworks, and a laptop to conduct live profile reviews.',
  },
  {
    src: '/assets/story/campus-event-night.jpg',
    title: 'Electric Day-to-Night Campus Buzz',
    subtitle: 'Students crowded under fairy lights till late evening',
    tag: 'Community Energy',
    tagColor: '#8B5CF6',
    description:
      'What began as an afternoon booth turned into a buzzing evening hub. Students gathered under warm fairy lights to discuss placement anxieties, career goals, and resume positioning.',
  },
  {
    src: '/assets/story/campus-stall-day.jpg',
    title: 'Pushups, Tongue-Twisters & Big Discounts',
    subtitle: 'Making personal branding interactive, energetic & fun',
    tag: 'Campus Challenges',
    tagColor: '#F59E0B',
    description:
      'We broke the traditional serious career vibe with physical and mental challenges: boys crushed 30 pushups and girls aced tongue-twisters to win up to 50% off our packages!',
  },
  {
    src: '/assets/story/campus-stall-1.jpg',
    title: 'Live On-The-Spot Profile Audits',
    subtitle: 'Demonstrating immediate impact right on our laptop',
    tag: 'Live Demos',
    tagColor: '#10B981',
    description:
      'We pulled up students’ actual LinkedIn profiles and resumes live at the booth, pinpointing missing keywords, weak headlines, and immediate fixes on the spot.',
  },
]

export default function OurStorySection() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null)

  const handleOpenPhoto = (idx: number) => {
    setActivePhotoIndex(idx)
  }

  const handleClosePhoto = () => {
    setActivePhotoIndex(null)
  }

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + storyPhotos.length) % storyPhotos.length)
    }
  }

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % storyPhotos.length)
    }
  }

  return (
    <Box
      id="our-story"
      sx={{
        py: { xs: 8, md: 14 },
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        borderTop: `1px solid ${brandColors.border}`,
        borderBottom: `1px solid ${brandColors.border}`,
      }}
    >
      {/* Background radial glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: { xs: 300, md: 550 },
          height: { xs: 300, md: 550 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(brandColors.primary, 0.06)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: { xs: 260, md: 450 },
          height: { xs: 260, md: 450 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#8B5CF6', 0.05)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Chip
              icon={<FiAward size={14} color={brandColors.primary} />}
              label="OUR STORY & CAMPUS ROOTS"
              sx={{
                mb: 2,
                backgroundColor: alpha(brandColors.primary, 0.08),
                color: brandColors.primary,
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                px: 1,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.9rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 800,
                color: brandColors.text,
                lineHeight: 1.2,
                mb: 2,
                maxWidth: 820,
                mx: 'auto',
              }}
            >
              Where It All Began:{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #0A66C2 0%, #2563EB 50%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                The Campus Stall
              </Box>{' '}
              That Sparked BrandIt
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: brandColors.muted,
                maxWidth: 720,
                mx: 'auto',
                fontSize: { xs: '0.95rem', md: '1.08rem' },
                lineHeight: 1.8,
              }}
            >
              Before helping professionals unlock high-impact career opportunities nationwide, BrandIt
              started on our university campus with a table, fairy lights, energetic challenges, and an
              unshakable mission: <em>making LinkedIn personal branding accessible, authentic, and fun.</em>
            </Typography>
          </motion.div>
        </Box>

        {/* Interactive Photo Showcase */}
        <Box>
          <Grid container spacing={3}>
            {storyPhotos.map((photo, idx) => (
              <Grid item xs={12} sm={6} md={3} key={photo.src}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Box
                    onClick={() => handleOpenPhoto(idx)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                      border: `1px solid ${brandColors.border}`,
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
                      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      '&:hover': {
                        borderColor: alpha(brandColors.primary, 0.4),
                        boxShadow: `0 16px 36px ${alpha(brandColors.primary, 0.14)}`,
                        '& .story-img': {
                          transform: 'scale(1.06)',
                        },
                        '& .expand-btn': {
                          opacity: 1,
                          transform: 'translate(-50%, -50%) scale(1)',
                        },
                      },
                    }}
                  >
                    {/* Image Container */}
                    <Box
                      sx={{
                        position: 'relative',
                        height: { xs: 260, sm: 280, md: 320 },
                        overflow: 'hidden',
                        backgroundColor: '#F1F5F9',
                      }}
                    >
                      <Box
                        component="img"
                        className="story-img"
                        src={photo.src}
                        alt={photo.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: idx === 1 ? 'center 40%' : 'center top',
                          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                          display: 'block',
                        }}
                      />

                      {/* Floating Category Badge */}
                      <Chip
                        label={photo.tag}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          backgroundColor: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(8px)',
                          color: photo.tagColor,
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: `1px solid ${alpha(photo.tagColor, 0.2)}`,
                        }}
                      />

                      {/* Expand Overlay Button */}
                      <Box
                        className="expand-btn"
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%) scale(0.8)',
                          opacity: 0,
                          transition: 'all 0.3s ease',
                          width: 46,
                          height: 46,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(15, 23, 42, 0.75)',
                          backdropFilter: 'blur(6px)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                        }}
                      >
                        <FiMaximize2 size={18} />
                      </Box>
                    </Box>

                    {/* Card Description */}
                    <Box sx={{ p: 2.2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.98rem',
                          color: brandColors.text,
                          lineHeight: 1.35,
                          mb: 0.6,
                        }}
                      >
                        {photo.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: brandColors.muted,
                          lineHeight: 1.5,
                          fontSize: '0.8rem',
                          display: 'block',
                        }}
                      >
                        {photo.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Lightbox Modal for Photo Inspection */}
      <Dialog
        open={activePhotoIndex !== null}
        onClose={handleClosePhoto}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundColor: '#0F172A',
            color: '#fff',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            position: 'relative',
          },
        }}
      >
        {activePhotoIndex !== null && (
          <Box sx={{ position: 'relative' }}>
            {/* Close Button */}
            <IconButton
              onClick={handleClosePhoto}
              sx={{
                position: 'absolute',
                top: 14,
                right: 14,
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.85)' },
              }}
            >
              <FiX size={20} />
            </IconButton>

            {/* Navigation buttons */}
            <IconButton
              onClick={handlePrevPhoto}
              sx={{
                position: 'absolute',
                left: 14,
                top: '45%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.85)' },
              }}
            >
              <FiChevronLeft size={24} />
            </IconButton>
            <IconButton
              onClick={handleNextPhoto}
              sx={{
                position: 'absolute',
                right: 14,
                top: '45%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.85)' },
              }}
            >
              <FiChevronRight size={24} />
            </IconButton>

            {/* Modal Image */}
            <Box
              sx={{
                maxHeight: { xs: '55vh', md: '70vh' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#020617',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={storyPhotos[activePhotoIndex].src}
                alt={storyPhotos[activePhotoIndex].title}
                sx={{
                  maxWidth: '100%',
                  maxHeight: { xs: '55vh', md: '70vh' },
                  objectFit: 'contain',
                }}
              />
            </Box>

            {/* Modal Caption */}
            <Box sx={{ p: { xs: 2.5, sm: 3.5 }, backgroundColor: '#0F172A' }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                <Chip
                  label={storyPhotos[activePhotoIndex].tag}
                  size="small"
                  sx={{
                    backgroundColor: alpha(storyPhotos[activePhotoIndex].tagColor, 0.2),
                    color: '#fff',
                    fontWeight: 700,
                  }}
                />
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Photo {activePhotoIndex + 1} of {storyPhotos.length}
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#fff' }}>
                {storyPhotos[activePhotoIndex].title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#CBD5E1', lineHeight: 1.7 }}>
                {storyPhotos[activePhotoIndex].description}
              </Typography>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  )
}
