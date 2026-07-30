import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Box, Typography, Button, Container, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { FiChevronDown, FiAlertCircle } from 'react-icons/fi'
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
                p: { xs: 4, sm: 5 },
                borderRadius: '24px',
                border: `1px solid ${brandColors.border}`,
                backgroundColor: '#fff',
                boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
              }}
            >
              <Box sx={{ color: '#EF4444', mb: 2, display: 'flex', justifyContent: 'center' }}>
                <FiAlertCircle size={48} />
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 800, color: brandColors.text, mb: 1 }}>
                Something went wrong
              </Typography>
              <Typography variant="body1" sx={{ color: brandColors.muted, mb: 3, lineHeight: 1.6 }}>
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
                  mb: 3,
                }}
              >
                Clear Cache & Reload App
              </Button>

              {/* Developer Technical Details Accordion */}
              {this.state.error && (
                <Accordion sx={{ borderRadius: '12px !important', boxShadow: 'none', border: `1px solid ${brandColors.border}`, textAlign: 'left' }}>
                  <AccordionSummary expandIcon={<FiChevronDown />}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.muted }}>
                      Technical Details (Developer View)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#EF4444', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {this.state.error.toString()}
                      {'\n\n'}
                      {this.state.error.stack}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          </Container>
        </Box>
      )
    }

    return this.props.children
  }
}
