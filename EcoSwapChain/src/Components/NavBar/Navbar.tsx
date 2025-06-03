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
  Badge,
  useTheme,
  Stack
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

interface MenuItem {
  text: string | "null";
  action: () => void;
  icon: React.ReactElement;
  isPrimary?: boolean;
  showOnTablet?: boolean;
  isDanger?: boolean;
}

const Navbar = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enhanced responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery('(max-width:400px)');

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

  const menuItems: MenuItem[] = user.active
    ? [
      {
        text: user.username ? user.username : 'U',
        action: () => navigateTo(`/${user.role}/dashboard`),
        icon: <AccountCircleIcon />,
        isPrimary: true
      },
      {
        text: 'Wallet',
        action: handleWallet,
        icon: <AccountBalanceWalletIcon />,
        showOnTablet: true
      },
      {
        text: 'Add Product',
        action: handleCreate,
        icon: <AddIcon />,
        showOnTablet: false
      },
      {
        text: 'My Orders',
        action: () => navigateTo('/order/list/all'),
        icon: <ShoppingCartIcon />,
        showOnTablet: false
      },
      {
        text: 'Explore',
        action: () => navigateTo('/nft/list/all'),
        icon: <ExploreIcon />,
        showOnTablet: true
      },
      {
        text: 'Logout',
        action: handleLogout,
        icon: <LogoutIcon />,
        isDanger: true,
        showOnTablet: true
      }
    ]
    : [
      {
        text: 'Login',
        action: () => navigateTo('/trader/login'),
        icon: <LoginIcon />,
        showOnTablet: true
      },
      {
        text: 'Register',
        action: () => navigateTo('/trader/register'),
        icon: <PersonAddIcon />,
        showOnTablet: false
      },
      {
        text: 'Explore',
        action: () => navigateTo('/nft/list/all'),
        icon: <ExploreIcon />,
        showOnTablet: true
      }
    ];

  // Filter items based on screen size
  const getVisibleMenuItems = () => {
    if (isMobile) return menuItems;
    if (isTablet) return menuItems.filter(item => item.showOnTablet !== false);
    return menuItems;
  };

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
      <Toolbar
        sx={{
          minHeight: {
            xs: 56,
            sm: 64,
            md: 70,
            lg: 72
          },
          px: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5
          },
          py: { xs: 0.5, sm: 1 }
        }}
        variant={isSmallMobile ? 'dense' : 'regular'}
      >
        {/* Enhanced Responsive Logo Section */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            textDecoration: 'none',
            transition: 'transform 0.2s ease',
            minWidth: 0, // Prevent overflow
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
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Box
              component='img'
              src={Logo}
              sx={{
                height: {
                  xs: isExtraSmall ? 32 : 36,
                  sm: 42,
                  md: 48,
                  lg: 52
                },
                width: {
                  xs: isExtraSmall ? 32 : 36,
                  sm: 42,
                  md: 48,
                  lg: 52
                },
                borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.accent.main}20)`,
                border: theme => `2px solid ${theme.palette.accent.main}40`,
                p: { xs: 0.3, sm: 0.4, md: 0.5 },
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
                    minWidth: { xs: 6, sm: 8 },
                    height: { xs: 6, sm: 8 },
                    borderRadius: '50%',
                    border: theme => `2px solid ${theme.palette.secondary.main}`,
                    fontSize: { xs: '0.5rem', sm: '0.6rem' }
                  }
                }}
              />
            )}
          </Box>

          <Box sx={{
            ml: { xs: 1, sm: 1.5, md: 2 },
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: theme => `linear-gradient(135deg, ${theme.palette.primary.contrastText}, ${theme.palette.accent.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: {
                  xs: isExtraSmall ? '0.9rem' : '1.1rem',
                  sm: '1.2rem',
                  md: '1.4rem',
                  lg: '1.5rem'
                },
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textTransform: "uppercase",
                letterSpacing: { xs: 1, sm: 1.5, md: 2 },
                lineHeight: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {isExtraSmall ? 'AuthChain' : 'Authenti-chain'}
            </Typography>
            {!isSmallMobile && (
              <Typography
                variant="caption"
                sx={{
                  color: theme => `${theme.palette.primary.contrastText}80`,
                  fontSize: { xs: '0.6rem', sm: '0.7rem' },
                  letterSpacing: { xs: 0.5, sm: 1 },
                  textTransform: 'uppercase',
                  display: 'block'
                }}
              >
                Blockchain Auth
              </Typography>
            )}
          </Box>
        </Box>

        {/* Desktop/Tablet Navigation */}
        {!isMobile && (
          <Stack
            direction="row"
            spacing={{ md: 0.5, lg: 1 }}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            {user.active && (
              <Chip
                avatar={
                  <Avatar sx={{
                    bgcolor: 'accent.main',
                    width: { md: 24, lg: 28 },
                    height: { md: 24, lg: 28 },
                    fontSize: { md: '0.7rem', lg: '0.8rem' }
                  }}>
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                }
                label={isTablet ? user.username : `${user.role} • ${user.username}`}
                onClick={() => navigateTo(`/${user.role}/dashboard`)}
                sx={{
                  mr: { md: 1, lg: 2 },
                  bgcolor: theme => `${theme.palette.primary.main}20`,
                  color: 'primary.contrastText',
                  border: theme => `1px solid ${theme.palette.accent.main}40`,
                  fontSize: { md: '0.7rem', lg: '0.8rem' },
                  height: { md: 28, lg: 32 },
                  '& .MuiChip-label': {
                    px: { md: 1, lg: 1.5 }
                  },
                  '&:hover': {
                    bgcolor: theme => `${theme.palette.accent.main}30`,
                    cursor: 'pointer'
                  }
                }}
              />
            )}

            {getVisibleMenuItems().filter(item => !item.isPrimary).map((item, index) => (
              <Button
                key={index}
                startIcon={!isTablet || item.showOnTablet ? item.icon : undefined}
                onClick={item.action}
                variant={item.isDanger ? 'outlined' : 'text'}
                size={isTablet ? 'small' : 'medium'}
                sx={{
                  color: item.isDanger ? 'error.main' : 'primary.contrastText',
                  borderColor: item.isDanger ? 'error.main' : 'transparent',
                  backgroundColor: item.isDanger ? 'transparent' : 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  px: { md: 1, lg: 2 },
                  py: { md: 0.5, lg: 0.8 },
                  minWidth: { md: 'auto', lg: 'auto' },
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { md: '0.7rem', lg: '0.8rem' },
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
                {isTablet && item.text.length > 8 ? item.text.substring(0, 6) + '...' : item.text}
              </Button>
            ))}
          </Stack>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileMenuOpen(true)}
            size={isSmallMobile ? 'small' : 'medium'}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: theme => `1px solid ${theme.palette.accent.main}40`,
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              '&:hover': {
                bgcolor: theme => `${theme.palette.accent.main}30`
              }
            }}
          >
            <MenuIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          </IconButton>
        )}
      </Toolbar>

      {/* Enhanced Responsive Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen && isMobile}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: {
              xs: isExtraSmall ? '95%' : '90%',
              sm: '85%'
            },
            maxWidth: { xs: '320px', sm: '350px' },
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
        {/* Responsive Drawer Header */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, sm: 3 },
          background: theme => `linear-gradient(135deg, ${theme.palette.accent.main}20, transparent)`,
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: { xs: 1.5, sm: 2 }
          }}>
            <Typography
              variant={isSmallMobile ? "subtitle1" : "h6"}
              fontWeight="bold"
            >
              Navigation
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(false)}
              size={isSmallMobile ? 'small' : 'medium'}
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
              p: { xs: 1.5, sm: 2 },
              bgcolor: theme => `${theme.palette.primary.main}20`,
              borderRadius: 2,
              border: theme => `1px solid ${theme.palette.accent.main}30`
            }}>
              <Avatar sx={{
                bgcolor: 'accent.main',
                mr: { xs: 1.5, sm: 2 },
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}>
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
                <Typography
                  variant={isSmallMobile ? "body2" : "subtitle1"}
                  fontWeight="bold"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user.username}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.7,
                    textTransform: 'capitalize',
                    fontSize: { xs: '0.65rem', sm: '0.75rem' }
                  }}
                >
                  {user.role}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Responsive Menu Items */}
        <List sx={{
          pt: { xs: 0.5, sm: 1 },
          pb: { xs: 1, sm: 2 },
          px: { xs: 0.5, sm: 1 }
        }}>
          {getVisibleMenuItems().filter(item => !item.isPrimary).map((item, index) => (
            <Box key={index}>
              <ListItem
                disablePadding
                sx={{
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.25, sm: 0.5 }
                }}
              >
                <ListItemButton
                  onClick={item.action}
                  sx={{
                    borderRadius: 2,
                    py: { xs: 1, sm: 1.5 },
                    px: { xs: 1.5, sm: 2 },
                    mx: { xs: 0.5, sm: 1 },
                    minHeight: { xs: 44, sm: 48 },
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
                    mr: { xs: 1.5, sm: 2 },
                    color: item.isDanger ? 'error.main' : 'accent.main',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: { xs: '1.1rem', sm: '1.2rem' }
                  }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: 500,
                        color: item.isDanger ? 'error.main' : 'inherit',
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {item.isDanger && index < getVisibleMenuItems().length - 1 && (
                <Divider sx={{
                  mx: { xs: 2, sm: 3 },
                  my: { xs: 0.5, sm: 1 },
                  opacity: 0.3
                }} />
              )}
            </Box>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;