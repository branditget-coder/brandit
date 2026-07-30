import { Box, Typography, alpha } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../../theme'

interface BrandLogoProps {
  variant?: 'light' | 'dark'
  showSlogan?: boolean
  size?: 'small' | 'medium' | 'large'
}

export default function BrandLogo({ variant = 'dark', showSlogan = false, size = 'medium' }: BrandLogoProps) {
  const textColor = variant === 'light' ? '#FFFFFF' : brandColors.text
  const itColor = '#4EA8DE' // Official sky blue from logo

  const fontSizeMap = {
    small: '1.15rem',
    medium: '1.45rem',
    large: '2rem',
  }

  const sloganSizeMap = {
    small: '0.68rem',
    medium: '0.75rem',
    large: '0.875rem',
  }

  return (
    <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Logo Badge Icon matching blue background */}
          <Box
            sx={{
              width: size === 'small' ? 32 : size === 'medium' ? 38 : 48,
              height: size === 'small' ? 32 : size === 'medium' ? 38 : 48,
              borderRadius: '10px',
              backgroundColor: '#0A66C2', // Official BrandIt royal blue background
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(10, 102, 194, 0.25)',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: size === 'small' ? '1.1rem' : size === 'medium' ? '1.3rem' : '1.6rem',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                lineHeight: 1,
                color: '#FFFFFF',
              }}
            >
              B<Box component="span" sx={{ color: '#60A5FA' }}>i</Box>
            </Typography>
          </Box>

          {/* Wordmark: Brand (White/Dark) + it (Sky Blue) */}
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: fontSizeMap[size],
              letterSpacing: '-0.03em',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              lineHeight: 1.1,
              color: textColor,
            }}
          >
            Brand<Box component="span" sx={{ color: itColor, fontWeight: 700 }}>it</Box>
          </Typography>
        </Box>

        {/* Official Slogan */}
        {showSlogan && (
          <Typography
            variant="caption"
            sx={{
              mt: 0.6,
              fontWeight: 600,
              fontSize: sloganSizeMap[size],
              color: variant === 'light' ? alpha('#FFFFFF', 0.75) : brandColors.muted,
              letterSpacing: '0.01em',
            }}
          >
            Your Profile, Your Brand, Your Opportunity
          </Typography>
        )}
      </Box>
    </RouterLink>
  )
}
