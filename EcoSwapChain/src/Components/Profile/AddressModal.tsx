import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    IconButton,
    TextField,
    Grid,
    Chip,
    Box,
    FormControlLabel,
    Switch,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    Close as CloseIcon,
    Edit as EditIcon,
    LocationOn as LocationIcon,
    Star as StarIcon,
} from '@mui/icons-material';


// Interface for the Address type based on the Django model
interface Address {
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

// Props for the AddressModal component
interface AddressModalProps {
    open: boolean;
    onClose: () => void;
    address?: Address; // Optional address for editing mode
    onSave: (address: Address) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

// Empty address template
const emptyAddress: Omit<Address, 'id' | 'trader'> = {
    house_no_or_name: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    landmark: '',
    district_number: null,
    district: null,
    default: false
};

export const AddressModal: React.FC<AddressModalProps> = ({
    open,
    onClose,
    address,
    onSave,
    onDelete
}) => {
    // Initialize form values with provided address or empty template
    const [formValues, setFormValues] = useState<Address>(
        address || { ...emptyAddress }
    );
    const [isEditing, setIsEditing] = useState<boolean>(!address);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens or address changes
    useEffect(() => {
        if (address) {
            setFormValues(address);
            setIsEditing(true);
        } else {
            setFormValues({ ...emptyAddress });
            setIsEditing(true);
        }
        setErrors({});
    }, [address, open]);

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        // Handle different input types
        if (type === 'checkbox') {
            setFormValues(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'district_number' || name === 'latitude' || name === 'longitude') {
            // Convert to number or null for number fields
            const numValue = value === '' ? null : Number(value);
            setFormValues(prev => ({ ...prev, [name]: numValue }));
        } else {
            setFormValues(prev => ({ ...prev, [name]: value }));
        }

        // Clear error for this field if exists
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Validate form before submission
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        const requiredFields = ['house_no_or_name', 'street', 'city', 'state', 'postal_code', 'country'];

        requiredFields.forEach(field => {
            if (!formValues[field as keyof Address]) {
                newErrors[field] = 'This field is required';
            }
        });

        // Validate postal code format (optional)
        if (formValues.postal_code && !/^\d{5,}$/.test(formValues.postal_code)) {
            newErrors.postal_code = 'Invalid postal code format';
        }

        // Validate latitude and longitude (if provided)

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Add trader ID to new addresses
            await onSave(formValues);
            onClose();
        } catch (error) {
            console.error('Error saving address:', error);
            // Handle API errors here
        } finally {
            setLoading(false);
        }
    };

    // Handle address deletion
    const handleDelete = async () => {
        if (!address?.id || !onDelete) return;

        setLoading(true);
        try {
            await onDelete(address.id);
            onClose();
        } catch (error) {
            console.error('Error deleting address:', error);
        } finally {
            setLoading(false);
        }
    };

    const isNewAddress = !address?.id;
    const modalTitle = isNewAddress ? 'Add New Address' : (isEditing ? 'Edit Address' : 'Address Details');

    return (
    
            <Dialog
                open={open}
                onClose={loading ? undefined : onClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: 3
                    }
                }}
            >
                {/* Header */}
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pb: 1
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <LocationIcon color="primary" />
                        <Typography variant="h6" component="span">
                            {modalTitle}
                        </Typography>
                        {address?.default && (
                            <Chip
                                icon={<StarIcon fontSize="small" />}
                                label="Default"
                                size="small"
                                color="primary"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Box>
                    <IconButton onClick={onClose} disabled={loading}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt: 2 }}>
                    <Grid container spacing={2}>
                        {/* House Name/Number */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="House Number/Name"
                                name="house_no_or_name"
                                value={formValues.house_no_or_name}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={!!errors.house_no_or_name}
                                helperText={errors.house_no_or_name}
                                required
                            />
                        </Grid>

                        {/* Street */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Street"
                                name="street"
                                value={formValues.street}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={!!errors.street}
                                helperText={errors.street}
                                required
                            />
                        </Grid>

                        {/* City */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formValues.city}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={!!errors.city}
                                helperText={errors.city}
                                required
                            />
                        </Grid>

                        {/* State */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="State/Province"
                                name="state"
                                value={formValues.state}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={!!errors.state}
                                helperText={errors.state}
                                required
                            />
                        </Grid>

                        {/* Postal Code */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Postal Code"
                                name="postal_code"
                                value={formValues.postal_code}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={!!errors.postal_code}
                                helperText={errors.postal_code}
                                required
                            />
                        </Grid>

                        {/* Country */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Country"
                                name="country"
                                value={formValues.country}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={!!errors.country}
                                helperText={errors.country}
                                required
                            />
                        </Grid>

                        {/* Landmark */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Landmark"
                                name="landmark"
                                value={formValues.landmark}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={!!errors.landmark}
                                helperText={errors.landmark}
                            />
                        </Grid>

                        {/* District */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="District"
                                name="district"
                                value={formValues.district || ''}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                error={!!errors.district}
                                helperText={errors.district}
                            />
                        </Grid>

                        {/* Default Address Switch */}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="default"
                                        checked={formValues.default}
                                        onChange={handleChange}
                                        disabled={!isEditing || loading}
                                        color="primary"
                                    />
                                }
                                label="Set as default address"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    {!isNewAddress && !isEditing && (
                        <Button
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditing(true)}
                            disabled={loading}
                        >
                            Edit
                        </Button>
                    )}

                    {!isNewAddress && onDelete && (isEditing || !isEditing) && (
                        <Button
                            startIcon={<CloseIcon />}
                            color="error"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Delete
                        </Button>
                    )}

                    {isEditing && (
                        <>
                            <Button
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={16} color="inherit" />}
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </>
                    )}

                    {!isEditing && (
                        <Button
                            variant="contained"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Close
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
    );
};

export default AddressModal;