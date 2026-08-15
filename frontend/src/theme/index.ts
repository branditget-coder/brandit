import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    muted: Palette['primary'];
    brand: {
      primary: string;
      secondary: string;
      dark: string;
      background: string;
      card: string;
      text: string;
      muted: string;
      border: string;
      success: string;
    };
  }
  interface PaletteOptions {
    muted?: PaletteOptions['primary'];
    brand?: {
      primary: string;
      secondary: string;
      dark: string;
      background: string;
      card: string;
      text: string;
      muted: string;
      border: string;
      success: string;
    };
  }
}

export const brandColors = {
  primary: '#0A66C2',
  secondary: '#2563EB',
  dark: '#0F172A',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  success: '#22C55E',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.primary,
      dark: '#0850A0',
      light: '#2563EB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: brandColors.secondary,
      dark: '#1D4ED8',
      light: '#3B82F6',
      contrastText: '#FFFFFF',
    },
    background: {
      default: brandColors.background,
      paper: brandColors.card,
    },
    text: {
      primary: brandColors.text,
      secondary: brandColors.muted,
    },
    success: {
      main: brandColors.success,
    },
    divider: brandColors.border,
    brand: brandColors,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      lineHeight: 1.12,
      letterSpacing: '-0.035em',
      color: brandColors.text,
    },
    h2: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
      lineHeight: 1.18,
      letterSpacing: '-0.028em',
      color: brandColors.text,
    },
    h3: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      color: brandColors.text,
    },
    h4: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
      lineHeight: 1.35,
      letterSpacing: '-0.015em',
      color: brandColors.text,
    },
    h5: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.45,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontWeight: 400,
      fontSize: '1.025rem',
      lineHeight: 1.7,
      color: brandColors.muted,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.885rem',
      lineHeight: 1.65,
      color: brandColors.muted,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.6,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      textTransform: 'none' as const,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 18,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0,0,0,0.04)',
    '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
    '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
    '0 6px 12px -2px rgba(0,0,0,0.06), 0 3px 6px -3px rgba(0,0,0,0.04)',
    '0 10px 20px -3px rgba(0,0,0,0.07), 0 4px 8px -4px rgba(0,0,0,0.04)',
    '0 12px 24px -4px rgba(0,0,0,0.08), 0 6px 12px -5px rgba(0,0,0,0.04)',
    '0 16px 32px -6px rgba(0,0,0,0.08), 0 8px 16px -6px rgba(0,0,0,0.04)',
    '0 20px 40px -8px rgba(0,0,0,0.09), 0 10px 20px -7px rgba(0,0,0,0.04)',
    '0 24px 48px -10px rgba(0,0,0,0.1), 0 12px 24px -8px rgba(0,0,0,0.05)',
    '0 28px 56px -12px rgba(0,0,0,0.1), 0 14px 28px -9px rgba(0,0,0,0.05)',
    '0 32px 64px -14px rgba(0,0,0,0.11), 0 16px 32px -10px rgba(0,0,0,0.05)',
    '0 36px 72px -16px rgba(0,0,0,0.11), 0 18px 36px -11px rgba(0,0,0,0.05)',
    '0 40px 80px -18px rgba(0,0,0,0.12), 0 20px 40px -12px rgba(0,0,0,0.05)',
    '0 44px 88px -20px rgba(0,0,0,0.12), 0 22px 44px -13px rgba(0,0,0,0.05)',
    '0 48px 96px -22px rgba(0,0,0,0.13), 0 24px 48px -14px rgba(0,0,0,0.06)',
    '0 52px 104px -24px rgba(0,0,0,0.13), 0 26px 52px -15px rgba(0,0,0,0.06)',
    '0 56px 112px -26px rgba(0,0,0,0.14), 0 28px 56px -16px rgba(0,0,0,0.06)',
    '0 60px 120px -28px rgba(0,0,0,0.14), 0 30px 60px -17px rgba(0,0,0,0.06)',
    '0 64px 128px -30px rgba(0,0,0,0.15), 0 32px 64px -18px rgba(0,0,0,0.07)',
    '0 68px 136px -32px rgba(0,0,0,0.15), 0 34px 68px -19px rgba(0,0,0,0.07)',
    '0 72px 144px -34px rgba(0,0,0,0.16), 0 36px 72px -20px rgba(0,0,0,0.07)',
    '0 76px 152px -36px rgba(0,0,0,0.16), 0 38px 76px -21px rgba(0,0,0,0.07)',
    '0 80px 160px -38px rgba(0,0,0,0.17), 0 40px 80px -22px rgba(0,0,0,0.07)',
    '0 84px 168px -40px rgba(0,0,0,0.17), 0 42px 84px -23px rgba(0,0,0,0.08)',
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          backgroundColor: brandColors.background,
          color: brandColors.text,
          fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
          overflowX: 'hidden',
        },
        '::-webkit-scrollbar': {
          width: '6px',
        },
        '::-webkit-scrollbar-track': {
          background: brandColors.background,
        },
        '::-webkit-scrollbar-thumb': {
          background: brandColors.border,
          borderRadius: '3px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: brandColors.muted,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(10, 102, 194, 0.25)',
            transform: 'translateY(-1px)',
          },
        },

        outlined: {
          borderColor: brandColors.border,
          color: brandColors.text,
          '&:hover': {
            borderColor: brandColors.primary,
            backgroundColor: alpha(brandColors.primary, 0.04),
          },
        },
        sizeLarge: {
          padding: '13px 32px',
          fontSize: '1rem',
          borderRadius: 14,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
          border: `1px solid ${brandColors.border}`,
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
          '&:hover': {
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: brandColors.border,
            },
            '&:hover fieldset': {
              borderColor: brandColors.primary,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 20,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: `1px solid ${brandColors.border}`,
          borderRadius: '16px !important',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '0',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
