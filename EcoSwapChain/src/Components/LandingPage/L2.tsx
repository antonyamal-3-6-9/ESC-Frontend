import {
    Box,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    Container,
    Fade,
    Slide,
    Grow,
    useScrollTrigger,
    Avatar,
    List,
    ListItem,
    IconButton
} from '@mui/material';
import { SwapTheme } from '../../theme';
import { ThemeProvider } from '@mui/material/styles';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ShieldIcon from '@mui/icons-material/Shield';
import RepeatIcon from '@mui/icons-material/Repeat';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const LandingPage = () => {
    const trigger = useScrollTrigger();
    const features = [
        { icon: <ShieldIcon />, title: "NFT-Backed Authentication", description: "Immutable proof of ownership stored on blockchain" },
        { icon: <RepeatIcon />, title: "Seamless Resale", description: "Transfer ownership with single click" },
        { icon: <VerifiedUserIcon />, title: "Lifetime Traceability", description: "Full history from manufacture to current owner" }
    ];

    return (
        <ThemeProvider theme={SwapTheme}>
            {/* Hero Section */}
            <Box sx={{
                minHeight: '100vh',
                background: SwapTheme.palette.gradient.secondary,
                color: 'primary.contrastText',
                pt: 12,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Container>
                    <Fade in timeout={1000}>
                        <Box sx={{ textAlign: 'center', py: 10 }}>
                            <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
                                Revolutionizing Second-Hand Authentication
                            </Typography>
                            <Typography variant="h4" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
                                Transform your used products into verified assets with blockchain-powered NFTs
                            </Typography>
                            <Button
                                variant="gradient"
                                size="large"
                                endIcon="🚀"
                                sx={{
                                    animation: `${pulse} 2s infinite`,
                                    '&:hover': { animation: 'none' }
                                }}
                            >
                                Start Free Trial
                            </Button>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            {/* Problem/Solution Section */}
            <Slide in={trigger} direction="up" timeout={500}>
                <Box sx={{ py: 10, bgcolor: 'background.default' }}>
                    <Container>
                        <Grid container spacing={6} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Card sx={{
                                    bgcolor: 'secondary.main',
                                    color: 'secondary.contrastText',
                                    p: 4,
                                    transform: 'rotate(-2deg)'
                                }}>
                                    <Typography variant="h3" gutterBottom>⚠️ The Problem</Typography>
                                    <Typography>
                                        Counterfeit products account for <strong>30%</strong> of all second-hand sales,
                                        costing buyers billions annually in fraudulent transactions.
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{
                                    bgcolor: 'accent.main',
                                    color: 'accent.contrastText',
                                    p: 4,
                                    transform: 'rotate(2deg)'
                                }}>
                                    <Typography variant="h3" gutterBottom>💡 Our Solution</Typography>
                                    <Typography>
                                        Blockchain-verified NFTs that provide immutable proof of authenticity
                                        and ownership history for every product.
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Slide>

            {/* Features Section */}
            <Box sx={{ py: 10, bgcolor: 'surface.main' }}>
                <Container>
                    <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
                        Why Choose SwapChain?
                    </Typography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grow in={trigger} timeout={index * 300} key={feature.title}>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{
                                        height: '100%',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: 3
                                        }
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                            <Avatar sx={{
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                width: 60,
                                                height: 60,
                                                mb: 3,
                                                mx: 'auto'
                                            }}>
                                                {feature.icon}
                                            </Avatar>
                                            <Typography variant="h5" gutterBottom>
                                                {feature.title}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                {feature.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grow>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* How It Works Section */}
            <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
                <Container>
                    <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
                        Simple 3-Step Process
                    </Typography>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                position: 'relative',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: 3,
                                '&:hover img': {
                                    transform: 'scale(1.05)'
                                }
                            }}>
                                <img
                                    src="/demo-placeholder.jpg"
                                    alt="Process demo"
                                    style={{
                                        width: '100%',
                                        transition: 'transform 0.3s ease'
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        bgcolor: 'primary.main',
                                        '&:hover': { bgcolor: 'primary.dark' }
                                    }}
                                >
                                    <PlayCircleOutlineIcon sx={{ color: 'primary.contrastText', fontSize: 60 }} />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <List>
                                {['Upload Product', 'Mint NFT', 'Sell Securely'].map((step, index) => (
                                    <ListItem key={step} sx={{ mb: 2 }}>
                                        <Avatar sx={{
                                            bgcolor: 'accent.main',
                                            color: 'accent.contrastText',
                                            mr: 2
                                        }}>
                                            {index + 1}
                                        </Avatar>
                                        <Typography variant="h5">{step}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', py: 6 }}>
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>SwapChain</Typography>
                            <Typography>
                                Empowering secure second-hand transactions through blockchain technology
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="h6" gutterBottom>Links</Typography>
                            <List>
                                {['About', 'Blog', 'Contact'].map((item) => (
                                    <ListItem key={item} disableGutters>
                                        <Button sx={{ color: 'secondary.contrastText' }}>{item}</Button>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="h6" gutterBottom>Legal</Typography>
                            <List>
                                {['Privacy', 'Terms', 'Security'].map((item) => (
                                    <ListItem key={item} disableGutters>
                                        <Button sx={{ color: 'secondary.contrastText' }}>{item}</Button>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>Connect</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <IconButton sx={{ color: 'secondary.contrastText' }}>
                                    <TwitterIcon />
                                </IconButton>
                                <IconButton sx={{ color: 'secondary.contrastText' }}>
                                    <FacebookIcon />
                                </IconButton>
                                <IconButton sx={{ color: 'secondary.contrastText' }}>
                                    <LinkedInIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default LandingPage;