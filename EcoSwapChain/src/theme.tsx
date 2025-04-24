import { createTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import '@mui/material/Button';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    gradient: true;
  }
}


declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    surface: Palette['primary'];
    gradient: {
      primary: string;
      secondary: string;
    };
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    surface?: PaletteOptions['primary'];
    gradient?: {
      primary: string;
      secondary: string;
    };
  }
}

export const SwapTheme = createTheme({
  palette: {
    primary: {
      main: '#4DA1A9',
      light: '#7FC4C9',
      dark: '#2B8188',
      contrastText: '#F6F4F0'
    },
    secondary: {
      main: '#2E5077',
      light: '#5A7BA3',
      dark: '#1A334D',
      contrastText: '#F6F4F0'
    },
    background: {
      default: '#F6F4F0',
      paper: '#FFFFFF'
    },
    accent: {
      main: '#79D7BE',
      light: '#A5E6D3',
      dark: '#4DBA9E',
      contrastText: '#2E5077'
    },
    surface: {
      main: '#FFFFFF',
      contrastText: '#2E5077'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #4DA1A9 0%, #79D7BE 100%)',
      secondary: 'linear-gradient(45deg, #2E5077 0%, #4DA1A9 100%)'
    },
    text: {
      primary: '#2E5077',
      secondary: '#4DA1A9',
      disabled: 'rgba(46, 80, 119, 0.38)'
    }
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.5px'
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.25px'
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.25px'
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0 2px 8px rgba(46, 80, 119, 0.1)',
    '0 4px 16px rgba(46, 80, 119, 0.15)',
    '0 8px 24px rgba(46, 80, 119, 0.2)',
    ...Array(21).fill('none') // Extend array to meet MUI's 25-shadow requirement
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any,
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'gradient' },
          style: ({ theme }: { theme: Theme }) => ({
            background: theme.palette.gradient.primary,
            color: theme.palette.primary.contrastText,
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.15)',
              opacity: 0,
              transition: 'opacity 0.3s'
            },
            '&:hover': {
              transform: 'translateY(-2px)',
              '&:before': {
                opacity: 1
              }
            }
          })
        }
      ],
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '8px 20px'
        },
        contained: {
          boxShadow: '0 4px 16px rgba(46, 80, 119, 0.15)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(46, 80, 119, 0.2)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(246, 244, 240, 0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(46, 80, 119, 0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          padding: '24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(46, 80, 119, 0.2)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#C4D1D9'
            },
            '&:hover fieldset': {
              borderColor: '#4DA1A9'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4DA1A9',
              boxShadow: '0 0 0 2px rgba(77, 161, 169, 0.2)'
            }
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#2E5077'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backdropFilter: 'blur(6px)'
        },
        standardSuccess: {
          background: 'rgba(121, 215, 190, 0.9) !important',
          color: '#2E5077'
        },
        standardError: {
          background: 'rgba(77, 161, 169, 0.9) !important'
        }
      }
    }
  }
});