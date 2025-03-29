import React, { useState, useEffect, lazy, Suspense } from 'react';
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
    Autocomplete,
    CircularProgress,
    FormHelperText,
    useTheme,
    Divider,
    Paper,
    SelectChangeEvent
} from '@mui/material';
import {
    Search,
    Building,
    User
} from 'lucide-react';

// Import the LocationPicker component
import LocationPicker from './LocationPicker';

interface HubManager {
    id: number;
    name: string;
    email: string;
}

interface Coordinates {
    lat: number;
    lng: number;
}

interface HubData {
    manager: HubManager | null;
    name: string;
    latitude: string;
    longitude: string;
    hub_type: string;
    address: string;
}

interface ErrorState {
    manager?: string;
    name?: string;
    latitude?: string;
    longitude?: string;
    hub_type?: string;
    address?: string;
}

interface ShippingHubFormProps {
    onSubmit: (data: HubData) => void;
    onCancel?: () => void;
}

const fetchHubManagers = (): Promise<HubManager[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'John Doe', email: 'john.doe@swapchain.com' },
                { id: 2, name: 'Jane Smith', email: 'jane.smith@swapchain.com' },
                { id: 3, name: 'Robert Johnson', email: 'robert.johnson@swapchain.com' },
                { id: 4, name: 'Maria Garcia', email: 'maria.garcia@swapchain.com' },
            ]);
        }, 500);
    });
};

const geocodeAddress = (address: string): Promise<Coordinates> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const lat = (Math.random() * 60) - 30;
            const lng = (Math.random() * 360) - 180;
            resolve({ lat, lng });
        }, 800);
    });
};

const ShippingHubForm: React.FC<ShippingHubFormProps> = ({ onSubmit, onCancel }) => {
    const theme = useTheme();
    const [hubData, setHubData] = useState<HubData>({
        manager: null,
        name: '',
        latitude: '',
        longitude: '',
        hub_type: '',
        address: ''
    });
    const [hubManagers, setHubManagers] = useState<HubManager[]>([]);
    const [errors, setErrors] = useState<ErrorState>({});
    const [loading, setLoading] = useState(true);
    const [mapLoading, setMapLoading] = useState(true);
    const [searchingLocation, setSearchingLocation] = useState(false);

    useEffect(() => {
        setMapLoading(true);
        const timer = setTimeout(() => setMapLoading(false), 1500);

        const loadManagers = async () => {
            setLoading(true);
            try {
                const managers = await fetchHubManagers();
                setHubManagers(managers);
            } catch (error) {
                console.error("Error loading hub managers:", error);
            } finally {
                setLoading(false);
            }
        };

        loadManagers();
        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHubData(prev => ({ ...prev, [name]: value }));
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

    const handleManagerChange = (_: React.SyntheticEvent, newValue: HubManager | null) => {
        setHubData(prev => ({ ...prev, manager: newValue }));
        if (errors.manager) {
            setErrors(prev => ({ ...prev, manager: undefined }));
        }
    };

    // Handle location selection from the map
    const handleLocationSelect = (lat: number, lng: number) => {
        setHubData(prev => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
        }));

        if (errors.latitude || errors.longitude) {
            setErrors(prev => ({
                ...prev,
                latitude: undefined,
                longitude: undefined
            }));
        }
    };

    const handleSearchLocation = async () => {
        if (!hubData.address) {
            setErrors(prev => ({ ...prev, address: 'Please enter an address to search' }));
            return;
        }

        setSearchingLocation(true);
        try {
            const coords = await geocodeAddress(hubData.address);
            setHubData(prev => ({
                ...prev,
                latitude: coords.lat.toFixed(6),
                longitude: coords.lng.toFixed(6)
            }));

            if (errors.latitude || errors.longitude) {
                setErrors(prev => ({
                    ...prev,
                    latitude: undefined,
                    longitude: undefined
                }));
            }
        } catch (error) {
            setErrors(prev => ({ ...prev, address: 'Failed to find location. Please try again.' }));
        } finally {
            setSearchingLocation(false);
        }
    };

    const validateForm = () => {
        const newErrors: ErrorState = {};
        if (!hubData.manager) newErrors.manager = 'Hub manager is required';
        if (!hubData.name.trim()) newErrors.name = 'Hub name is required';
        if (!hubData.latitude) newErrors.latitude = 'Latitude is required';
        if (!hubData.longitude) newErrors.longitude = 'Longitude is required';
        if (!hubData.hub_type) newErrors.hub_type = 'Hub type is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(hubData);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, overflow: 'hidden' }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Building size={24} />
                    Add New Shipping Hub
                </Typography>
                <Divider sx={{ my: 2 }} />
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Autocomplete
                            options={hubManagers}
                            loading={loading}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={handleManagerChange}
                            value={hubData.manager}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Hub Manager"
                                    error={!!errors.manager}
                                    helperText={errors.manager}
                                    required
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <Box sx={{ mr: 1, color: theme.palette.secondary.main }}>
                                                    <User size={20} />
                                                </Box>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                        endAdornment: (
                                            <>
                                                {loading && <CircularProgress color="primary" size={20} />}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="body1">{option.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {option.email}
                                        </Typography>
                                    </Box>
                                </li>
                            )}
                        />

                        <TextField
                            name="name"
                            label="Hub Name"
                            value={hubData.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, color: theme.palette.secondary.main }}>
                                        <Building size={20} />
                                    </Box>
                                ),
                            }}
                        />

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

                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                name="address"
                                label="Search Address"
                                placeholder="Enter address to search"
                                value={hubData.address}
                                onChange={handleInputChange}
                                fullWidth
                                error={!!errors.address}
                                helperText={errors.address}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSearchLocation}
                                disabled={searchingLocation}
                                sx={{ minWidth: 'auto', px: 2 }}
                            >
                                {searchingLocation ? <CircularProgress size={24} /> : <Search size={24} />}
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                height: 280,
                                border: `1px solid ${theme.palette.divider}`,
                                position: 'relative',
                                overflow: 'hidden',
                                bgcolor: '#f5f5f5'
                            }}
                        >
                            {mapLoading ? (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    flexDirection: 'column'
                                }}>
                                    <CircularProgress color="primary" size={40} />
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                        Loading map...
                                    </Typography>
                                </Box>
                            ) : (
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
                            )}
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

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {onCancel && (
                    <Button
                        onClick={onCancel}
                        variant="outlined"
                        color="secondary"
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    startIcon={<Building size={20} />}
                >
                    Add Shipping Hub
                </Button>
            </Box>
        </Paper>
    );
};

export default ShippingHubForm;