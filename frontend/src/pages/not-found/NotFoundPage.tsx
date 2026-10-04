import React, { useState } from 'react'
import { Box, Container, Typography, Button, Chip, Stack, alpha } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiCompass, FiArrowLeft, FiHeart } from 'react-icons/fi'
import { FaPaw, FaBone } from 'react-icons/fa'
import { brandColors } from '../../theme'
import detectiveDogImg from '../../assets/detective-dog-404.jpg'

interface Particle {
  id: number
  x: number
  emoji: string
}

export default function NotFoundPage() {
  const [treats, setTreats] = useState<number>(0)
  const [dogMoodIndex, setDogMoodIndex] = useState<number>(0)
  const [particles, setParticles] = useState<Particle[]>([])

  const dogBarks = [
    "Woof! I'm on the case, but this page is nowhere to be found! 🔎",
    "Sniff sniff... that tickles! Still looking for that lost URL! 🐾",
    "Tail wagging at maximum speed! You're the best detective partner! 🐕",
    "Ruff! Maybe the cat hid this webpage under the server rack? 🐱",
    "Double treats! My sniffing senses are tingling! 🦴✨",
    "Woof woof! Case solved: you're officially awesome! 🎉",
  ]

  // Play a gentle, cheerful synthesized sound using Web Audio API
  const playPlayfulChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      // Cheerful two-tone 'boop/bark' frequency slide
      osc.frequency.setValueAtTime(480, now)
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.12)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.22)
    } catch {
      // AudioContext autoplay restrictions handled silently
    }
  }

  const handleGiveTreat = () => {
    playPlayfulChime()
    setTreats(prev => prev + 1)
    setDogMoodIndex(prev => (prev + 1) % dogBarks.length)

    // Spawn floating playful particle
    const emojis = ['🦴', '🐾', '❤️', '✨', '🎾']
    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 160,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }
    setParticles(prev => [...prev.slice(-12), newParticle])
  }

  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: brandColors.background,
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative ambient background glows */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(brandColors.primary, 0.12)} 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '8%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#F59E0B', 0.14)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating subtle background paw prints */}
      <Box
        component={motion.div}
        animate={{ y: [-8, 8, -8], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        sx={{ position: 'absolute', top: '12%', right: '15%', opacity: 0.12, color: brandColors.primary, pointerEvents: 'none' }}
      >
        <FaPaw size={54} />
      </Box>
      <Box
        component={motion.div}
        animate={{ y: [8, -8, 8], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        sx={{ position: 'absolute', bottom: '15%', left: '8%', opacity: 0.14, color: brandColors.primary, pointerEvents: 'none' }}
      >
        <FaBone size={48} />
      </Box>

      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <Box
            sx={{
              backgroundColor: alpha('#FFFFFF', 0.92),
              backdropFilter: 'blur(20px)',
              borderRadius: { xs: '24px', md: '32px' },
              border: `1px solid ${brandColors.border}`,
              boxShadow: '0 20px 60px -15px rgba(10, 102, 194, 0.12), 0 10px 30px rgba(0, 0, 0, 0.04)',
              p: { xs: 3.5, sm: 5, md: 6 },
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* Case file badge */}
            <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 3 }}>
              <Chip
                icon={<FaPaw size={13} style={{ color: brandColors.primary }} />}
                label="CASE FILE #404: MISSING WEBPAGE"
                sx={{
                  backgroundColor: alpha(brandColors.primary, 0.08),
                  color: brandColors.primary,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.04em',
                  px: 1,
                  py: 2.2,
                  borderRadius: '999px',
                  border: `1px solid ${alpha(brandColors.primary, 0.2)}`,
                }}
              />
            </Stack>

            {/* Dog Detective Portrait Container */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3.5 }}>
              <motion.div
                animate={{ y: [-5, 6, -5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: 200, sm: 240, md: 270 },
                    height: { xs: 200, sm: 240, md: 270 },
                    mx: 'auto',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    boxShadow: '0 16px 40px -10px rgba(15, 23, 42, 0.22), 0 0 0 6px #FFFFFF, 0 0 0 8px ' + alpha(brandColors.primary, 0.25),
                    backgroundColor: '#FFF',
                    cursor: 'pointer',
                    transition: 'transform 0.25s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                    },
                  }}
                  onClick={handleGiveTreat}
                  title="Click to boop Detective Barnaby!"
                >
                  <Box
                    component="img"
                    src={detectiveDogImg}
                    alt="Curious Golden Retriever Puppy looking directly into your eyes about the missing 404 page"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {/* Watermark overlay chip */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      px: 1.5,
                      py: 0.4,
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.6,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <span>🐶 Barnaby is looking for your page!</span>
                  </Box>
                </Box>
              </motion.div>

              {/* Floating particles emitted on treat/click */}
              <AnimatePresence>
                {particles.map(particle => (
                  <motion.div
                    key={particle.id}
                    initial={{ opacity: 1, y: 0, x: particle.x, scale: 0.6 }}
                    animate={{ opacity: 0, y: -90, scale: 1.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      top: '20%',
                      left: '50%',
                      fontSize: '1.6rem',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  >
                    {particle.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>

            {/* Interactive Speech Bubble */}
            <motion.div
              key={dogMoodIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: 'inline-block',
                  maxWidth: 520,
                  backgroundColor: alpha(brandColors.primary, 0.05),
                  border: `1.5px dashed ${alpha(brandColors.primary, 0.35)}`,
                  borderRadius: '16px',
                  px: { xs: 2.5, sm: 3 },
                  py: 1.5,
                  mb: 3,
                  position: 'relative',
                }}
              >
                <Typography
                  sx={{
                    fontStyle: 'italic',
                    fontSize: { xs: '0.92rem', sm: '1rem' },
                    color: brandColors.dark,
                    fontWeight: 600,
                  }}
                >
                  "{dogBarks[dogMoodIndex]}"
                </Typography>
              </Box>
            </motion.div>

            {/* Error Title and Description */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: brandColors.dark,
                fontSize: { xs: '1.8rem', sm: '2.3rem' },
                lineHeight: 1.2,
                mb: 1.5,
                letterSpacing: '-0.02em',
              }}
            >
              Ruff Day? Page Not Found!
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: brandColors.muted,
                maxWidth: 560,
                mx: 'auto',
                fontSize: { xs: '0.98rem', sm: '1.08rem' },
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              Detective Barnaby inspected every nook and cranny of the server, but this URL seems to have wandered off the leash. Don't worry, we'll guide you back!
            </Typography>

            {/* Interactive Treat Counter & Actions */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              {/* Primary: Back to Home */}
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                size="large"
                startIcon={<FiHome size={18} />}
                sx={{
                  px: 3.5,
                  py: 1.4,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '14px',
                  boxShadow: '0 8px 24px ' + alpha(brandColors.primary, 0.28),
                  minWidth: { xs: '100%', sm: 180 },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 28px ' + alpha(brandColors.primary, 0.38),
                  },
                }}
              >
                Back to Home
              </Button>

              {/* Secondary: Explore Services */}
              <Button
                component={RouterLink}
                to="/services"
                variant="outlined"
                size="large"
                startIcon={<FiCompass size={18} />}
                sx={{
                  px: 3,
                  py: 1.4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '14px',
                  borderColor: brandColors.border,
                  color: brandColors.dark,
                  minWidth: { xs: '100%', sm: 180 },
                  backgroundColor: '#FFFFFF',
                  '&:hover': {
                    borderColor: brandColors.primary,
                    backgroundColor: alpha(brandColors.primary, 0.04),
                    color: brandColors.primary,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Explore Services
              </Button>

              {/* Fun Element: Boop Snoot / Give Treat Button */}
              <Button
                onClick={handleGiveTreat}
                variant="text"
                size="large"
                startIcon={<FaBone size={16} color="#D97706" />}
                sx={{
                  px: 2.5,
                  py: 1.4,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '14px',
                  backgroundColor: alpha('#F59E0B', 0.1),
                  color: '#B45309',
                  border: `1px solid ${alpha('#F59E0B', 0.25)}`,
                  minWidth: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    backgroundColor: alpha('#F59E0B', 0.18),
                    transform: 'scale(1.03)',
                  },
                }}
              >
                {treats === 0 ? '🦴 Boop Barnaby!' : `🦴 Booped ${treats} time${treats > 1 ? 's' : ''}!`}
              </Button>
            </Stack>

            {/* Quick Helper Links */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ pt: 1, borderTop: `1px solid ${alpha(brandColors.border, 0.7)}` }}
            >
              <Typography variant="caption" sx={{ color: brandColors.muted, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                Need help? <RouterLink to="/contact" style={{ color: brandColors.primary, fontWeight: 600, textDecoration: 'none' }}>Contact Support</RouterLink>
              </Typography>
              <Typography variant="caption" sx={{ color: brandColors.muted }}>•</Typography>
              <Typography variant="caption" sx={{ color: brandColors.muted, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <RouterLink to="/" style={{ color: brandColors.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiArrowLeft size={12} /> Return safely
                </RouterLink>
              </Typography>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
