import React, { useState } from 'react';
import {
    TextField,
    Box,
    Grid,
    Button
} from '@mui/material';
import { API } from '../API/api';
import { useNavigate } from 'react-router-dom';

interface Address {
    house_no_or_name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    landmark: string;
    district: string;
}

const emptyAddress: Address = {
    house_no_or_name: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    landmark: '',
    district: ''
};

const AddressForm: React.FC = () => {
    const [address, setAddress] = useState<Address>(emptyAddress);
    const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof Address, string>>>({});

    const navigate = useNavigate();

    const handleAddressChange = (field: keyof Address) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const updatedAddress = { ...address, [field]: value };
        setAddress(updatedAddress);

        if (addressErrors[field]) {
            setAddressErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateAddress = (): boolean => {
        const newErrors: Partial<Record<keyof Address, string>> = {};
        const requiredFields: (keyof Address)[] = [
            'house_no_or_name',
            'street',
            'city',
            'state',
            'postal_code',
            'country',
            'district'
        ];

        requiredFields.forEach(field => {
            if (!address[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        setAddressErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddressSubmit = async () => {
        if (!validateAddress()) {
            return;
        }

        try {
            const response = await API.post('order/create/address/', address);
            console.log('Address submitted successfully:', response.data);
            navigate("/")

        } catch (error) {
            console.error('Error submitting address:', error);
        }
    };

    return (
        <Box sx={{ p: 4, bgcolor: 'background.default' }}>
            <h5 style={{textAlign: 'center'}}>Submit Address</h5>
            <h6 style={{ textAlign: 'center' }}>Please fill in the following details to submit your address.</h6>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        autoFocus
                        label="House Number/Name"
                        fullWidth
                        variant="outlined"
                        value={address.house_no_or_name}
                        onChange={handleAddressChange('house_no_or_name')}
                        error={!!addressErrors.house_no_or_name}
                        helperText={addressErrors.house_no_or_name}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Landmark"
                        fullWidth
                        variant="outlined"
                        value={address.landmark}
                        onChange={handleAddressChange('landmark')}
                        error={!!addressErrors.landmark}
                        helperText={addressErrors.landmark}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Street"
                        fullWidth
                        variant="outlined"
                        value={address.street}
                        onChange={handleAddressChange('street')}
                        error={!!addressErrors.street}
                        helperText={addressErrors.street}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="City"
                        fullWidth
                        variant="outlined"
                        value={address.city}
                        onChange={handleAddressChange('city')}
                        error={!!addressErrors.city}
                        helperText={addressErrors.city}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="State/Province"
                        fullWidth
                        variant="outlined"
                        value={address.state}
                        onChange={handleAddressChange('state')}
                        error={!!addressErrors.state}
                        helperText={addressErrors.state}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="District"
                        fullWidth
                        variant="outlined"
                        value={address.district}
                        onChange={handleAddressChange('district')}
                        error={!!addressErrors.district}
                        helperText={addressErrors.district}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Postal/Zip Code"
                        fullWidth
                        variant="outlined"
                        value={address.postal_code}
                        onChange={handleAddressChange('postal_code')}
                        error={!!addressErrors.postal_code}
                        helperText={addressErrors.postal_code}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Country"
                        fullWidth
                        variant="outlined"
                        value={address.country}
                        onChange={handleAddressChange('country')}
                        error={!!addressErrors.country}
                        helperText={addressErrors.country}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddressSubmit}
                        fullWidth
                    >
                        Submit Address
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddressForm;
