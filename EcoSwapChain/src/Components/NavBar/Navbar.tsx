import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  Avatar,
  Chip,
  Divider,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Logo from '../logos/svg/logo-color.svg';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { useDispatch } from 'react-redux';
import { triggerWallet } from '../../Redux/walletSlice';
import { PublicAPI } from '../API/api';
import { activateUser, clearUser } from '../../Redux/userSlice';
import { useNavigate } from 'react-router';
import { setLoading } from '../../Redux/alertBackdropSlice';
import { useState } from 'react';

const Navbar = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleWallet = () => {
    dispatch(triggerWallet());
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await PublicAPI.post('auth/logout/', {});
      localStorage.clear();
      dispatch(activateUser(false));
      dispatch(clearUser());
      navigate("/");
      if (isMobile) setMobileMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = () => {
    dispatch(setLoading(true));
    navigate("/trader/nft/create");
    if (isMobile) setMobileMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const menuItems = user.active
    ? [
      {
        text: user.username,
        action: () => navigateTo(`/${user.role}/dashboard`),
        icon: <AccountCircleIcon />,
        isPrimary: true
      },
      {
        text: 'Wallet',
        action: handleWallet,
        icon: <AccountBalanceWalletIcon />
      },
      {
        text: 'Add Product',
        action: handleCreate,
        icon: <AddIcon />
      },
      {
        text: 'My Orders',
        action: () => navigateTo('/order/list/all'),
        icon: <ShoppingCartIcon />
      },
      {
        text: 'Explore',
        action: () => navigateTo('/nft/list/all'),
        icon: <ExploreIcon />
      },
      {
        text: 'Logout',
        action: handleLogout,
        icon: <LogoutIcon />,
        isDanger: true
      }
    ]
    : [
      {
        text: 'Login',
        action: () => navigateTo('/trader/login'),
        icon: <LoginIcon />,
        isPrimary: true
      },
      {
        text: 'Register',
        action: () => navigateTo('/trader/register'),
        icon: <PersonAddIcon />
      },
      {
        text: 'Explore',
        action: () => navigateTo('/nft/list/all'),
        icon: <ExploreIcon />
      }
    ];

  return (
    <AppBar
      key={user.active ? 'logged-in' : 'logged-out'}
      position='sticky'
      elevation={0}
      sx={{
        backgroundColor: theme => `${theme.palette.primary.main}20`,
        backdropFilter: 'blur(20px)',
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
        background: theme => `linear-gradient(
          135deg,
          ${theme.palette.secondary.main}95,
          ${theme.palette.secondary.dark}85
        )`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme => `linear-gradient(
            90deg,
            transparent 0%,
            ${theme.palette.accent.main}15 50%,
            transparent 100%
          )`,
          pointerEvents: 'none'
        }
      }}
    >
      <Toolbar sx={{
        minHeight: { xs: 64, sm: 70 },
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        {/* Enhanced Logo Section */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            textDecoration: 'none',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              component='img'
              src={Logo}
              sx={{
                height: { xs: 45, sm: 52 },
                width: { xs: 45, sm: 52 },
                borderRadius: '12px',
                background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.accent.main}20)`,
                border: theme => `2px solid ${theme.palette.accent.main}40`,
                p: 0.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: theme => `2px solid ${theme.palette.accent.main}80`,
                  transform: 'rotate(5deg)'
                }
              }}
            />
            {user.active && (
              <Badge
                badgeContent="●"
                sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  '& .MuiBadge-badge': {
                    backgroundColor: '#4ade80',
                    color: '#4ade80',
                    minWidth: 8,
                    height: 8,
                    borderRadius: '50%',
                    border: theme => `2px solid ${theme.palette.secondary.main}`
                  }
                }}
              />
            )}
          </Box>

          <Box sx={{ ml: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: theme => `linear-gradient(135deg, ${theme.palette.primary.contrastText}, ${theme.palette.accent.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.3rem', sm: '1.5rem' },
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textTransform: "uppercase",
                letterSpacing: 2,
                lineHeight: 1
              }}
            >
              SwapChain
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme => `${theme.palette.primary.contrastText}80`,
                fontSize: '0.7rem',
                letterSpacing: 1,
                textTransform: 'uppercase'
              }}
            >

            </Typography>
          </Box>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center'
          }}>
            {user.active && (
              <Chip
                avatar={<Avatar sx={{ bgcolor: 'accent.main' }}>{"S".toUpperCase()}</Avatar>}
                label={`${user.role} • ${user.username}`}
                onClick={() => navigateTo(`/${user.role}/dashboard`)}
                sx={{
                  mr: 2,
                  bgcolor: theme => `${theme.palette.primary.main}20`,
                  color: 'primary.contrastText',
                  border: theme => `1px solid ${theme.palette.accent.main}40`,
                  '&:hover': {
                    bgcolor: theme => `${theme.palette.accent.main}30`,
                    cursor: 'pointer'
                  }
                }}
              />
            )}

            {menuItems.filter(item => !item.isPrimary).map((item, index) => (
              <Button
                key={index}
                startIcon={item.icon}
                onClick={item.action}
                variant={item.isDanger ? 'outlined' : 'text'}
                sx={{
                  color: item.isDanger ? 'error.main' : 'primary.contrastText',
                  borderColor: item.isDanger ? 'error.main' : 'transparent',
                  backgroundColor: item.isDanger ? 'transparent' : 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  px: 2,
                  py: 0.8,
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: item.isDanger
                      ? 'error.main'
                      : theme => `${theme.palette.accent.main}40`,
                    color: item.isDanger ? 'error.contrastText' : 'accent.contrastText',
                    transform: 'translateY(-1px)',
                    boxShadow: theme => `0 4px 12px ${item.isDanger ? theme.palette.error.main : theme.palette.accent.main}40`
                  }
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileMenuOpen(true)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: theme => `1px solid ${theme.palette.accent.main}40`,
              '&:hover': {
                bgcolor: theme => `${theme.palette.accent.main}30`
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Enhanced Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen && isMobile}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: '85%',
            maxWidth: '350px',
            background: theme => `linear-gradient(
              180deg,
              ${theme.palette.secondary.main}f5,
              ${theme.palette.secondary.dark}f0
            )`,
            backdropFilter: 'blur(20px)',
            color: 'primary.contrastText',
            borderLeft: theme => `1px solid ${theme.palette.accent.main}30`
          }
        }}
      >
        {/* Drawer Header */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          background: theme => `linear-gradient(135deg, ${theme.palette.accent.main}20, transparent)`,
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Navigation</Typography>
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {user.active && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              bgcolor: theme => `${theme.palette.primary.main}20`,
              borderRadius: 2,
              border: theme => `1px solid ${theme.palette.accent.main}30`
            }}>
              <Avatar sx={{
                bgcolor: 'accent.main',
                mr: 2,
                width: 40,
                height: 40
              }}>
                {"s".toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.username}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'capitalize' }}>
                  {user.role}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Menu Items */}
        <List sx={{ pt: 1, pb: 2 }}>
          {menuItems.filter(item => !item.isPrimary).map((item, index) => (
            <Box key={index}>
              <ListItem disablePadding sx={{ px: 2, py: 0.5 }}>
                <ListItemButton
                  onClick={item.action}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    mx: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: item.isDanger
                        ? 'error.main'
                        : theme => `${theme.palette.accent.main}30`,
                      color: item.isDanger ? 'error.contrastText' : 'inherit',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <Box sx={{
                    mr: 2,
                    color: item.isDanger ? 'error.main' : 'accent.main',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: 500,
                        color: item.isDanger ? 'error.main' : 'inherit'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {item.isDanger && index < menuItems.length - 1 && (
                <Divider sx={{ mx: 3, my: 1, opacity: 0.3 }} />
              )}
            </Box>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;