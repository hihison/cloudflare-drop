import * as React from 'react'
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

interface AppThemeProps {
  children: React.ReactNode
  mode?: 'light' | 'dark' | 'system'
}

// Modern 2025 color palette
const modernColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
}

const getModern2025Theme = (mode: 'light' | 'dark') => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: modernColors.primary[600],
        light: modernColors.primary[400],
        dark: modernColors.primary[800],
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ec4899',
        light: '#f472b6',
        dark: '#be185d',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      background: {
        default: '#0a0e1a',
        paper: alpha('#0f1419', 0.95),
      },
      text: {
        primary: '#a1a1aa',
        secondary: '#71717a',
      },
      divider:
        mode === 'light'
          ? alpha(modernColors.neutral[200], 0.5)
          : alpha(modernColors.neutral[700], 0.5),
    },
    typography: {
      fontFamily:
        '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontSize: '3.5rem',
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-0.025em',
        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        fontWeight: 400,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        fontWeight: 400,
      },
      button: {
        fontWeight: 500,
        textTransform: 'none' as const,
        letterSpacing: '0.02em',
        fontSize: '0.95rem',
      },
    },
    shape: {
      borderRadius: 20,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            scrollBehavior: 'smooth',
          },
          body: {
            background:
              mode === 'light'
                ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f1729 100%)',
            minHeight: '100vh',
            backgroundAttachment: 'fixed',
            fontSmooth: 'always',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          '*': {
            '&::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: alpha(modernColors.neutral[200], 0.1),
              borderRadius: 8,
            },
            '&::-webkit-scrollbar-thumb': {
              background: alpha(modernColors.neutral[400], 0.3),
              borderRadius: 8,
              '&:hover': {
                background: alpha(modernColors.neutral[400], 0.5),
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: alpha('#0f1419', 0.8),
            backdropFilter: 'blur(20px) saturate(180%)',
            border: `1px solid ${alpha('#27272a', 0.3)}`,
            borderRadius: 20,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            padding: '14px 28px',
            transition: 'none',
            position: 'relative',
            overflow: 'hidden',
            '@media (max-width: 768px)': {
              padding: '12px 24px',
              fontSize: '0.9rem',
              borderRadius: 14,
            },
            '@media (max-width: 480px)': {
              padding: '10px 20px',
              fontSize: '0.85rem',
              borderRadius: 12,
            },
            '&:hover': {
              transform: 'none',
              '@media (max-width: 768px)': {
                transform: 'none',
              },
            },
          },
          contained: {
            background: '#0f1419',
            boxShadow: 'none',
            border: '1px solid #27272a',
            color: '#a1a1aa',
            '&:hover': {
              background: '#0f1419',
              boxShadow: 'none',
              color: '#a1a1aa',
            },
            '&:active': {
              transform: 'none',
            },
          },
          outlined: {
            borderWidth: 2,
            backgroundColor: alpha('#0f1419', 0.6),
            backdropFilter: 'blur(10px)',
            borderColor: alpha('#27272a', 0.5),
            '&:hover': {
              borderWidth: 2,
              backgroundColor: alpha('#0f1419', 0.8),
              borderColor: alpha('#27272a', 0.7),
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            backgroundColor: alpha('#0f1419', 0.8),
            backdropFilter: 'blur(20px) saturate(180%)',
            border: `1px solid ${alpha('#27272a', 0.3)}`,
            overflow: 'hidden',
            position: 'relative',
            '@media (max-width: 768px)': {
              borderRadius: 20,
            },
            '@media (max-width: 480px)': {
              borderRadius: 16,
              margin: '0 4px',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(39,39,42,0.6), transparent)',
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 28,
            backgroundColor: alpha('#0f1419', 0.9),
            backdropFilter: 'blur(40px) saturate(200%)',
            border: `1px solid ${alpha('#27272a', 0.3)}`,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
            '@media (max-width: 768px)': {
              borderRadius: 20,
              margin: 16,
              maxHeight: 'calc(100vh - 32px)',
              width: 'calc(100vw - 32px)',
            },
            '@media (max-width: 480px)': {
              borderRadius: 16,
              margin: 8,
              maxHeight: 'calc(100vh - 16px)',
              width: 'calc(100vw - 16px)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 16,
              backgroundColor: alpha('#0f1419', 0.6),
              backdropFilter: 'blur(10px)',
              '@media (max-width: 768px)': {
                borderRadius: 14,
                fontSize: '16px', // Prevents zoom on iOS
              },
              '@media (max-width: 480px)': {
                borderRadius: 12,
                padding: '4px 8px',
              },
              '&.Mui-focused': {
                backgroundColor: alpha('#0f1419', 0.8),
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                '@media (max-width: 768px)': {
                  transform: 'translateY(0px)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                },
              },
            },
            '& .MuiInputLabel-root': {
              '@media (max-width: 480px)': {
                fontSize: '0.9rem',
              },
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            backgroundColor: alpha('#ffffff', 0.1),
            borderRadius: 20,
            padding: 6,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha('#ffffff', 0.1)}`,
          },
          indicator: {
            height: '100%',
            borderRadius: 16,
            backgroundColor: alpha('#ffffff', 0.2),
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(24, 33, 57, 0.2)',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            margin: '0 4px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontWeight: 500,
            textTransform: 'none',
            fontSize: '0.95rem',
            '&.Mui-selected': {
              color: '#ffffff',
              fontWeight: 600,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${alpha(modernColors.neutral[200], 0.1)}`,
            padding: '16px',
          },
          head: {
            fontWeight: 600,
            backgroundColor: alpha('#ffffff', 0.05),
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {},
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.1),
              transform: 'scale(1.1)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha('#ffffff', 0.15),
            border: `1px solid ${alpha('#ffffff', 0.2)}`,
            fontWeight: 500,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: '#a1a1aa',
          },
          h1: {
            color: 'transparent', // Keep gradient text transparent
          },
          h2: {
            color: '#a1a1aa',
          },
          h3: {
            color: '#a1a1aa',
          },
          h4: {
            color: '#a1a1aa',
          },
          h5: {
            color: '#a1a1aa',
          },
          h6: {
            color: '#a1a1aa',
          },
          body1: {
            color: '#a1a1aa',
          },
          body2: {
            color: '#71717a',
          },
          caption: {
            color: '#52525b',
          },
        },
      },
    },
  })
}

export default function AppTheme({ children, mode = 'light' }: AppThemeProps) {
  const [currentMode, setCurrentMode] = React.useState<'light' | 'dark'>(
    'light',
  )

  React.useEffect(() => {
    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setCurrentMode(mediaQuery.matches ? 'dark' : 'light')

      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentMode(e.matches ? 'dark' : 'light')
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      setCurrentMode(mode)
    }
  }, [mode])

  const theme = React.useMemo(() => {
    return getModern2025Theme(currentMode)
  }, [currentMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}
