import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel,
    Box,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Paper,
    Grid
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import ShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { API } from '../API/api';
import { Hub } from '../Hub/Hub';
import { PublicAPI } from '../API/api';
import { useDispatch } from 'react-redux';
import { activateUser, clearUser } from '../../Redux/userSlice';
import { useNavigate } from 'react-router';

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
    latitude: number;
    longitude: number;
}

// Define TypeScript interfaces
interface Order {
    id: string;
    buyerName: string;
    sellerName: string;
    productName: string;
    orderDate: string;
    shippingMethod: string;
    verificationStatus: string;
    price: number;
    address: Address;
}

const SwapShippingVerification: React.FC = () => {
    // State for orders management
    const [orders, setOrders] = useState<Order[]>([]);
    const [hub, setHub] = useState<Hub | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        show: false,
        message: '',
        type: 'success',
    });

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Mock function to fetch orders (in a real app, this would be an API call)
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/hub/order/list/');
                setOrders(data.orders);
                setHub(data.hub);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Handle order selection
    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
        setIsChecked(false);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setIsChecked(false);
    };

    // Handle verification
    const handleVerification = async (isValid: boolean, orderId: string) => {
        if (!isChecked || !selectedOrder) return;

        setLoading(true);

        try {
            await API.post('hub/product/verify/', {
                orderId: orderId,
                verificationStatus: isValid ? "approved" : "rejected",
            });

            // Update the order list by removing the verified one
            const updatedOrders = orders.map((order) => {
                if (order.id === selectedOrder.id) {
                    return {
                        ...order,
                        verificationStatus: isValid ? "approved" : "rejected"
                    };
                }
                return order;
            });
            setOrders(updatedOrders);


            // Show success or error notification
            setNotification({
                show: true,
                message: isValid
                    ? `Order ${selectedOrder.id} has been verified as valid.`
                    : `Order ${selectedOrder.id} has been marked as invalid.`,
                type: isValid ? 'success' : 'error',
            });
        } catch (error) {
            console.error('Error verifying order:', error);

            // Show error notification
            setNotification({
                show: true,
                message: `Failed to verify order ${selectedOrder.id}. Please try again.`,
                type: 'error',
            });
        } finally {
            setLoading(false);
            handleCloseModal();

            // Auto-hide notification after 3 seconds
            setTimeout(() => {
                setNotification({
                    show: false,
                    message: '',
                    type: 'success',
                });
            }, 3000);
        }
    };

    // Handle logout
  const handleLogout = async () => {
    console.log("got in")
    try {
      await PublicAPI.post('auth/logout/', {})
      localStorage.clear()
      dispatch(activateUser(false))
      dispatch(clearUser())
      navigate("/")
    } catch (error) {
      console.log(error)
    }

  }
    // Hub details component
    const HubDetailsCard = () => {
        if (!hub) return null;

        return (
            <Paper elevation={3} sx={{ p: 2}}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                        Current Hub
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                    <ListItem>
                        <ListItemText
                            primary="Hub ID"
                            secondary={hub.id.toString()}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="District"
                            secondary={hub.district}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="State"
                            secondary={hub.state}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Pincode"
                            secondary={hub.pincode}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Hub Type"
                            secondary={hub.hubType}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Coordinates"
                            secondary={`${hub.latitude.toFixed(4)}, ${hub.longitude.toFixed(4)}`}
                        />
                    </ListItem>
                </List>
            </Paper>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* AppBar */}
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'text.primary' }}>
                        SWAPCHAIN SHIPPING
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main Content with Grid Layout */}
            <Container maxWidth="lg" sx={{ mt: 9, mb: 4, flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ShippingIcon fontSize="large" color="primary" />
                    <Typography variant="h4" component="h1" color="text.primary">
                        Swap Shipping Verification
                    </Typography>
                </Box>

                {/* Notification */}
                {notification.show && (
                    <Alert
                        severity={notification.type}
                        sx={{ mb: 2 }}
                        onClose={() => setNotification({ ...notification, show: false })}
                    >
                        {notification.message}
                    </Alert>
                )}

                {/* Grid Layout for Main Content and Hub Details */}
                <Grid container spacing={3}>
                    {/* Orders List - 80% width */}
                    <Grid item xs={12} md={9}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress color="primary" />
                            </Box>
                        ) : orders.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,}}>
                                {orders.map((order) => (
                                    <Card
                                        key={order.id}
                                        sx={{
                                            cursor: 'pointer',
                                            borderLeft: '4px solid',
                                            borderColor: 'primary.main'
                                        }}
                                        onClick={() => {
                                            if (order.verificationStatus === "pending") {
                                                handleOrderClick(order)
                                            } else {
                                                alert("This order has already been verified")
                                               
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ height: "100%", overflow: 'scroll',display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="h6" component="div">
                                                    {order.id}
                                                </Typography>
                                                <Chip label={order.verificationStatus} color={order.verificationStatus === "pending" ? "info" : order.verificationStatus === "approved" ? "success" : "error"} size="small" />
                                            </Box>
                                            <Divider sx={{ mb: 2 }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Box>
                                                    <Typography variant="body1">
                                                        <strong>Buyer:</strong> {order.buyerName}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        <strong>Seller:</strong> {order.sellerName}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Product:</strong> {order.productName}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2">
                                                        <strong>Order Date:</strong> {order.orderDate}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Total:</strong> ${Number(order.price).toFixed(2)} 
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '300px',
                                bgcolor: 'surface.main',
                                borderRadius: 3,
                                p: 4
                            }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No orders requiring verification
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    All swap shipments have been verified.
                                </Typography>
                            </Box>
                        )}
                    </Grid>

                    {/* Hub Details - 20% width */}
                    <Grid item xs={12} md={3}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <CircularProgress color="primary" size={30} />
                            </Box>
                        ) : (
                            <HubDetailsCard />
                        )}
                    </Grid>
                </Grid>
            </Container>

            {/* Verification Modal */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                {selectedOrder && (
                    <>
                        <DialogTitle sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                            Verify Swap Order: {selectedOrder.id}
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box sx={{ p: 1 }}>
                                <Typography variant="h6" component="div" gutterBottom>
                                    Order Details
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText
                                            primary="Seller Name"
                                            secondary={selectedOrder.sellerName}
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemText
                                            primary="Buyer Name"
                                            secondary={selectedOrder.buyerName}
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemText
                                            primary="Product"
                                            secondary={selectedOrder.productName}
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemText
                                            primary="Order Date"
                                            secondary={selectedOrder.orderDate}
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemText
                                            primary="Shipping Address"
                                            secondary={selectedOrder.address.city}
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemText
                                            primary="Order Total"
                                            secondary={`$${Number(selectedOrder.price).toFixed(2)}`}
                                        />
                                    </ListItem>
                                </List>

                                <Box sx={{ mt: 3, mb: 2, bgcolor: 'accent.light', p: 2, borderRadius: 2 }}>
                                    <Typography variant="subtitle1" color="secondary.dark" gutterBottom>
                                        Verification Instructions:
                                    </Typography>
                                    <Typography variant="body2">
                                        Please check that the product has been thoroughly inspected, is in working condition,
                                        and matches the order description before approving the shipment.
                                    </Typography>
                                </Box>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={(e) => setIsChecked(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="The product has been checked thoroughly"
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                            <Button
                                onClick={handleCloseModal}
                                color="inherit"
                            >
                                Cancel
                            </Button>
                            <Box>
                                <Button
                                    onClick={() => handleVerification(false, selectedOrder.id)}
                                    variant="contained"
                                    color="secondary"
                                    disabled={!isChecked}
                                    startIcon={<CancelIcon />}
                                    sx={{ mr: 1 }}
                                >
                                    Invalid
                                </Button>
                                <Button
                                    onClick={() => handleVerification(true, selectedOrder.id)}
                                    variant="gradient"
                                    disabled={!isChecked}
                                    startIcon={<VerifiedIcon />}
                                >
                                    Valid
                                </Button>
                            </Box>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default SwapShippingVerification;