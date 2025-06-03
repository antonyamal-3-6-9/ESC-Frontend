import React, { useState } from 'react';
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
    useTheme,
    useMediaQuery
} from '@mui/material';
import { setAlertMessage, setAlertOn, setAlertSeverity } from '../../Redux/alertBackdropSlice';
import { useDispatch } from 'react-redux';

interface OrderManagementProps {
    orderId: string;
    price: string;
    isSeller: boolean;
    buyerConfirmed: boolean;
    updatePrice: (newPrice: number) => void;
    onConfirm: () => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({
    orderId,
    price,
    isSeller,
    buyerConfirmed,
    updatePrice,
    onConfirm
}) => {
    const [newPrice, setNewPrice] = useState("");
    const [priceModalOpen, setPriceModalOpen] = useState(false);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [priceUpdateSuccess, setPriceUpdateSuccess] = useState(false);

    const dispatch = useDispatch();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handlePriceModalOpen = () => {
        setNewPrice(price);
        setPriceModalOpen(true);
    };

    const handlePriceModalClose = () => setPriceModalOpen(false);

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPrice(event.target.value);
    };

    const handlePriceSubmit = () => {
        if (Number(newPrice) > Number(price)) {
            dispatch(setAlertOn(true));
            dispatch(setAlertMessage("New price cannot be greater than the current price"));
            dispatch(setAlertSeverity("warning"));
            return;
        }

        updatePrice(Number(newPrice));
        handlePriceModalClose();
        setPriceUpdateSuccess(true);
    };

    const handleConfirmClick = () => {
        setConfirmationModalOpen(true);
    };

    const handleConfirmationClose = () => {
        setConfirmationModalOpen(false);
    };

    const handleConfirmationYes = () => {
        onConfirm();
        setConfirmationModalOpen(false);
    };

    const handleSnackbarClose = () => setPriceUpdateSuccess(false);

    const getConfirmationMessage = () => {
        if (isSeller && buyerConfirmed) {
            return "Are you sure you want to confirm this order? This action will proceed with the order processing.";
        } else if (!isSeller && !buyerConfirmed) {
            return "Are you sure you want to confirm this order? Once confirmed, you won't be able to modify the order details.";
        }
        return "";
    };

    const getConfirmationTitle = () => {
        if (isSeller && buyerConfirmed) {
            return "Confirm Order as Seller";
        } else if (!isSeller && !buyerConfirmed) {
            return "Confirm Order as Buyer";
        }
        return "Confirm Order";
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'background.default' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" color="primary" sx={{ mb: 3, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    Current Price: ${Number(price).toFixed(2)}
                </Typography>
                {(isSeller && !buyerConfirmed) ? (
                    <>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            You can update the price after discussing with the buyer.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePriceModalOpen}
                                fullWidth={isSmallScreen}
                            >
                                Update Price
                            </Button>
                        </Stack>
                    </>
                ) : (isSeller && buyerConfirmed) ? (
                    <>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            The buyer has confirmed the order, now it's your turn.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleConfirmClick}
                                fullWidth={isSmallScreen}
                            >
                                Confirm
                            </Button>
                        </Stack>
                    </>
                ) : (!isSeller && !buyerConfirmed) ? (
                    <>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            You can confirm the order after finalizing the price with seller.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleConfirmClick}
                                fullWidth={isSmallScreen}
                            >
                                Confirm Order
                            </Button>
                        </Stack>
                    </>
                ) : (
                    <>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Wait for the order to be confirmed by the seller.
                        </Typography>
                    </>
                )}
            </CardContent>

            {/* Price Update Modal */}
            <Dialog
                open={priceModalOpen}
                onClose={handlePriceModalClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { mx: { xs: 2, sm: 0 } }
                }}
            >
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
                <DialogActions sx={{ p: { xs: 2, sm: 3 }, gap: { xs: 1, sm: 0 } }}>
                    <Button
                        onClick={handlePriceModalClose}
                        color="secondary"
                        fullWidth={isSmallScreen}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePriceSubmit}
                        color="primary"
                        variant="contained"
                        fullWidth={isSmallScreen}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Modal */}
            <Dialog
                open={confirmationModalOpen}
                onClose={handleConfirmationClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { mx: { xs: 2, sm: 0 } }
                }}
            >
                <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    {getConfirmationTitle()}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        {getConfirmationMessage()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: { xs: 2, sm: 3 }, gap: { xs: 1, sm: 0 } }}>
                    <Button
                        onClick={handleConfirmationClose}
                        color="secondary"
                        variant="outlined"
                        fullWidth={isSmallScreen}
                    >
                        No, Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmationYes}
                        color="primary"
                        variant="contained"
                        fullWidth={isSmallScreen}
                    >
                        Yes, Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={priceUpdateSuccess}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    Price for Order #{orderId} has been successfully updated!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OrderManagement;