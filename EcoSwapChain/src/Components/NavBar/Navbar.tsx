import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import Logo from '../logos/svg/logo-color.svg'
import { Link } from 'react-router'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { triggerWallet } from '../../Redux/walletSlice'
import { PublicAPI } from '../API/api'
import { activateUser, clearUser } from '../../Redux/userSlice'
import { useNavigate } from 'react-router'


const Navbar = () => {
  const user = useAppSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleWallet = () => {
    dispatch(triggerWallet())
  }


    const handleLogout = async () => {
        console.log("got in")
        try {
            await PublicAPI.post('auth/logout/', {})
            localStorage.clear()
             dispatch(activateUser(false))
             dispatch(clearUser())
            navigate("/")
        } catch (error) {
            console.log(error)
        }

    }

  return (
    <AppBar
      position='sticky'
      sx={{
        backgroundColor: theme => theme.palette.secondary.main,
        boxShadow: theme => theme.shadows[3],
        // If you want glassmorphism effect (optional)
        backdropFilter: 'blur(8px)',
        background: theme => `linear-gradient(
        to right,
        ${theme.palette.secondary.main}dd,
        ${theme.palette.secondary.dark}dd
      )`
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component='img'
            src={Logo}
            sx={{
              height: 60,
              width: 60,
              margin: 1,
              borderRadius: '50%',
              boxShadow: theme => theme.shadows[0],
              // Add other theme-aware styles
              filter: theme =>
                `drop-shadow(0 2px 4px ${theme.palette.accent.main})`
            }}
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              color: "primary.contrastText",
              ml: 0,
              fontFamily: (theme) => theme.typography.fontFamily,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              textDecoration: "none", // Removes underline
              "&:hover": {
                textDecoration: "none", // Ensures it doesn't appear on hover
              },
            }}
          >
            SwapChain
          </Typography>

        </Box>

        <Box
          sx={{
            display: 'flex',
            marginLeft: 'auto',
            gap: 2 // Modern spacing instead of marginRight
          }}
        >
          <Link to={user.active ? `/${user.role}/dashboard` : `/trader/login`}>
            <Button
              color='inherit'
              sx={{
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'accent.main',
                  color: 'accent.contrastText'
                }
              }}
            >
              {user.active ? user.username : 'Login'}
            </Button>
          </Link>

          {user.active ? (
            <>
            <Button
              color='inherit'
              sx={{
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'accent.main',
                  color: 'accent.contrastText'
                }
              }}
              onClick={handleWallet}
            >
              Wallet
              </Button>
              <Link to={"/trader/nft/create"}>
                <Button
                  color='inherit'
                  sx={{
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'accent.main',
                      color: 'accent.contrastText'
                    }
                  }}
                >
                  Add New Product
                </Button>
              </Link>
              <Link to={"/order/list/all"}>
                <Button
                  color='inherit'
                  sx={{
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'accent.main',
                      color: 'accent.contrastText'
                    }
                  }}
                >
                  My Orders
                </Button>
              </Link>
            </>
          ) : null}
        <Link to={"/nft/list/all"}>
          <Button
            color='inherit'
            sx={{
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'accent.main',
                color: 'accent.contrastText'
              }
            }}
          >
            Explore
            </Button>
          </Link>
          {user.active && (
    
              <Button
                color='inherit'
                sx={{
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'accent.main',
                    color: 'accent.contrastText'
                  }
              }}
              onClick={handleLogout}
              >
                Logout
              </Button>
      
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
