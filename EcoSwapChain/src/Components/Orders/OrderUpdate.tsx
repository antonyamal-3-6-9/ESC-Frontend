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
    CardContent
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
    const [priceUpdateSuccess, setPriceUpdateSuccess] = useState(false);

    const dispatch = useDispatch();

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

    const handleSnackbarClose = () => setPriceUpdateSuccess(false);

    return (
        <Box sx={{ p: 4, bgcolor: 'background.default' }}>
            <CardContent>
                <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                    Current Price: ${price}
                </Typography>
                {(isSeller && !buyerConfirmed) ? (
                    <>
                        <Typography>
                            You can update the price after discussing with the buyer.
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePriceModalOpen}
                            >
                                Update Price
                            </Button>
                        </Stack>
                    </>
                ) : (isSeller && buyerConfirmed) ? (
                    <>
                        <Typography>
                            The buyer has been confirmed the order, now its your turn.
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                    color="primary"
                                    onClick={onConfirm}
                            >
                                Confirm
                            </Button>
                        </Stack>
                    </>
                ) : (!isSeller && !buyerConfirmed) ? (
                        <>
                            <Typography>
                                You can confirm the order after finalizing the price with seller.
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                                <Button
                                    variant="contained"
                                        color="primary"
                                        onClick={onConfirm}
                                >
                                    Confirm Order
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        <>
                            <Typography>
                                Wait for the order to be confirmed by the seller.
                            </Typography>
                        </>
                    )}
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
