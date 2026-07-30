import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Box, Typography, Button, Container } from '@mui/material'
import { brandColors } from '../../theme'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo)
  }

  private handleReset = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: brandColors.background,
            p: 3,
          }}
        >
          <Container maxWidth="sm">
            <Box
              sx={{
                textAlign: 'center',
                p: { xs: 4, sm: 6 },
                borderRadius: '24px',
                border: `1px solid ${brandColors.border}`,
                backgroundColor: '#fff',
                boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 800, color: brandColors.text, mb: 2 }}>
                Something went wrong
              </Typography>
              <Typography variant="body1" sx={{ color: brandColors.muted, mb: 4, lineHeight: 1.6 }}>
                An unexpected display error occurred. Clearing your session cache will restore full access immediately.
              </Typography>
              <Button
                variant="contained"
                onClick={this.handleReset}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '12px',
                  fontWeight: 700,
                  textTransform: 'none',
                  backgroundColor: brandColors.primary,
                }}
              >
                Clear Cache & Reload App
              </Button>
            </Box>
          </Container>
        </Box>
      )
    }

    return this.props.children
  }
}
