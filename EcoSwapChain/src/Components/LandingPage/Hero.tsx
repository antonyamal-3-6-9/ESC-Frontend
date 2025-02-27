import {
  Box,
  Button,
  Typography,
  useTheme,
  Fade,
  Slide,
  Grow
} from '@mui/material'
import Image from './bg3.jpg'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export const Hero = () => {
  const theme = useTheme()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(true)
  }, [])

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        <Fade in={checked} timeout={1000}>
          <Box
            sx={{
              height: '80vh',
              backgroundImage: `url("${Image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0 20px',
              position: 'relative',
              boxShadow: '10',
              transform: checked ? 'scale(1)' : 'scale(1.1)',
              transition: 'transform 0.8s ease-out'
            }}
          />
        </Fade>

        <Box
          sx={{
            position: 'absolute',
            zIndex: 1,
            top: 100,
            left: 50,
            textAlign: 'center',
            px: 2,
            py: { xs: 8, md: 15 }
          }}
        >
          <Slide direction='down' in={checked} timeout={500}>
            <Typography
              variant='h2'
              sx={{
                mb: 2,
                fontWeight: 700,
                color: 'primary.contrastText',
                textShadow: `0 2px 4px ${theme.palette.secondary.main}`
              }}
            >
              Welcome to SwapChain
            </Typography>
          </Slide>

          <Grow in={checked} timeout={1000}>
            <Typography
              variant='h5'
              sx={{
                mb: 4,
                color: 'accent.main',
                maxWidth: 800,
                mx: 'auto'
              }}
            >
              Where Sustainable Commerce Meets Blockchain Innovation
            </Typography>
          </Grow>

          <Slide direction='up' in={checked} timeout={800}>
            <Button
              component={Link}
              to='trader/register'
              variant='gradient'
              size='large'
              sx={{
                fontSize: '1.2rem',
                px: 4,
                py: 2,
                '&:hover': {
                  transform: 'translateY(-3px)'
                }
              }}
            >
              Get Started
            </Button>
          </Slide>
        </Box>
      </Box>
    </>
  )
}
