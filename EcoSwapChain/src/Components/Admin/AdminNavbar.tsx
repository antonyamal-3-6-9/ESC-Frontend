import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    useMediaQuery,
    useTheme,
    IconButton
} from '@mui/material';
import {
    Package,
    ShoppingCart,
    LogOut,
    Menu as MenuIcon
} from 'lucide-react';
import logo from "../logos/svg/logo-color.svg"
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store'
import { PublicAPI } from '../API/api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { activateUser, clearUser } from '../../Redux/userSlice';
import { setLoading } from '../../Redux/alertBackdropSlice';

const SwapchainNavbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const user = useAppSelector(state => state.user)


    const dispatch = useDispatch()

    const navigate = useNavigate()

    const handleLogout = async () => {
        dispatch(setLoading(true))
        try {
            await PublicAPI.post('auth/logout/', {})
            localStorage.clear()
            dispatch(activateUser(false))
            dispatch(clearUser())
            navigate("/")
        } catch (error) {
            console.log(error)
            dispatch(setLoading(false))
        } finally {
            dispatch(setLoading(false))
        }

    }


    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: theme.palette.surface.main,
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Left side - Brand */}
                <Box display={"flex"} alignItems={"center"}>
                    <Box
                        component='img'
                        src={logo}
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
                        to="/admin/dashboard/"
                        sx={{
                            fontWeight: "bold",
                            color: "primary",
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
                        SwapChain Admin
                    </Typography>
                </Box>


                {/* Right side - Buttons */}
                {isMobile ? (
                    <IconButton color="inherit">
                        <MenuIcon />
                    </IconButton>
                ) : (

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {user.active &&
                                <>
                                <Link
                                to={"/admin/hub/manage/"}
                                >
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<Package size={18} />}
                                    >
                                        Shipping Hubs
                                    </Button>
                                </Link>
                          

                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<ShoppingCart size={18} />}
                                >
                                    Orders
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<LogOut size={18} />}
                                    onClick={handleLogout}
                                >
                                    LogOut
                                </Button>
                            </>
                        }


                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default SwapchainNavbar;