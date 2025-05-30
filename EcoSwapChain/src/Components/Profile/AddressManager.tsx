import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    Button,
    Grid,
    Chip,
    IconButton,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    LocationOn,
    Star as StarIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import AddressModal from './AddressModal';
import { API } from '../API/api';
import { setLoading } from '../../Redux/alertBackdropSlice';
import { useDispatch } from 'react-redux';


// Interface for the Address type based on the Django model
export interface Address {
    id?: number;
    house_no_or_name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    landmark: string;
    district_number?: number | null;
    district?: string | null;
    default: boolean;
}

interface AddressProps {
    addressesData: Address[]
}

const AddressManager: React.FC<AddressProps> = ({ addressesData }) => {

    console.log(addressesData)

    const [addresses, setAddresses] = useState<Address[]>(addressesData);
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setAddresses(addressesData)
    }, [addressesData])

    const dispatch = useDispatch()

    // Open modal to add new address
    const handleAddAddress = () => {
        setSelectedAddress(undefined);
        setModalOpen(true);
    };

    // Open modal to edit existing address
    const handleEditAddress = (address: Address) => {
        setSelectedAddress(address);
        setModalOpen(true);
    };

    // Save address (create or update)
    const handleSaveAddress = async (address: Address): Promise<void> => {
        dispatch(setLoading(true))
        console.log(address)
        try {
            if (address.id) {
                // Update existing address
      

                await API.put(`/order/update/address/${address.id}/`, {
                    "address" : address
                });
                
                setAddresses((prev) => prev.map((addr) => (addr.id === address.id ? {...addr, ...address} : addr)));

                if (address.default) {
                    setAddresses((prev) =>
                        prev.map((addr) =>
                            addr.id === address.id
                                ? { ...addr, default: true }
                                : { ...addr, default: false }
                        )
                    );
                }
            } else {
                // Create new address
                const { data } = await API.post('/order/address/create/', {
                    "address": address
                });
                if (data.address.default) {
                    setAddresses((prev) =>
                        prev.map((addr) => ({
                            ...addr,
                            default: false,
                        }))
                    );
                }
                setAddresses(prev => [...prev, data.address]);
            }
        } catch (error) {
            console.error('Error saving address:', error);
            throw error;
        } finally {
            dispatch(setLoading(false))
        }
    };

    // Delete address
    const handleDeleteAddress = async (id: number): Promise<void> => {
        try {
            await fetch(`/api/addresses/${id}/`, {
                method: 'DELETE'
            });

            setAddresses(prev => prev.filter(addr => addr.id !== id));
        } catch (error) {
            console.error('Error deleting address:', error);
            throw error;
        }
    };

    return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" sx={{textAlign: "center"}} fontWeight="600">My Addresses</Typography>
                    <Button
                        variant="gradient"
                        startIcon={<AddIcon />}
                        onClick={handleAddAddress}
                    >
                        Add Address
                    </Button>
                </Box>

                {  addresses.length === 0 ? (
                    <Card sx={{ p: 4, textAlign: 'center' }}>
                        <LocationOn sx={{ fontSize: 60, color: 'secondary.main', opacity: 0.7, mb: 2 }} />
                        <Typography variant="h6" gutterBottom>No Addresses Found</Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            You haven't added any addresses yet. Add your first address to get started.
                        </Typography>
                        <Button
                            variant="gradient"
                            startIcon={<AddIcon />}
                            onClick={handleAddAddress}
                        >
                            Add Address
                        </Button>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {addresses.map(address => (
                            <Grid item xs={12} md={6} key={address.id}>
                                <Card
                                    sx={{
                                        position: 'relative',
                                        border: address.default ? '2px solid' : 'none',
                                        borderColor: 'accent.main'
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between">
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <LocationOn color="primary" />
                                            <Typography variant="subtitle1" fontWeight="600">
                                                {address.house_no_or_name}, {address.street}
                                            </Typography>
                                            {address.default && (
                                                <Chip
                                                    icon={<StarIcon fontSize="small" />}
                                                    label="Default"
                                                    size="small"
                                                    color="secondary"
                                                />
                                            )}
                                        </Box>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditAddress(address)}
                                                sx={{ color: 'secondary.main' }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="body2">
                                        {address.city}, {address.state} {address.postal_code}
                                    </Typography>
                                    <Typography variant="body2">{address.country}</Typography>

                                    {address.landmark && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Landmark: {address.landmark}
                                        </Typography>
                                    )}

                                    {address.district && (
                                        <Typography variant="body2" color="text.secondary">
                                            District: {address.district} {address.district_number && `#${address.district_number}`}
                                        </Typography>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <AddressModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    address={selectedAddress}
                    onSave={handleSaveAddress}
                    onDelete={handleDeleteAddress}
                />
            </Container>
    );
};

export default AddressManager;