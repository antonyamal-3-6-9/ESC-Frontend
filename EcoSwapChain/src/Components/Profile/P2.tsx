import { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Typography,
    TextField,
    Chip,
    Badge,
    List,
    ListItem,
    ListItemText,
    Switch,
    Tooltip,
    CardContent
} from '@mui/material';
import {
    Edit,
    ContentCopy,
    Verified,
    VerifiedUser,
    History,
    Inventory,
    Settings,
    MonetizationOn,
    Send,
    Visibility,
    QrCode2,
    Add,
    ArrowUpward,
    Info,
    Key,
    LocalOffer,
    NotificationsActive
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;// for spreading ...other
}

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const UserProfileSection = () => {
    const [tabValue, setTabValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    // Sample user data - in a real app would come from API/context
    const userData = {
        name: "Alex Johnson",
        username: "alexj",
        walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        email: "alex.johnson@example.com",
        joined: "March 2024",
        avatarUrl: "https://via.placeholder.com/150",
        verificationLevel: "Premium",
        totalItems: 27,
        activeListings: 6,
        itemsSold: 14,
        reputation: 4.9,
        bio: "Collector of vintage electronics and rare sneakers. Passionate about sustainable consumption and authentic goods.",
        socials: {
            twitter: "@alex_authentic",
            instagram: "@alexj_collect",
            website: "alexjohnson.io"
        },
        verificationBadge: true,
        notifications: {
            alerts: true,
            newsletter: true,
            marketUpdates: false,
            authRequests: true
        }
    };

    // Sample NFT items owned
    const ownedItems = [
        {
            id: "NFT-7842",
            name: "Air Jordan 3 Retro 'Black Cement'",
            purchaseDate: "2024-02-15",
            price: "$320",
            authenticatedOn: "2024-02-16",
            image: "https://via.placeholder.com/100",
            status: "Owned",
            lastVerified: "2 days ago"
        },
        {
            id: "NFT-6531",
            name: "Vintage Seiko Chronograph Watch",
            purchaseDate: "2023-10-20",
            price: "$850",
            authenticatedOn: "2023-10-22",
            image: "https://via.placeholder.com/100",
            status: "Listed",
            lastVerified: "1 week ago"
        },
        {
            id: "NFT-9023",
            name: "Sony Walkman TPS-L2 (1979)",
            purchaseDate: "2023-08-05",
            price: "$720",
            authenticatedOn: "2023-08-07",
            image: "https://via.placeholder.com/100",
            status: "Owned",
            lastVerified: "1 month ago"
        },
        {
            id: "NFT-4321",
            name: "Louis Vuitton Keepall Bandoulière 55",
            purchaseDate: "2024-01-10",
            price: "$1,850",
            authenticatedOn: "2024-01-12",
            image: "https://via.placeholder.com/100",
            status: "Listed",
            lastVerified: "2 weeks ago"
        }
    ];

    // Sample transactions
    const recentTransactions = [
        {
            id: "TX-53697",
            type: "Purchase",
            item: "Omega Speedmaster Professional",
            date: "2024-03-01",
            amount: "$3,650",
            from: "user_watchcollector"
        },
        {
            id: "TX-53545",
            type: "Sale",
            item: "Leica M6 Camera",
            date: "2024-02-24",
            amount: "$2,200",
            to: "user_lensmaster"
        },
        {
            id: "TX-52832",
            type: "Authentication",
            item: "Nike SB Dunk Low 'Paris'",
            date: "2024-02-15",
            amount: "Premium Plan",
            status: "Completed"
        },
        {
            id: "TX-51790",
            type: "Sale",
            item: "Vintage IBM Model M Keyboard",
            date: "2024-01-30",
            amount: "$180",
            to: "user_retrotech"
        }
    ];

    // Sample authentication requests
    const pendingRequests = [
        {
            id: "REQ-1025",
            item: "Rolex Submariner Date",
            requestDate: "2024-03-05",
            status: "In Progress",
            estimatedCompletion: "2024-03-08"
        },
        {
            id: "REQ-1018",
            item: "Supreme Box Logo Hoodie FW17",
            requestDate: "2024-03-02",
            status: "Awaiting Photos",
            estimatedCompletion: "Pending"
        }
    ];

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
            <Container>
                <Typography variant="h2" component="h1" gutterBottom sx={{
                    textAlign: 'center',
                    mb: 6,
                    fontWeight: 700,
                    background: theme => theme.palette.gradient.secondary,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    User Profile
                </Typography>

                <Grid container spacing={4}>
                    {/* Profile sidebar */}
                    <Grid item xs={12} md={4}>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                        >
                            <Card sx={{ mb: 4, position: 'relative' }}>
                                {userData.verificationBadge && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            zIndex: 1
                                        }}
                                    >
                                        <Tooltip title="Verified Account">
                                            <Badge
                                                badgeContent={<VerifiedUser fontSize="small" />}
                                                color="primary"
                                                sx={{
                                                    '& .MuiBadge-badge': {
                                                        bgcolor: 'accent.main',
                                                        p: 1,
                                                        borderRadius: '50%'
                                                    }
                                                }}
                                            />
                                        </Tooltip>
                                    </Box>
                                )}

                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Avatar
                                        src={userData.avatarUrl}
                                        alt={userData.name}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            mx: 'auto',
                                            mb: 2,
                                            border: '4px solid',
                                            borderColor: 'accent.light'
                                        }}
                                    />

                                    <Typography variant="h4" gutterBottom>
                                        {userData.name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            @{userData.username}
                                        </Typography>
                                        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 16 }} />
                                        <Chip
                                            size="small"
                                            label={userData.verificationLevel}
                                            color="primary"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Key fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                                            {userData.walletAddress.substring(0, 6)}...{userData.walletAddress.substring(userData.walletAddress.length - 4)}
                                        </Typography>
                                        <IconButton size="small" onClick={() => navigator.clipboard.writeText(userData.walletAddress)}>
                                            <ContentCopy fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    {!isEditing ? (
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {userData.bio}
                                        </Typography>
                                    ) : (
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            defaultValue={userData.bio}
                                            sx={{ mb: 2 }}
                                        />
                                    )}

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={isEditing ? <Verified /> : <Edit />}
                                        onClick={() => setIsEditing(!isEditing)}
                                        sx={{ mb: 2 }}
                                    >
                                        {isEditing ? 'Save Profile' : 'Edit Profile'}
                                    </Button>

                                    <Divider sx={{ my: 2 }} />

                                    <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                                        <Grid item xs={4}>
                                            <Typography variant="h6" color="primary" fontWeight="bold">
                                                {userData.totalItems}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Items
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="h6" color="primary" fontWeight="bold">
                                                {userData.itemsSold}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Sold
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="h6" color="primary" fontWeight="bold">
                                                {userData.reputation}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Rating
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                            Account Details
                                        </Typography>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">Email</Typography>
                                            <Typography variant="body2">{userData.email}</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">Member Since</Typography>
                                            <Typography variant="body2">{userData.joined}</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">Listings</Typography>
                                            <Typography variant="body2">{userData.activeListings} active</Typography>
                                        </Box>

                                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                                            Social Profiles
                                        </Typography>

                                        {Object.entries(userData.socials).map(([platform, handle]) => (
                                            <Box key={platform} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                                    {platform}
                                                </Typography>
                                                <Typography variant="body2">{handle}</Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Button
                                        variant="text"
                                        color="primary"
                                        startIcon={<QrCode2 />}
                                        sx={{ mt: 3 }}
                                    >
                                        Show Profile QR Code
                                    </Button>
                                </Box>
                            </Card>

                            <Card>
                                <Box sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Notification Settings
                                    </Typography>

                                    <List disablePadding>
                                        {Object.entries(userData.notifications).map(([key, enabled]) => (
                                            <ListItem
                                                key={key}
                                                disablePadding
                                                secondaryAction={
                                                    <Switch
                                                        edge="end"
                                                        checked={enabled}
                                                        color="primary"
                                                    />
                                                }
                                                sx={{ py: 1 }}
                                            >
                                                <ListItemText
                                                    primary={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Main content area */}
                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 2 }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    '& .MuiTab-root': {
                                        mx: 1,
                                        borderRadius: 2,
                                        minHeight: 48,
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.light',
                                            color: 'primary.contrastText',
                                            fontWeight: 'bold'
                                        }
                                    }
                                }}
                            >
                                <Tab icon={<Inventory />} label="My Items" iconPosition="start" />
                                <Tab icon={<History />} label="Transactions" iconPosition="start" />
                                <Tab icon={<LocalOffer />} label="Authentication Requests" iconPosition="start" />
                                <Tab icon={<Settings />} label="Account Settings" iconPosition="start" />
                            </Tabs>
                        </Box>

                        {/* My Items Tab */}
                        <TabPanel value={tabValue} index={0}>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h5">My Authenticated Items</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Add />}
                                    >
                                        Add New Item
                                    </Button>
                                </Box>

                                <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Filter by: <strong>All Items</strong>
                                        </Typography>
                                        <TextField
                                            placeholder="Search items..."
                                            size="small"
                                            InputProps={{
                                                sx: { borderRadius: 3 }
                                            }}
                                        />
                                    </Box>

                                    <Grid container spacing={3}>
                                        {ownedItems.map((item) => (
                                            <Grid item xs={12} sm={6} key={item.id}>
                                                <Card sx={{
                                                    display: 'flex',
                                                    position: 'relative',
                                                    padding: 0,
                                                    overflow: 'hidden'
                                                }}>
                                                    <Box sx={{
                                                        width: 100,
                                                        flexShrink: 0,
                                                        backgroundImage: `url(${item.image})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }} />

                                                    <CardContent sx={{ flexGrow: 1, py: 2 }}>
                                                        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                                            <Chip
                                                                label={item.status}
                                                                size="small"
                                                                color={item.status === 'Listed' ? 'primary' : 'default'}
                                                            />
                                                        </Box>

                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                            {item.name}
                                                        </Typography>

                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            ID: {item.id}
                                                        </Typography>

                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {item.price}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Verified fontSize="small" color="primary" sx={{ mr: 0.5, fontSize: '1rem' }} />
                                                                Verified {item.lastVerified}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            endIcon={<ArrowUpward />}
                                        >
                                            Load More Items
                                        </Button>
                                    </Box>
                                </Paper>

                                <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Info color="primary" />
                                        <Typography variant="subtitle1">Authentication Stats</Typography>
                                    </Box>

                                    <Grid container spacing={3}>
                                        <Grid item xs={6} md={3}>
                                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                                <Typography variant="h5" color="primary" gutterBottom>
                                                    {userData.totalItems}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Total Items
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                                <Typography variant="h5" color="primary" gutterBottom>
                                                    14
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    This Year
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                                <Typography variant="h5" color="primary" gutterBottom>
                                                    6
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    This Month
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                                <Typography variant="h5" color="primary" gutterBottom>
                                                    2
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    This Week
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </motion.div>
                        </TabPanel>

                        {/* Transactions Tab */}
                        <TabPanel value={tabValue} index={1}>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                            >
                                <Typography variant="h5" gutterBottom>Transaction History</Typography>

                                <Paper sx={{ overflow: 'hidden', borderRadius: 2 }}>
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Transaction</TableCell>
                                                    <TableCell>Item</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell align="right">Amount</TableCell>
                                                    <TableCell>Details</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {recentTransactions.map((transaction) => (
                                                    <TableRow
                                                        key={transaction.id}
                                                        hover
                                                        sx={{
                                                            '&:last-child td, &:last-child th': { border: 0 },
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {transaction.type}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {transaction.id}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="View Item Details">
                                                                <Typography variant="body2" sx={{ color: 'primary.main' }}>
                                                                    {transaction.item}
                                                                </Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {transaction.date}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {transaction.amount}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {transaction.type === 'Purchase' && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    From: {transaction.from}
                                                                </Typography>
                                                            )}
                                                            {transaction.type === 'Sale' && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    To: {transaction.to}
                                                                </Typography>
                                                            )}
                                                            {transaction.type === 'Authentication' && (
                                                                <Chip
                                                                    label={transaction.status}
                                                                    size="small"
                                                                    color="success"
                                                                    sx={{ fontSize: '0.7rem' }}
                                                                />
                                                            )}
                                                            <IconButton size="small" sx={{ ml: 1 }}>
                                                                <Visibility fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                    <Button variant="outlined" color="primary" startIcon={<MonetizationOn />}>
                                        View All Transactions
                                    </Button>
                                    <Button variant="contained" color="primary" startIcon={<Send />}>
                                        Export History
                                    </Button>
                                </Box>
                            </motion.div>
                        </TabPanel>

                        {/* Authentication Requests Tab */}
                        <TabPanel value={tabValue} index={2}>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h5">Authentication Requests</Typography>
                                    <Button
                                        variant="gradient"
                                        startIcon={<Add />}
                                    >
                                        New Authentication
                                    </Button>
                                </Box>

                                <Typography variant="subtitle1" sx={{ mb: 2 }}>Pending Requests</Typography>

                                {pendingRequests.length > 0 ? (
                                    <Grid container spacing={3}>
                                        {pendingRequests.map((request) => (
                                            <Grid item xs={12} key={request.id}>
                                                <Card sx={{ padding: 0 }}>
                                                    <Box sx={{ p: 3 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Box>
                                                                <Typography variant="subtitle1" gutterBottom>
                                                                    {request.item}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Request ID: {request.id}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Submitted: {request.requestDate}
                                                                </Typography>
                                                            </Box>
                                                            <Chip
                                                                label={request.status}
                                                                color={request.status === 'In Progress' ? 'primary' : 'default'}
                                                            />
                                                        </Box>

                                                        <Divider sx={{ my: 2 }} />

                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Box>
                                                                <Typography variant="body2">
                                                                    Estimated completion: {request.estimatedCompletion}
                                                                </Typography>
                                                                {request.status === 'Awaiting Photos' && (
                                                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                                                        Action required: Upload additional photos
                                                                    </Typography>
                                                                )}
                                                            </Box>

                                                            <Box>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    size="small"
                                                                    sx={{ mr: 1 }}
                                                                >
                                                                    View Details
                                                                </Button>
                                                                {request.status === 'Awaiting Photos' && (
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        size="small"
                                                                    >
                                                                        Upload Photos
                                                                    </Button>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    {request.status === 'In Progress' && (
                                                        <Box sx={{ p: 2, bgcolor: 'primary.light', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                                                            <Typography variant="body2" color="primary.contrastText" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <NotificationsActive fontSize="small" sx={{ mr: 1 }} />
                                                                Our authentication team is currently reviewing your item. You'll receive a notification once complete.
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            You have no pending authentication requests.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ mt: 2 }}
                                            startIcon={<Add />}
                                        >
                                            Create New Request
                                        </Button>
                                    </Box>
                                )}

                                <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>Recently Completed</Typography>

                                <Card sx={{ padding: 0 }}>
                                    <Box sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Nike SB Dunk Low 'Paris'
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Request ID: REQ-1005
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label="Completed"
                                                color="success"
                                            />
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="body2">
                                                    Completed on: 2024-02-15
                                                </Typography>
                                                <Typography variant="body2" color="success.main" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                    <Verified fontSize="small" sx={{ mr: 0.5 }} />
                                                    Authentication successful
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                >
                                                    View Certificate
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                >
                                                    List for Sale
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            </motion.div>
                        </TabPanel>

                        {/* Account Settings Tab */}
                        <TabPanel value={tabValue} index={3}>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                            >
                                <Typography variant="h5" gutterBottom>Account Settings</Typography>

                                <Card sx={{ mb: 4 }}>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                                            Profile Information
                                        </Typography>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Full Name"
                                                    defaultValue={userData.name}
                                                    variant="outlined"
                                                    margin="normal"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Username"
                                                    defaultValue={userData.username}
                                                    variant="outlined"
                                                    margin="normal"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    defaultValue={userData.email}
                                                    variant="outlined"
                                                    margin="normal"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Bio"
                                                    defaultValue={userData.bio}
                                                    multiline
                                                    rows={4}
                                                    variant="outlined"
                                                    margin="normal"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                            >
                                                Save Changes
                                            </Button>
                                        </Box>
                                    </Box>
                                </Card>

                                <Card sx={{ mb: 4 }}>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                                            Social Media Profiles
                                        </Typography>

                                        <Grid container spacing={3}>
                                            {Object.entries(userData.socials).map(([platform, handle]) => (
                                                <Grid item xs={12} sm={6} key={platform}>
                                                    <TextField
                                                        fullWidth
                                                        label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                        defaultValue={handle}
                                                        variant="outlined"
                                                        margin="normal"
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                            >
                                                Save Changes
                                            </Button>
                                        </Box>
                                    </Box>
                                </Card>

                                <Card sx={{ mb: 4 }}>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                                            Security Settings
                                        </Typography>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" gutterBottom>
                                                Change Password
                                            </Typography>

                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Current Password"
                                                        type="password"
                                                        variant="outlined"
                                                        margin="normal"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="New Password"
                                                        type="password"
                                                        variant="outlined"
                                                        margin="normal"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Confirm New Password"
                                                        type="password"
                                                        variant="outlined"
                                                        margin="normal"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        <Divider sx={{ my: 3 }} />

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" gutterBottom>
                                                Two-Factor Authentication
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                <Box>
                                                    <Typography variant="body2">
                                                        Enable two-factor authentication for enhanced security
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        We'll send a verification code to your phone when you sign in
                                                    </Typography>
                                                </Box>
                                                <Switch defaultChecked />
                                            </Box>
                                        </Box>

                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                            >
                                                Update Security Settings
                                            </Button>
                                        </Box>
                                    </Box>
                                </Card>

                                <Card>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom fontWeight="medium" color="error">
                                            Danger Zone
                                        </Typography>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                            <Box>
                                                <Typography variant="body2">
                                                    Deactivate Account
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Temporarily disable your account
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                            >
                                                Deactivate
                                            </Button>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="body2">
                                                    Delete Account
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Permanently delete your account and all data
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </Box>
                                </Card>
                            </motion.div>
                        </TabPanel>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

// TabPanel component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
};
export default UserProfileSection;