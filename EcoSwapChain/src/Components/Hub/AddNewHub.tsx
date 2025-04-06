import React, { useState, Suspense } from 'react';
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
    Grid,
    CircularProgress,
    FormHelperText,
    useTheme,
    Divider,
    Paper,
    SelectChangeEvent,
    Container,
    Grid2
} from '@mui/material';
import {
    Building,
} from 'lucide-react';
import LocationPicker from './LocationPicker';
import { Link } from 'react-router';
import { API } from '../API/api';
import { useNavigate } from 'react-router';
import { setLoading } from '../../Redux/alertBackdropSlice';
import { useDispatch } from 'react-redux';



interface HubData {
    email: string;
    password: string;
    latitude: string;
    longitude: string;
    hub_type: string;
    district: string;
    state: string;
    pincode: string;
}

interface ErrorState {
    email?: string;
    password?: string;
    latitude?: string;
    longitude?: string;
    hub_type?: string;
    district?: string;
    state?: string;
    pincode?: string;
}


const ShippingHubForm: React.FC = () => {
    const theme = useTheme();
    const [hubData, setHubData] = useState<HubData>({

        email: '',
        password: '',

        latitude: '',
        longitude: '',
        hub_type: '',
        district: '',
        state: '',
        pincode: '',
    });

    const navigate = useNavigate();

    const dispatch = useDispatch()

    const onSubmit = async () => {
        dispatch(setLoading(true))
        try {
            await API.post("admin/hub/create/", hubData);
            navigate("/admin/hub/manage/");
        } catch (error) {
            console.error("Hub creation failed:", error);
            dispatch(setLoading(false))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const [errors, setErrors] = useState<ErrorState>({});


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHubData(prev => ({
                ...prev,
                [name] : value
            }))
        if (errors[name as keyof ErrorState]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setHubData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof ErrorState]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    async function getLocationDetails(lat: number, lon: number): Promise<void> {
        const url = `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${lat}&lon=${lon}`;

        console.log(url)

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data)
            console.log(data.features[0].properties.address)
            setHubData(prev => ({
                ...prev,
                pincode: data.features[0].properties.address.postcode || "Pincode not found",
                district: data.features[0].properties.address?.district || data.features[0].properties.address?.county || data.features[0].properties.address?.city || "District not found",
                state: data.features[0].properties.address?.state || "State not found",
            }))
        } catch (error) {
            console.error("Error fetching location details:", error);
        }
    }


    // Handle location selection from the map
    const handleLocationSelect = (lat: number, lng: number) => {
        setHubData(prev => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
        }));

        getLocationDetails(lat, lng);

        if (errors.latitude || errors.longitude) {
            setErrors(prev => ({
                ...prev,
                latitude: undefined,
                longitude: undefined
            }));
        }
    };


    const validateForm = () => {
        const newErrors: ErrorState = {}

        if (!hubData.email.trim()) newErrors.email = 'Username is required';
        if (!hubData.password.trim()) newErrors.password = 'Password is required';
        if (!hubData.district.trim()) newErrors.district = 'District is required';
        if (!hubData.state.trim()) newErrors.state = 'State is required';
        if (!hubData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        if (hubData.pincode.length !== 6) newErrors.pincode = 'Pincode must be 6 digits';
        if (!hubData.latitude) newErrors.latitude = 'Latitude is required';
        if (!hubData.longitude) newErrors.longitude = 'Longitude is required';
        if (!hubData.hub_type) newErrors.hub_type = 'Hub type is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit();
        }
    };




    return (
        <Container maxWidth={"xl"} disableGutters sx={{
            backgroundColor: "#F6F4F0", // Light background
            height: "100%",
        }}>
            <Paper elevation={3} sx={{ p: 3, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Building size={24} />
                            Add New Shipping Hub
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>

                        <Link
                            to="/admin/hub/manage/"
                        >
                            <Button

                                variant="outlined"
                                color="secondary"
                            >
                                Cancel
                            </Button>
                        </Link>

                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            startIcon={<Building size={20} />}
                        >
                            Add Shipping Hub
                        </Button>
                    </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Grid2 container spacing={3}>
                                <Grid2 size={6}>
                                    <TextField
                                        name="email"
                                        label="Hub User Email"
                                        value={hubData.email}
                                        type='email'
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.email}
                                        helperText={errors.email}
                                    />
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        name="password"
                                        label="Hub User Password"
                                        value={hubData.password}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.password}
                                        helperText={errors.password}
                                    />
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        name="district"
                                        label="District"
                                        value={hubData.district}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.district}
                                        helperText={errors.district}
                                    />
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        name="state"
                                        label="State"
                                        value={hubData.state}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        error={!!errors.state}
                                        helperText={errors.state}
                                    />
                                </Grid2>
                                <Grid2 size={12}>
                                    <TextField
                                        name="pincode"
                                        label="Pincode"
                                        value={hubData.pincode}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        type="text"
                                        error={!!errors.pincode}
                                        helperText={errors.pincode}

                                    /></Grid2>
                                <Grid2 size={12}>
                                    <FormControl fullWidth required error={!!errors.hub_type}>
                                        <InputLabel>Hub Type</InputLabel>
                                        <Select
                                            name="hub_type"
                                            value={hubData.hub_type}
                                            onChange={handleSelectChange}
                                            label="Hub Type"
                                        >
                                            <MenuItem value="Primary">Primary</MenuItem>
                                            <MenuItem value="Secondary">Secondary</MenuItem>
                                            <MenuItem value="Tertiary">Tertiary</MenuItem>
                                        </Select>
                                        {errors.hub_type && <FormHelperText>{errors.hub_type}</FormHelperText>}
                                    </FormControl>
                                </Grid2>
                            </Grid2>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    name="latitude"
                                    label="Latitude"
                                    value={hubData.latitude}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    error={!!errors.latitude}
                                    helperText={errors.latitude}
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    name="longitude"
                                    label="Longitude"
                                    value={hubData.longitude}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    error={!!errors.longitude}
                                    helperText={errors.longitude}
                                    InputProps={{ readOnly: true }}
                                />
                            </Box>

                            <Typography variant="body2" color="text.secondary">
                                Select a location on the map to set coordinates, or search by address.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box
                                sx={{
                                    height: 400,
                                    border: `1px solid ${theme.palette.divider}`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    bgcolor: '#f5f5f5'
                                }}
                            >
                                <Suspense fallback={
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%'
                                    }}>
                                        <CircularProgress />
                                    </Box>
                                }>
                                    <LocationPicker onLocationSelect={handleLocationSelect} />
                                </Suspense>

                            </Box>

                            <Box sx={{
                                bgcolor: theme.palette.accent?.light || '#f0f7ff',
                                p: 2,
                                borderRadius: theme.shape.borderRadius,
                                border: `1px solid ${theme.palette.accent?.main || '#c2e0ff'}`
                            }}>
                                <Typography variant="body2" color={theme.palette.accent?.dark || '#0a4b8c'}>
                                    <strong>Tip:</strong> Primary hubs should be placed in major cities, Secondary hubs in regional centers, and Tertiary hubs in local areas.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>



            </Paper>
        </Container>
    );
};

export default ShippingHubForm;