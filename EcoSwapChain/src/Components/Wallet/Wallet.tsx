import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Slide,
  Grow,
  Snackbar,
  styled,
  ThemeProvider,
  createTheme
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { Theme } from '@mui/material/styles'
import { API } from '../API/api'
import Logo from "../logos/svg/logo-color.svg"

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary']
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary']
  }
}

interface Transaction {
  transaction_hash: string
  amount: number
  transfered_to: string
  transfered_from: string
  status: string
}

interface WalletData {
  public_key: string
  balance: number
  sent_transaction: Transaction[]
  recieved_transaction: Transaction[]
}

// Custom theme with provided colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#4DA1A9',
      contrastText: '#F6F4F0'
    },
    secondary: {
      main: '#2E5077'
    },
    background: {
      default: '#F6F4F0'
    },
    accent: {
      main: '#79D7BE'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }
      }
    }
  }
})

const AnimatedCard = styled(Box)(({ theme }: { theme: Theme }) => ({
  background: theme.palette.background.default,
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(46, 80, 119, 0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(46, 80, 119, 0.15)'
  }
}))

const Wallet: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    public_key: '',
    balance: 0,
    sent_transaction: [],
    recieved_transaction: []
  })

  async function getWalletData () {
    try {
      const response = await API.get('/wallet/retrieve/')
      console.log(response.data.wallet)
      setWalletData(response.data.wallet)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getWalletData()
  }, [])

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [clicked, setClicked] = useState<boolean>(false)

  const convertToRs = (swapcoins: number): string =>
    (swapcoins * 0.1).toFixed(2)
  const truncatedKey = `${walletData.public_key.slice(
    0,
    6
  )}...${walletData.public_key.slice(-4)}`

  const handleCopy = (): void => {
    navigator.clipboard.writeText(walletData.public_key)
    setOpenSnackbar(true)
  }

  const handleWithdrawClick = (): void => {
    setClicked(true)
    setTimeout(() => setClicked(false), 200)
  }

  return (
    <ThemeProvider theme={theme}>
      <Slide in direction='up' timeout={500}>
        <AnimatedCard sx={{ maxWidth: 450, m: 1 }}>
          <Typography
            variant='h5'
            gutterBottom
            sx={{
              color: 'secondary.main',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              justifyContent: 'center',
              mb: 2
            }}
          >
            <img
              src={Logo}
              alt='SwapChain'
              style={{ height: '1.2em', color: 'primary.main' }}
            />
            Wallet
          </Typography>

          <TextField
            label='Public Key'
            value={truncatedKey}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <IconButton
                    onClick={handleCopy}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize='small' />
                  </IconButton>
                )
              }
            }}
            sx={{ my: 2 }}
          />

          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography
              variant='h3'
              sx={{ color: 'primary.main', fontWeight: 800 }}
            >
              {walletData.balance}
              <Typography component='span' sx={{ color: 'accent.main', ml: 1 }}>
                SWAP
              </Typography>
            </Typography>
            <Typography
              variant='subtitle1'
              sx={{ color: 'secondary.main', mt: 1 }}
            >
              ≈ ₹{convertToRs(walletData.balance)}
            </Typography>
          </Box>

          <Grow in timeout={800}>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              onClick={handleWithdrawClick}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                transform: clicked ? 'scale(0.98)' : 'scale(1)',
                transition: 'transform 0.2s'
              }}
            >
              Withdraw to Solana
            </Button>
          </Grow>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={2000}
            onClose={() => setOpenSnackbar(false)}
            TransitionComponent={Grow}
          >
            <Box
              sx={{
                bgcolor: 'accent.main',
                color: 'secondary.main',
                px: 2,
                py: 1,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <CheckIcon fontSize='small' />
              <Typography variant='body2'>Public key copied!</Typography>
            </Box>
          </Snackbar>
        </AnimatedCard>
      </Slide>
    </ThemeProvider>
  )
}

export default Wallet
