import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Snackbar,
    Alert,
    Box,
    Typography,
    Stack,
    CardContent,
    Grid
} from '@mui/material';
import { setAlertMessage, setAlertOn, setAlertSeverity } from '../../Redux/alertBackdropSlice';
import { useDispatch } from 'react-redux';


// Define the address interface to match your model
interface Address {
    house_no_or_name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    landmark: string;
}

// Define the initial empty address
const emptyAddress: Address = {
    house_no_or_name: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    landmark: ''
};

// Define the props interface - only orderId and price
interface OrderManagementProps {
    orderId: string;
    price: string;
    isSeller: boolean;
    updatePrice: (newPrice: number) => void;
    updateAddress: (address: Address) => void;
    buyerConfirmed: boolean;
}

const OrderManagement: React.FC<OrderManagementProps> = ({
    orderId,
    price,
    isSeller,
    buyerConfirmed,
    updatePrice,
    updateAddress,
}) => {
    // State for price
    const [newPrice, setNewPrice] = useState("");

    const dispatch = useDispatch()

    // State for address
    const [address, setAddress] = useState<Address>(emptyAddress);

    // State for modals
    const [priceModalOpen, setPriceModalOpen] = useState(false);
    const [orderModalOpen, setOrderModalOpen] = useState(false);

    // State for notifications
    const [priceUpdateSuccess, setPriceUpdateSuccess] = useState(false);
    const [orderConfirmSuccess, setOrderConfirmSuccess] = useState(false);

    // Form validation state
    const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof Address, string>>>({});

    // Handlers for price update modal
    const handlePriceModalOpen = () => {
        setNewPrice(price);
        setPriceModalOpen(true);
    };

    const handlePriceModalClose = () => setPriceModalOpen(false);

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPrice(event.target.value);
    };

    const handlePriceSubmit = () => {
        console.log("inside")
        if (Number(newPrice) > Number(price)) {
            alert("error")
            dispatch(setAlertOn(true))
            dispatch(setAlertMessage("New price cannot be greater than the current price"))
            dispatch(setAlertSeverity("warning"))
            return
        }
        updatePrice(Number(newPrice));
        console.log(`Order ${orderId}: Price updated to: ${newPrice}`);
        handlePriceModalClose();
        setPriceUpdateSuccess(true);
    };

    // Handlers for order confirmation modal
    const handleOrderModalOpen = () => {
        setOrderModalOpen(true);
        setAddressErrors({});
    };

    const handleOrderModalClose = () => setOrderModalOpen(false);

    const handleAddressChange = (field: keyof Address) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Update the address object with the new field value
        const updatedAddress = { ...address, [field]: value };
        setAddress(updatedAddress);

        // Clear any error for this field
        if (addressErrors[field]) {
            setAddressErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateAddress = (): boolean => {
        const newErrors: Partial<Record<keyof Address, string>> = {};
        const requiredFields: (keyof Address)[] = ['house_no_or_name', 'street', 'city', 'state', 'postal_code', 'country'];

        requiredFields.forEach(field => {
            if (!address[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        setAddressErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOrderSubmit = () => {
        // Validate address first
        if (!validateAddress()) {
            return;
        }

        updateAddress(address);

        console.log(`Order ${orderId} confirmed with delivery address:`, address);
        handleOrderModalClose();
        setOrderConfirmSuccess(true);
        setAddress(emptyAddress);
    };

    // Handlers for snackbar notifications
    const handleSnackbarClose = (type: 'price' | 'order') => {
        if (type === 'price') {
            setPriceUpdateSuccess(false);
        } else {
            setOrderConfirmSuccess(false);
        }
    };

    return (
        <Box sx={{ p: 4, bgcolor: 'background.default' }}>

            <CardContent>
                <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                    Current Price: ${price}
                </Typography>
                <Typography>
                    {(isSeller && !buyerConfirmed) ? "Once the buyer confirms and adds address, You can do the same" :
                        (isSeller && buyerConfirmed) ? "The buyer has been confirmed the order, now its your turn" :
                            (!isSeller && !buyerConfirmed) ? "You can confirm the order after finalizing the price with seller" :
                                (!isSeller && buyerConfirmed) ? "Wait for the order to be confirmed by the seller" : null}
                </Typography>
                <Typography>
                    {(isSeller && !buyerConfirmed) && "You can update the price,  if planning to deduct any after communicating with the buyer"}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                    {
                        (isSeller && !buyerConfirmed) &&

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePriceModalOpen}
                        >
                            Update Price
                        </Button>
                    }
                    {(isSeller && buyerConfirmed || !isSeller && !buyerConfirmed) &&
                        <Button
                            variant="gradient"
                            onClick={handleOrderModalOpen}
                        >
                            Confirm Order
                        </Button>
                    }
                </Stack>
            </CardContent>


            {/* Price Update Modal */}
            <Dialog open={priceModalOpen} onClose={handlePriceModalClose}>
                <DialogTitle>Update Price for Order #{orderId}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Please enter the new price for this order.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="price"
                        label="Price"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newPrice}
                        onChange={handlePriceChange}
                        InputProps={{
                            startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePriceModalClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handlePriceSubmit} color="primary" variant="contained">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Order Confirmation Modal with structured address fields */}
            <Dialog
                open={orderModalOpen}
                onClose={handleOrderModalClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Confirm Order #{orderId}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Please enter your shipping address to confirm this order.
                    </DialogContentText>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoFocus
                                id="house_no_or_name"
                                label="House Number/Name"
                                type="text"
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
                                id="landmark"
                                label="Landmark"
                                type="text"
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
                                id="street"
                                label="Street"
                                type="text"
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
                                id="city"
                                label="City"
                                type="text"
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
                                id="state"
                                label="State/Province"
                                type="text"
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
                                id="postal_code"
                                label="Postal/Zip Code"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={address.postal_code}
                                onChange={handleAddressChange('postal_code')}
                                error={!!addressErrors.postal_code}
                                helperText={addressErrors.postal_code}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="country"
                                label="Country"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={address.country}
                                onChange={handleAddressChange('country')}
                                error={!!addressErrors.country}
                                helperText={addressErrors.country}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOrderModalClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleOrderSubmit} color="primary" variant="contained">
                        Confirm Order
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Notifications */}
            <Snackbar
                open={priceUpdateSuccess}
                autoHideDuration={6000}
                onClose={() => handleSnackbarClose('price')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => handleSnackbarClose('price')} severity="success">
                    Price for Order #{orderId} has been successfully updated!
                </Alert>
            </Snackbar>

            <Snackbar
                open={orderConfirmSuccess}
                autoHideDuration={6000}
                onClose={() => handleSnackbarClose('order')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => handleSnackbarClose('order')} severity="success">
                    Order #{orderId} has been confirmed! Thank you for your purchase.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OrderManagement;