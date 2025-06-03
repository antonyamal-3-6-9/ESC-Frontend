import { Box, Button, Typography, Slide } from '@mui/material'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SecurityIcon from '@mui/icons-material/Security'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import Grid from '@mui/material/Grid2'
import { Hero } from './Hero'
import { Stats } from './Stats'


const LandingPage = () => {
  
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(true)
  }, [])

  return (
    <Box sx={{ backgroundColor: 'background.default', pt: 10 }}>

      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Stats checked={checked} setChecked={setChecked} />

      {/* Features Section */}
      <Box id='features' sx={{ py: 10, px: 4 }}>
        <Typography
          variant='h2'
          sx={{
            textAlign: 'center',
            mb: 6,
            color: 'text.primary'
          }}
        >
          Why Choose SwapChain?
        </Typography>

        <Grid container spacing={6}>
          {[
            {
              icon: <SecurityIcon fontSize='large' />,
              title: 'Military-Grade Security',
              content:
                'Blockchain-powered encryption ensures your assets and data remain protected'
            },
            {
              icon: <AccountBalanceWalletIcon fontSize='large' />,
              title: 'NFT Integration',
              content:
                'Unique NFT-backed authentication for digital asset ownership'
            },
            {
              icon: <SwapHorizIcon fontSize='large' />,
              title: 'Instant Trading',
              content:
                'Real-time trading engine with near-zero latency transactions'
            }
          ].map((feature, index) => (
            <Grid size={4} key={index}>
              <Slide direction='up' in={checked} timeout={800 + index * 200}>
                <Box
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    backgroundColor: 'background.paper',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Box
                    sx={{
                      color: 'accent.main',
                      mb: 3,
                      fontSize: '3rem'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant='h5'
                    sx={{
                      mb: 2,
                      color: 'text.primary'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                    {feature.content}
                  </Typography>
                </Box>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: 'secondary.main',
          color: 'primary.contrastText',
          textAlign: 'center'
        }}
      >
        <Typography variant='h3' sx={{ mb: 4, color: 'primary.contrastText' }}>
          Ready to Join the Future of Trading?
        </Typography>
        <Button
          component={Link}
          to='/trader/register'
          variant='contained'
          size='large'
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.2rem',
            backgroundColor: 'accent.main',
            color: 'secondary.main',
            '&:hover': {
              backgroundColor: 'accent.dark'
            }
          }}
        >
          Start Trading Now
        </Button>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          backgroundColor: 'background.paper',
          textAlign: 'center'
        }}
      >
        <Typography
          variant='body1'
          sx={{
            color: 'text.secondary',
            mb: 2
          }}
        >
          © {new Date().getFullYear()} SwapChain. All rights reserved.
        </Typography>
        <Button
          component={Link}
          to='/contact'
          variant='text'
          sx={{
            color: 'text.primary',
            '&:hover': {
              color: 'accent.main'
            }
          }}
        >
          Contact Us
        </Button>
      </Box>
    </Box>
  )
}

export default LandingPage
