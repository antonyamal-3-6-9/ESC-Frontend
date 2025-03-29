import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { SwapTheme } from '../../theme';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    IconButton,
    Typography,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Fade,
    Zoom,
    Slide,
    useScrollTrigger,
    Tooltip
} from '@mui/material';
import {
    ArrowForward,
    ExpandMore,
    ShieldRounded,
    SyncAlt,
    ReceiptLong,
    CheckCircle,
    PriceCheck,
    History,
    QuestionAnswer,
    Menu as MenuIcon,
    YouTube,
    Twitter,
    Facebook,
    Instagram,
    LinkedIn,
    Close
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useAppSelector } from '../../store';

// Company logos for trust indicators
const companyLogos = [
    'https://via.placeholder.com/150x50',
    'https://via.placeholder.com/150x50',
    'https://via.placeholder.com/150x50',
    'https://via.placeholder.com/150x50',
];

// Testimonial data
const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Vintage Collector',
        image: 'https://via.placeholder.com/60',
        text: 'The authentication NFTs have completely transformed how I buy and sell collectibles. I now have confidence in every purchase I make.',
    },
    {
        name: 'Michael Chen',
        role: 'Luxury Reseller',
        image: 'https://via.placeholder.com/60',
        text: 'As someone who deals with high-value items, this platform provides the security and verification that my clients demand. Game changer!',
    },
    {
        name: 'Elena Rodriguez',
        role: 'Sustainable Fashion Advocate',
        image: 'https://via.placeholder.com/60',
        text: 'Not only does this make second-hand shopping more secure, but it also promotes sustainability by extending product lifecycles.',
    },
];

// FAQ data
const faqs = [
    {
        question: 'What is an NFT and how does it authenticate products?',
        answer: 'NFTs (Non-Fungible Tokens) are unique digital certificates stored on a blockchain. For product authentication, we create a unique digital token linked to your physical item, containing verifiable ownership history and product details that cannot be altered or duplicated.',
    },
    {
        question: 'How do I verify the authenticity of a product with an NFT?',
        answer: 'Simply scan the QR code on the product or enter the product ID on our platform. This will show you the complete ownership history, authentication details, and verification status in real-time.',
    },
    {
        question: 'What happens when I want to resell my authenticated product?',
        answer: 'When you sell your product, you can transfer the NFT to the new owner with just a few clicks on our platform. The ownership transfer is recorded on the blockchain, maintaining the product\'s verified history.',
    },
    {
        question: 'What types of products can be authenticated with NFTs?',
        answer: 'Our platform works for virtually any type of product, but is especially valuable for luxury goods, collectibles, artworks, designer clothing, watches, electronics, and anything else where authenticity matters.',
    },
];

// Pricing plans
const pricingPlans = [
    {
        title: 'Basic',
        price: 'Free',
        features: [
            'Up to 5 NFT authentications',
            'Basic product history',
            'Standard verification process',
            'Community support'
        ],
        recommended: false,
        buttonText: 'Start Free'
    },
    {
        title: 'Premium',
        price: '$19.99/mo',
        features: [
            'Unlimited NFT authentications',
            'Detailed product analytics',
            'Priority verification',
            'Dedicated support',
            'API access'
        ],
        recommended: true,
        buttonText: 'Go Premium'
    },
    {
        title: 'Business',
        price: '$49.99/mo',
        features: [
            'Everything in Premium',
            'Bulk authentication',
            'White-label solution',
            'Custom integration',
            '24/7 priority support'
        ],
        recommended: false,
        buttonText: 'Contact Sales'
    }
];

// Feature data
const features = [
    {
        icon: <ShieldRounded fontSize="large" color="primary" />,
        title: 'NFT-Backed Authentication',
        description: 'Each product gets a unique digital certificate stored securely on the blockchain, impossible to counterfeit.'
    },
    {
        icon: <SyncAlt fontSize="large" color="primary" />,
        title: 'Seamless Resale & Transfer',
        description: 'Transfer ownership with a few clicks, maintaining the complete history of the product.'
    },
    {
        icon: <ReceiptLong fontSize="large" color="primary" />,
        title: 'Secure Ownership History',
        description: 'Every transaction and authentication detail is permanently recorded and easily verifiable.'
    },
    {
        icon: <PriceCheck fontSize="large" color="primary" />,
        title: 'Value Preservation',
        description: 'Verified products with complete history typically command higher resale values.'
    },
    {
        icon: <History fontSize="large" color="primary" />,
        title: 'Lifetime Traceability',
        description: 'Track the complete lifecycle of your product, from manufacturing to current ownership.'
    },
    {
        icon: <CheckCircle fontSize="large" color="primary" />,
        title: 'Quick Verification',
        description: 'Instant verification process allows you to check authenticity in seconds.'
    }
];

// How it works steps
const howItWorks = [
    {
        step: 1,
        title: 'Upload Product Details',
        description: 'Enter information about your product including photos, description, and proof of ownership.'
    },
    {
        step: 2,
        title: 'Mint Your NFT',
        description: 'Our system creates a unique digital certificate thats linked to your physical product.'
  },
    {
        step: 3,
        title: 'Sell with Verified Ownership',
        description: 'When you sell, the NFT transfers to the new owner, maintaining a complete, verified history.'
    }
];

// Animation variants for framer-motion
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const LandingPageThree = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const trigger = useScrollTrigger({ threshold: 100 });

    const user = useAppSelector(state => state.user)

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prevStep) => (prevStep + 1) % howItWorks.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Animated number counter for statistics
    const Counter = ({ targetNumber, label, duration = 2000 }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            let start = 0;
            const end = parseInt(targetNumber);
            const incrementTime = (duration / end) * 1000;

            const timer = setInterval(() => {
                start += 1;
                setCount(start);
                if (start === end) clearInterval(timer);
            }, incrementTime);

            return () => clearInterval(timer);
        }, [targetNumber, duration]);

        return (
            <Box textAlign="center">
                <Typography variant="h2" color="primary" fontWeight="bold">
                    {count.toLocaleString()}+
                </Typography>
                <Typography variant="body1">{label}</Typography>
            </Box>
        );
    };

    return (
        <ThemeProvider theme={SwapTheme}>
            <Box sx={{
                bgcolor: 'background.default',
                overflow: 'hidden'
            }}>
                {/* Navigation */}
                {/*
                <AppBar
                    position="fixed"
                    elevation={trigger ? 3 : 0}
                    sx={{
                        transition: 'all 0.3s',
                        bgcolor: trigger ? 'rgba(246, 244, 240, 0.95)' : 'transparent',
                    }}
                >
                    <Container>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                            <Typography variant="h6" fontWeight="bold" color="primary">AuthentiChain</Typography>

                           
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                                <Button color="primary">Features</Button>
                                <Button color="primary">How It Works</Button>
                                <Button color="primary">Pricing</Button>
                                <Button color="primary">FAQ</Button>
                                <Button variant="contained" color="primary" sx={{ ml: 2 }}>Sign Up</Button>
                            </Box>

                       
                            <IconButton
                                sx={{ display: { xs: 'flex', md: 'none' } }}
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    </Container>
                </AppBar>
                    */}
                {/* Mobile Menu */}
                <Fade in={mobileMenuOpen}>
                    <Box sx={{
                        display: mobileMenuOpen ? 'flex' : 'none',
                        flexDirection: 'column',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'background.paper',
                        zIndex: 1300,
                        p: 3
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Typography variant="h6" fontWeight="bold" color="primary">AuthentiChain</Typography>
                            <IconButton onClick={() => setMobileMenuOpen(false)}>
                                <Close />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button color="inherit" size="large">Features</Button>
                            <Button color="inherit" size="large">How It Works</Button>
                            <Button color="inherit" size="large">Pricing</Button>
                            <Button color="inherit" size="large">FAQ</Button>
                            <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>Sign Up</Button>
                        </Box>
                    </Box>
                </Fade>

                {/* Hero Section */}
                <Box
                    sx={{
                        pt: { xs: 12, md: 5 },
                        pb: { xs: 10, md: 16 },
                        background: `url('https://via.placeholder.com/1600x900') no-repeat center center`,
                        backgroundSize: 'cover',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(246, 244, 240, 0.85)',
                            backdropFilter: 'blur(5px)',
                            zIndex: 1
                        }
                    }}
                >
                    <Container sx={{ position: 'relative', zIndex: 2 }}>
                        
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={fadeInUp}
                                >
                                    <Typography
                                        variant="h1"
                                        component="h1"
                                        gutterBottom
                                        sx={{
                                            fontWeight: 800,
                                            background: SwapTheme.palette.gradient.secondary,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        Revolutionizing Second-Hand Product Authentication with NFTs
                                    </Typography>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                                        Secure, transparent, and immutable product verification for the second-hand market, powered by blockchain technology.
                                    </Typography>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                >
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                                        <Button
                                            component={Link}
                                            to = {user.active ? "/nft/create" : "/trader/register"}
                                            variant="gradient"
                                            size="large"
                                            endIcon={<ArrowForward />}
                                            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                                        >
                                            {user.active ? 'Add New Product' : 'Get Started'}
                                        </Button>
                                        <Button
                                            component={Link}
                                            to = "/nft/list/all"
                                            variant="outlined"
                                            color="secondary"
                                            size="large"
                                            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                                        >
                                            Explore Marketplace
                                        </Button>
                                    </Box>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.5 }}
                                >
                                    <Box sx={{ mt: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            TRUSTED BY INDUSTRY LEADERS
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mt: 1, opacity: 0.7 }}>
                                            {companyLogos.map((logo, index) => (
                                                <Box
                                                    component="img"
                                                    key={index}
                                                    src={logo}
                                                    alt={`Partner ${index + 1}`}
                                                    sx={{ height: 30, filter: 'grayscale(100%)' }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <motion.div
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                background: SwapTheme.palette.gradient.primary,
                                                borderRadius: '30px',
                                                transform: 'rotate(-3deg)',
                                                zIndex: -1,
                                                boxShadow: '0 20px 40px rgba(46, 80, 119, 0.15)'
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src="https://via.placeholder.com/600x400"
                                            alt="NFT Authentication"
                                            sx={{
                                                width: '100%',
                                                borderRadius: '20px',
                                                boxShadow: '0 10px 30px rgba(46, 80, 119, 0.2)'
                                            }}
                                        />
                                    </Box>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Problem & Solution Section */}
                <Box sx={{ py: { xs: 8, md: 12 } }}>
                    <Container>
                        <Grid container spacing={10} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                >
                                    <Typography variant="overline" color="primary" fontWeight="bold">
                                        THE PROBLEM
                                    </Typography>
                                    <Typography variant="h2" component="h2" sx={{ mb: 3 }}>
                                        Authenticity Crisis in the Second-Hand Market
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        The second-hand market is flooded with counterfeit products, with no reliable way to verify authenticity or track ownership history. Traditional papers and certificates get lost, and buyers are left with no way to verify what they're purchasing.
                                    </Typography>

                                    <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(121, 215, 190, 0.1)', borderRadius: 3 }}>
                                        <Typography variant="h6" color="error" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Close color="error" /> Fake products flood the resale market
                                        </Typography>
                                        <Typography variant="h6" color="error" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Close color="error" /> Ownership proof is lost over time
                                        </Typography>
                                        <Typography variant="h6" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Close color="error" /> No transparency in product history
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                >
                                    <Typography variant="overline" color="accent.main" fontWeight="bold">
                                        THE SOLUTION
                                    </Typography>
                                    <Typography variant="h2" component="h2" sx={{ mb: 3 }}>
                                        Blockchain-Verified Authenticity
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        We authenticate second-hand products with blockchain technology, ensuring lifetime traceability. Each product gets a unique NFT that serves as an immutable digital certificate, containing its complete history and verification details.
                                    </Typography>

                                    <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(77, 161, 169, 0.1)', borderRadius: 3 }}>
                                        <Typography variant="h6" color="success.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircle color="success" /> Immutable blockchain verification
                                        </Typography>
                                        <Typography variant="h6" color="success.main" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircle color="success" /> Complete ownership history
                                        </Typography>
                                        <Typography variant="h6" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircle color="success" /> Instant verification anywhere
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

          

                {/* Stats Counter Section */}
                <Box sx={{ py: 8, bgcolor: SwapTheme.palette.gradient.primary }}>
                    <Container>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <Grid container spacing={4} justifyContent="center">
                                <Grid item xs={12} sm={4}>
                                    <motion.div variants={fadeInUp}>
                                        <Counter targetNumber="10000" label="NFTs Created" />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <motion.div variants={fadeInUp}>
                                        <Counter targetNumber="2500" label="Active Users" />
                                    </motion.div>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <motion.div variants={fadeInUp}>
                                        <Counter targetNumber="98" label="Satisfaction Rate %" />
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </motion.div>
                    </Container>
                </Box>

                {/* Features Section */}
                <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
                    <Container>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="overline" color="primary" fontWeight="bold">
                                POWERFUL FEATURES
                            </Typography>
                            <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                                Why Choose Our Platform
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                                Our innovative solution combines blockchain technology with user-friendly features to revolutionize product authentication.
                            </Typography>
                        </Box>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <Grid container spacing={4}>
                                {features.map((feature, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <motion.div variants={fadeInUp}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    padding: 0,
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '4px',
                                                        height: '100%',
                                                        background: SwapTheme.palette.gradient.primary
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                                    <Box sx={{ mb: 2 }}>
                                                        {feature.icon}
                                                    </Box>
                                                    <Typography variant="h5" component="h3" gutterBottom>
                                                        {feature.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {feature.description}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    </Container>
                </Box>

                {/* How It Works Section */}
                <Box sx={{ py: { xs: 8, md: 12 } }}>
                    <Container>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="overline" color="secondary" fontWeight="bold">
                                SIMPLE PROCESS
                            </Typography>
                            <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                                How It Works
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                                Our platform makes it easy to authenticate, manage, and transfer ownership of second-hand products.
                            </Typography>
                        </Box>

                        <Grid container spacing={6} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: 400,
                                        bgcolor: 'background.paper',
                                        borderRadius: 4,
                                        boxShadow: 3,
                                        overflow: 'hidden'
                                    }}
                                >
                                    {howItWorks.map((step, index) => (
                                        <Fade in={activeStep === index} key={index}>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    p: 4,
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: '50%',
                                                        background: SwapTheme.palette.gradient.primary,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        mb: 3
                                                    }}
                                                >
                                                    <Typography variant="h4" color="white" fontWeight="bold">
                                                        {step.step}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h4" gutterBottom>
                                                    {step.title}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    {step.description}
                                                </Typography>
                                                <Box
                                                    component="img"
                                                    src={`https://via.placeholder.com/400x200?text=Step ${step.step}`}
                                                    alt={`Step ${step.step}: ${step.title}`}
                                                    sx={{ mt: 4, borderRadius: 2, maxWidth: '100%' }}
                                                />
                                            </Box>
                                        </Fade>
                                    ))}
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    {howItWorks.map((_, index) => (
                                        <Box
                                            key={index}
                                            onClick={() => setActiveStep(index)}
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                bgcolor: activeStep === index ? 'primary.main' : 'grey.300',
                                                mx: 1,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s'
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={staggerContainer}
                                >
                                    {howItWorks.map((step, index) => (
                                        <motion.div key={index} variants={fadeInUp}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    mb: 4,
                                                    p: 3,
                                                    borderRadius: 2,
                                                    bgcolor: activeStep === index ? 'rgba(77, 161, 169, 0.1)' : 'transparent',
                                                    border: activeStep === index ? '1px solid' : 'none',
                                                    borderColor: 'primary.light',
                                                    transition: 'all 0.3s',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setActiveStep(index)}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        bgcolor: activeStep === index ? 'primary.main' : 'grey.200',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        mr: 2,
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        color={activeStep === index ? 'white' : 'text.secondary'}
                                                        fontWeight="bold"
                                                    >
                                                        {step.step}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6" gutterBottom>
                                                        {step.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {step.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </motion.div>
                                    ))}

                                    <Box sx={{ mt: 6 }}>
                                        <Button
                                            variant="gradient"
                                            size="large"
                                            endIcon={<ArrowForward />}
                                        >
                                            Start Authentication Process
                                        </Button>
                                    </Box>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Demo Section */}
                <Box
                    sx={{
                        py: { xs: 8, md: 12 },
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -100,
                            right: -100,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: SwapTheme.palette.gradient.primary,
                            opacity: 0.1
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -100,
                            left: -100,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: SwapTheme.palette.gradient.secondary,
                            opacity: 0.1
                        }
                    }}
                >
                    <Container>
                        <Grid container spacing={6} alignItems="center">
                            <Grid item xs={12} md={5}>
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                >
                                    <Typography variant="overline" color="primary" fontWeight="bold">
                                        SEE IT IN ACTION
                                    </Typography>
                                    <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                                        Interactive Product Verification Demo
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        Try our authentication system yourself. See how easy it is to verify product authenticity and ownership history with our blockchain-powered solution.
                                    </Typography>

                                    <Box sx={{ mt: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Enter Product ID or Scan QR Code"
                                            variant="outlined"
                                            sx={{ mb: 2 }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            fullWidth
                                        >
                                            Verify Product
                                        </Button>
                                    </Box>
                                </motion.div>
                            </Grid>

                            <Grid item xs={12} md={7}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Box sx={{ position: 'relative' }}>
                                        <Box
                                            component="img"
                                            src="https://via.placeholder.com/600x400?text=Authentication+Demo"
                                            alt="Product Authentication Demo"
                                            sx={{
                                                width: '100%',
                                                borderRadius: 4,
                                                boxShadow: 3
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                bgcolor: 'rgba(0, 0, 0, 0.3)',
                                                borderRadius: '50%',
                                                width: 80,
                                                height: 80,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Box
                                                component={YouTube}
                                                sx={{
                                                    color: 'white',
                                                    fontSize: 40
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Testimonials Section */}
                <Box sx={{ py: { xs: 8, md: 12 } }}>
                    <Container>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="overline" color="secondary" fontWeight="bold">
                                SUCCESS STORIES
                            </Typography>
                            <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                                What Our Users Say
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                                Discover how our platform has transformed the way people buy and sell authenticated second-hand products.
                            </Typography>
                        </Box>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <Grid container spacing={4}>
                                {testimonials.map((testimonial, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <motion.div variants={fadeInUp}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    position: 'relative',
                                                    overflow: 'visible',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: -15,
                                                        left: 20,
                                                        width: 30,
                                                        height: 30,
                                                        bgcolor: 'background.paper',
                                                        transform: 'rotate(45deg)',
                                                        boxShadow: 1,
                                                        zIndex: -1
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ p: 4 }}>
                                                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                                                        "{testimonial.text}"
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar src={testimonial.image} alt={testimonial.name} sx={{ mr: 2 }} />
                                                        <Box>
                                                            <Typography variant="body1" fontWeight="bold">
                                                                {testimonial.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {testimonial.role}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    </Container>
                </Box>

                {/* Pricing Section */}
                <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
                    <Container>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="overline" color="primary" fontWeight="bold">
                                PRICING PLANS
                            </Typography>
                            <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                                Choose Your Plan
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                                Flexible plans to meet the needs of individual collectors and businesses of all sizes.
                            </Typography>
                        </Box>

                        <Grid container spacing={4} alignItems="center">
                            {pricingPlans.map((plan, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Card
                                            sx={{
                                                height: '100%',
                                                position: 'relative',
                                                transform: plan.recommended ? 'scale(1.05)' : 'none',
                                                boxShadow: plan.recommended ? 5 : 1,
                                                zIndex: plan.recommended ? 2 : 1,
                                                border: plan.recommended ? '2px solid' : 'none',
                                                borderColor: 'primary.main',
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    transform: plan.recommended ? 'scale(1.07)' : 'scale(1.02)',
                                                    boxShadow: plan.recommended ? 6 : 2
                                                }
                                            }}
                                        >
                                            {plan.recommended && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -15,
                                                        right: 0,
                                                        left: 0,
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <Chip
                                                        label="RECOMMENDED"
                                                        color="primary"
                                                        sx={{
                                                            fontSize: '0.8rem',
                                                            fontWeight: 'bold',
                                                            background: SwapTheme.palette.gradient.secondary
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                            <CardContent sx={{ p: 4 }}>
                                                <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: 'center' }}>
                                                    {plan.title}
                                                </Typography>
                                                <Typography
                                                    variant="h3"
                                                    color="primary"
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        my: 3
                                                    }}
                                                >
                                                    {plan.price}
                                                </Typography>
                                                <Divider sx={{ my: 3 }} />
                                                <List>
                                                    {plan.features.map((feature, featureIndex) => (
                                                        <ListItem key={featureIndex} disableGutters sx={{ py: 1 }}>
                                                            <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                                                                <CheckCircle color="primary" fontSize="small" />
                                                            </ListItemIcon>
                                                            <ListItemText primary={feature} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                                <Box sx={{ mt: 4, textAlign: 'center' }}>
                                                    <Button
                                                        variant={plan.recommended ? 'gradient' : 'outlined'}
                                                        color="primary"
                                                        size="large"
                                                        fullWidth
                                                    >
                                                        {plan.buttonText}
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* FAQ Section */}
                <Box sx={{ py: { xs: 8, md: 12 } }}>
                    <Container>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="overline" color="secondary" fontWeight="bold">
                                QUESTIONS & ANSWERS
                            </Typography>
                            <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                                Frequently Asked Questions
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                                Everything you need to know about our NFT authentication platform.
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2 }}>
                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={staggerContainer}
                                    >
                                        {faqs.slice(0, 2).map((faq, index) => (
                                            <motion.div key={index} variants={fadeInUp}>
                                                <Accordion
                                                    sx={{
                                                        mb: 2,
                                                        boxShadow: 'none',
                                                        '&:before': { display: 'none' },
                                                        bgcolor: 'background.paper',
                                                        borderRadius: 2,
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMore />}
                                                        sx={{
                                                            '& .MuiAccordionSummary-content': {
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }
                                                        }}
                                                    >
                                                        <QuestionAnswer color="primary" sx={{ mr: 2 }} />
                                                        <Typography variant="h6">{faq.question}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography variant="body1" color="text.secondary">
                                                            {faq.answer}
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2 }}>
                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={staggerContainer}
                                    >
                                        {faqs.slice(2, 4).map((faq, index) => (
                                            <motion.div key={index} variants={fadeInUp}>
                                                <Accordion
                                                    sx={{
                                                        mb: 2,
                                                        boxShadow: 'none',
                                                        '&:before': { display: 'none' },
                                                        bgcolor: 'background.paper',
                                                        borderRadius: 2,
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMore />}
                                                        sx={{
                                                            '& .MuiAccordionSummary-content': {
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }
                                                        }}
                                                    >
                                                        <QuestionAnswer color="primary" sx={{ mr: 2 }} />
                                                        <Typography variant="h6">{faq.question}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography variant="body1" color="text.secondary">
                                                            {faq.answer}
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                endIcon={<ArrowForward />}
                                size="large"
                            >
                                View All FAQs
                            </Button>
                        </Box>
                    </Container>
                </Box>

                {/* CTA Section */}
                <Box
                    sx={{
                        py: { xs: 10, md: 16 },
                        background: SwapTheme.palette.gradient.primary,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Container>
                        <Grid container spacing={6} alignItems="center" justifyContent="center">
                            <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Typography variant="h2" color="white" sx={{ mb: 3 }}>
                                        Ready to Authenticate Your Products?
                                    </Typography>
                                    <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
                                        Join thousands of users who are already experiencing the benefits of blockchain authentication.
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                bgcolor: 'white',
                                                color: 'primary.main',
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                                                }
                                            }}
                                        >
                                            Get Started For Free
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            sx={{
                                                borderColor: 'white',
                                                color: 'white',
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                                }
                                            }}
                                        >
                                            Request Demo
                                        </Button>
                                    </Box>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Footer */}
                <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
                    <Container>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                                    AuthentiChain
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Revolutionizing second-hand product authentication with blockchain technology. Ensuring trust and transparency in every transaction.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <IconButton color="primary" size="small" sx={{ bgcolor: 'rgba(77, 161, 169, 0.1)' }}>
                                        <Twitter />
                                    </IconButton>
                                    <IconButton color="primary" size="small" sx={{ bgcolor: 'rgba(77, 161, 169, 0.1)' }}>
                                        <Facebook />
                                    </IconButton>
                                    <IconButton color="primary" size="small" sx={{ bgcolor: 'rgba(77, 161, 169, 0.1)' }}>
                                        <Instagram />
                                    </IconButton>
                                    <IconButton color="primary" size="small" sx={{ bgcolor: 'rgba(77, 161, 169, 0.1)' }}>
                                        <LinkedIn />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    © {new Date().getFullYear()} AuthentiChain. All rights reserved.
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Platform
                                </Typography>
                                <List disablePadding>
                                    {['Features', 'Security', 'Pricing', 'Marketplace'].map((item) => (
                                        <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                                            <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                                                <Typography variant="body2">{item}</Typography>
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Company
                                </Typography>
                                <List disablePadding>
                                    {['About', 'Blog', 'Careers', 'Press'].map((item) => (
                                        <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                                            <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                                                <Typography variant="body2">{item}</Typography>
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Resources
                                </Typography>
                                <List disablePadding>
                                    {['Documentation', 'API', 'Guides', 'FAQ'].map((item) => (
                                        <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                                            <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                                                <Typography variant="body2">{item}</Typography>
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Legal
                                </Typography>
                                <List disablePadding>
                                    {['Terms', 'Privacy', 'Cookies', 'Licenses'].map((item) => (
                                        <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                                            <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                                                <Typography variant="body2">{item}</Typography>
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography variant="body2" color="text.secondary">
                                Authentication powered by blockchain technology
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <Button color="inherit" sx={{ textTransform: 'none' }}>
                                    <Typography variant="body2">Privacy Policy</Typography>
                                </Button>
                                <Button color="inherit" sx={{ textTransform: 'none' }}>
                                    <Typography variant="body2">Terms of Service</Typography>
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default LandingPageThree;