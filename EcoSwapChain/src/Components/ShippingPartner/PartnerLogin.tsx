import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    CircularProgress,
    Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { PublicAPI } from '../API/api';
import { useDispatch } from 'react-redux';
import { setUser, activateUser } from '../../Redux/userSlice';
import { useNavigate } from 'react-router-dom';

const HubManagerLogin: React.FC = () => {
    // State for form controls
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            return;
        }

        // Clear previous errors
        setError(null);

        // Show loading indicator
        setIsLoading(true);

        try {
            // Simulate authentication API call
            const response = await PublicAPI.post('hub/login/', {
                email: username,
                password: password
            });
            dispatch(activateUser(true));
            dispatch(setUser(response.data.user));
            localStorage.setItem('token', response.data.token);
            navigate('/shipping/verify/');
        } catch (err) {
            setError('Authentication failed. Please try again later.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle password visibility
    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    };

    return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    padding: 2,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background decoration */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '70%',
                        height: '70%',
                        opacity: 0.05,
                        zIndex: 0,
                        background: theme => theme.palette.gradient.secondary,
                        borderRadius: '0 0 0 100%',
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '40%',
                        height: '40%',
                        opacity: 0.05,
                        zIndex: 0,
                        background: theme => theme.palette.gradient.primary,
                        borderRadius: '0 100% 0 0',
                    }}
                />

                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    borderRadius: '50%',
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(77, 161, 169, 0.5)'
                                }}
                            >
                                <LocalShippingIcon fontSize="large" />
                            </Box>
                        </Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            color="primary.dark"
                            fontWeight="bold"
                            sx={{ mb: 1 }}
                        >
                            SWAPCHAIN
                        </Typography>
                        <Typography
                            variant="h5"
                            component="h2"
                            color="text.secondary"
                            fontWeight="medium"
                        >
                            Hub Manager Login
                        </Typography>
                    </Box>

                    <Card
                        elevation={3}
                        sx={{
                            borderRadius: 4,
                            boxShadow: '0 8px 24px rgba(46, 80, 119, 0.15)',
                            background: 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(8px)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                            }
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{ '& > :not(style)': { mt: 3 } }}
                            >
                                {error && (
                                    <Alert
                                        severity="error"
                                        sx={{ mb: 2 }}
                                        onClose={() => setError(null)}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                <TextField
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    variant="outlined"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    disabled={isLoading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleTogglePassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Typography
                                        variant="body2"
                                        color="primary.dark"
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        Forgot password?
                                    </Typography>
                                </Box>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="gradient"
                                    size="large"
                                    disabled={isLoading}
                                    sx={{
                                        mt: 4,
                                        py: 1.5,
                                        position: 'relative',
                                    }}
                                >
                                    {isLoading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Login to Hub Manager Portal'
                                    )}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            © {new Date().getFullYear()} SwapChain Shipping. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
    );
};

export default HubManagerLogin;