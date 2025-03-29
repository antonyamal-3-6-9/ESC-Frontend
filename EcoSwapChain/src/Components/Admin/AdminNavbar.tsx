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
import { Link } from 'react-router-dom'

const SwapchainNavbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                        to="/"
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
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<Package size={18} />}
                        >
                            Shipping Hubs
                        </Button>

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
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default SwapchainNavbar;