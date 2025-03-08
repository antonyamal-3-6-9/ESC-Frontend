import React, { useState } from 'react';
import {
    Card, Grid, Typography, TextField, IconButton, 
    Box, Collapse, Button, Avatar, Chip, Paper,
    Fade, Zoom, Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    ExpandMore as ExpandMoreIcon,
    AccountCircle,
    Wallet,
    CalendarToday,
    ShoppingCart,
    Sell,
    Collections,
    VerifiedUser
} from '@mui/icons-material';
import NFTCollection from '../NFT/Collection/CollectionListing';
import RouteDisplayC from '../RouteDisplay';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[4],
    padding: theme.spacing(3),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
}));

const NFTCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(145deg, #2193b0 0%, #6dd5ed 100%)',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
    color: theme.palette.common.white,
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.03) translateY(-5px)',
        boxShadow: `0 12px 20px -10px rgba(33, 147, 176, 0.3)`,
    },
}));

const EditableField = ({ label, value, isEditing, onEdit, onSave, onChange }) => {
    return (
        <Box sx={{ mb: 2, transition: 'all 0.3s ease' }}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Fade in={true}>
                {isEditing ? (
                    <TextField
                        fullWidth
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        variant="standard"
                        InputProps={{
                            endAdornment: (
                                <Zoom in={true}>
                                    <IconButton onClick={onSave} color="primary">
                                        <SaveIcon />
                                    </IconButton>
                                </Zoom>
                            ),
                        }}
                    />
                ) : (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1">{value}</Typography>
                        <IconButton size="small" onClick={onEdit}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </Fade>
        </Box>
    );
};

const StatsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f5f9 100%)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));

export const UserProfile = () => {
    const [expanded, setExpanded] = useState(false);
    const [editMode, setEditMode] = useState({
        firstName: false,
        lastName: false,
        username: false,
        email: false,
    });

    const [userData, setUserData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'Verified User',
        walletPubKey: '0x1234...5678',
        totalPurchases: 12,
        totalSales: 8,
        ownedAssets: 5,
        dateJoined: '2024-01-01',
    });

    const [ownedNFTs] = useState([
        {
            id: 1,
            name: 'Cosmic Horizon #123',
            collection: 'Cosmic Series',
            rarity: 'Legendary',
            price: '0.5 ETH',
            lastTraded: '2024-02-15',
            imageUrl: 'https://via.placeholder.com/150',
            attributes: ['Rare', 'Animated'],
        },
        // Add more NFTs as needed
    ]);

    const handleEdit = (field) => {
        setEditMode({ ...editMode, [field]: true });
    };

    const handleSave = (field) => {
        setEditMode({ ...editMode, [field]: false });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
            <RouteDisplayC />
            <Fade in={true} timeout={800}>
                <StyledCard>
                    <Grid container spacing={4}>
                        <Grid item xs={12} display="flex" alignItems="center" gap={3}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: 'primary.main',
                                    fontSize: '2.5rem',
                                    boxShadow: 3,
                                }}
                            >
                                {userData.firstName[0]}{userData.lastName[0]}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" gutterBottom fontWeight="bold">
                                    {userData.firstName} {userData.lastName}
                                </Typography>
                                <Chip
                                    icon={<VerifiedUser />}
                                    label={userData.role}
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Chip
                                    icon={<CalendarToday />}
                                    label={`Joined ${userData.dateJoined}`}
                                    variant="outlined"
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            {Object.keys(editMode).map((field) => (
                                <EditableField
                                    key={field}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={userData[field]}
                                    isEditing={editMode[field]}
                                    onEdit={() => handleEdit(field)}
                                    onSave={() => handleSave(field)}
                                    onChange={(value) => setUserData({ ...userData, [field]: value })}
                                />
                            ))}
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: "center" }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Wallet Address
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Wallet color="secondary" />
                                    <Typography variant="body2">{userData.walletPubKey}</Typography>
                                </Box>
                                </Box>
                     

                            <Grid container spacing={2}>
                                {[
                                    { icon: <ShoppingCart />, label: 'Purchases', value: userData.totalPurchases },
                                    { icon: <Sell />, label: 'Sales', value: userData.totalSales },
                                    { icon: <Collections />, label: 'Assets', value: userData.ownedAssets }
                                ].map((stat, index) => (
                                    <Grid item xs={4} key={index}>
                                        <StatsCard>
                                            {stat.icon}
                                            <Typography variant="h6" sx={{ mt: 1 }}>{stat.value}</Typography>
                                            <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                                        </StatsCard>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <Typography variant="button" display="block" sx={{ mt: 1, m: 0, p: 0 }}>
                                {expanded ? 'Hide Assets' : 'Show Assets'}
                            </Typography>
                            <IconButton
                                onClick={() => setExpanded(!expanded)}
                                sx={{
                                    mt: 0,
                                    transition: 'all 0.3s ease',
                                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    '&:hover': {
                                        transform: expanded ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)',
                                    },
                                }}
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </StyledCard>
            </Fade>

            <Collapse in={expanded} timeout={700}>
                <NFTCollection />
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="medium">
                        Owned NFTs ({userData.ownedAssets})
                    </Typography>
                    <Grid container spacing={3}>
                        {ownedNFTs.map((nft, index) => (
                            <Grid item xs={12} sm={6} md={4} key={nft.id}>
                                <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                                    <NFTCard>
                                        <Box
                                            component="img"
                                            src={nft.imageUrl}
                                            alt={nft.name}
                                            sx={{
                                                width: '100%',
                                                height: 200,
                                                objectFit: 'cover',
                                                borderRadius: 2,
                                                mb: 2,
                                            }}
                                        />
                                        <Typography variant="h6">{nft.name}</Typography>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2">{nft.collection}</Typography>
                                            <Chip
                                                label={nft.rarity}
                                                size="small"
                                                color="secondary"
                                            />
                                        </Box>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2">Price: {nft.price}</Typography>
                                            <Box display="flex" gap={1} mt={1}>
                                                {nft.attributes.map((attr, i) => (
                                                    <Chip key={i} label={attr} size="small" variant="outlined" />
                                                ))}
                                            </Box>
                                        </Box>
                                    </NFTCard>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Collapse>
        </Container>
    );
};

export default UserProfile;