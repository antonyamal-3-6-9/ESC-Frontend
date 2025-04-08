import React, { useEffect, useState } from 'react';
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
    Wallet,
    CalendarToday,
    ShoppingCart,
    Sell,
    Collections,
    VerifiedUser,
} from '@mui/icons-material';
import NFTCollection from '../NFT/Collection/CollectionListing';
import { setLoading } from '../../Redux/alertBackdropSlice';
import { useDispatch } from 'react-redux';
import { API } from '../API/api';
import AddressManager from './AddressManager';
import { Address } from './AddressManager';

// Type definitions

interface User {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    role: string;
}

interface UserData {
    user: User,
    walletPubKey: string;
    totalPurchases: number;
    totalSales: number;
    ownedAssets: number;
    dateJoined: string;
    addresses: Address[];
}

interface EditModeState {
    first_name: boolean;
    last_name: boolean;
    username: boolean;
    email: boolean;
}

interface EditableFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onChange: (value: string) => void;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
}

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


const EditableField: React.FC<EditableFieldProps> = ({ label, value, isEditing, onEdit, onSave, onChange }) => {
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

export const UserProfile: React.FC = () => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<EditModeState>({
        first_name: false,
        last_name: false,
        username: false,
        email: false,
    });

    const [userData, setUserData] = useState<UserData>({
        user: {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            role: '',
        },
        walletPubKey: '',
        totalPurchases: 0,
        totalSales: 0,
        ownedAssets: 0,
        dateJoined: '',
        addresses: []
    });

    const dispatch = useDispatch();

    const fetchData = async () => {
        dispatch(setLoading(true));
        try {
            const response = await API.get(`/trader/retrieve/`);
            console.log(response.data.trader);
            setUserData(response.data.trader);
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (field: keyof EditModeState): void => {
        setEditMode({ ...editMode, [field]: true });
    };

    const handleSave = (field: keyof EditModeState): void => {
        setEditMode({ ...editMode, [field]: false });
    };

    const handleChange = (field: keyof User, value: string): void => {
        setUserData({ ...userData, [field]: value });
    };

    return (
        <Container maxWidth="lg">
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
                                {userData.user.first_name[0]}{userData.user.last_name[0]}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" gutterBottom fontWeight="bold">
                                    {userData.user.first_name} {userData.user.last_name}
                                </Typography>
                                <Chip
                                    icon={<VerifiedUser />}
                                    label={userData.user.role}
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
                            {(Object.keys(editMode) as Array<keyof EditModeState>).map((field) => (
                                <EditableField
                                    key={field}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={userData.user[field]}
                                    isEditing={editMode[field]}
                                    onEdit={() => handleEdit(field)}
                                    onSave={() => handleSave(field)}
                                    onChange={(value) => handleChange(field, value)}
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
                                ].map((stat: StatCardProps, index: number) => (
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
                        <AddressManager addressesData={userData.addresses}/>
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
            </Collapse>
        </Container>
    );
};

export default UserProfile;