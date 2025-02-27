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
  createTheme,
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  Avatar
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
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
  id?: number
  transaction_hash: string
  amount: number
  transfered_to: string
  transfered_from: string | null
  status: string
  transaction_type?: string
  time_stamp?: string
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

const TransactionItem = styled(ListItem)(({ theme }: { theme: Theme }) => ({
  borderRadius: '8px',
  marginBottom: theme.spacing(1),
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(77, 161, 169, 0.05)'
  }
}))

const truncateString = (str: string, start: number = 6, end: number = 4): string => {
  if (!str) return '';
  return `${str.slice(0, start)}...${str.slice(-end)}`;
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const Wallet: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    public_key: '',
    balance: 0,
    sent_transaction: [],
    recieved_transaction: []
  })
  const [tabValue, setTabValue] = useState<number>(0);

  async function getWalletData() {
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.transaction_type === "REWARD") {
      return <Avatar sx={{ bgcolor: 'accent.main', width: 28, height: 28 }}>
        <CardGiftcardIcon fontSize="small" sx={{ color: 'secondary.main' }} />
      </Avatar>
    } else if (transaction.transfered_from === walletData.public_key) {
      return <Avatar sx={{ bgcolor: 'secondary.main', width: 28, height: 28 }}>
        <ArrowUpwardIcon fontSize="small" sx={{ color: 'background.default' }} />
      </Avatar>
    } else {
      return <Avatar sx={{ bgcolor: 'primary.main', width: 28, height: 28 }}>
        <ArrowDownwardIcon fontSize="small" sx={{ color: 'background.default' }} />
      </Avatar>
    }
  };

  const renderTransactions = (transactions: Transaction[]) => {
    return transactions.length > 0 ? (
      <List disablePadding>
        {transactions.map((transaction, index) => (
          <Grow in key={transaction.id || index} timeout={300 + index * 100}>
            <Box>
              <TransactionItem>
                <Box sx={{ mr: 1 }}>
                  {getTransactionIcon(transaction)}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Tooltip title={transaction.transaction_type || 'Transfer'}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                          {transaction.transaction_type === "REWARD"
                            ? "Reward"
                            : transaction.transfered_from === walletData.public_key
                              ? `To: ${truncateString(transaction.transfered_to)}`
                              : `From: ${truncateString(transaction.transfered_from || '')}`
                          }
                        </Typography>
                      </Tooltip>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: transaction.transfered_from === walletData.public_key ? 'error.main' : 'accent.main'
                        }}
                      >
                        {transaction.transfered_from === walletData.public_key ? '-' : '+'}{transaction.amount} SWAP
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Tooltip title={transaction.transaction_hash}>
                        <Typography variant="caption" color="text.secondary">
                          {truncateString(transaction.transaction_hash, 4, 4)}
                        </Typography>
                      </Tooltip>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          label={transaction.status}
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: '0.6rem',
                            backgroundColor: transaction.status === "CONFIRMED" ? 'rgba(121, 215, 190, 0.2)' : 'rgba(46, 80, 119, 0.1)',
                            color: transaction.status === "CONFIRMED" ? 'accent.main' : 'secondary.main'
                          }}
                        />
                        {transaction.time_stamp && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            {formatDate(transaction.time_stamp)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </TransactionItem>
              {index < transactions.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
            </Box>
          </Grow>
        ))}
      </List>
    ) : (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">No transactions found</Typography>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Slide in direction='up' timeout={500}>
        <AnimatedCard sx={{ maxWidth: 500, m: 1, minWidth: 300 }}>
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
                transition: 'transform 0.2s',
                mb: 3
              }}
            >
              Withdraw to Solana
            </Button>
          </Grow>

          {/* Transaction History Section */}
          <Box sx={{ mt: 2 }}>
            <Slide direction="right" in timeout={900}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'secondary.main',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Transaction History
              </Typography>
            </Slide>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 2,
                '& .MuiTab-root': {
                  minHeight: 36,
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  fontWeight: 600
                }
              }}
            >
              <Tab label="All" />
              <Tab label="Received" />
              <Tab label="Sent" />
            </Tabs>

            <Box sx={{ maxHeight: 240, overflowY: 'auto', px: 1 }}>
              {tabValue === 0 && renderTransactions([
                ...walletData.recieved_transaction,
                ...walletData.sent_transaction
              ].sort((a, b) => {
                const dateA = a.time_stamp ? new Date(a.time_stamp).getTime() : 0;
                const dateB = b.time_stamp ? new Date(b.time_stamp).getTime() : 0;
                return dateB - dateA;
              }))}

              {tabValue === 1 && renderTransactions(walletData.recieved_transaction)}

              {tabValue === 2 && renderTransactions(walletData.sent_transaction)}
            </Box>
          </Box>

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