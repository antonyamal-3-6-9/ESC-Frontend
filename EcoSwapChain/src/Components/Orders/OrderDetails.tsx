import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Chip,
  TextField,
  Paper
} from '@mui/material';
import { Truck, MessageCircle, Package, ExternalLink } from 'lucide-react';

const OrderDetails: React.FC = () => {
  const [shippingType, setShippingType] = useState('');
  const [message, setMessage] = useState('');
  const [chatExpanded, setChatExpanded] = useState(false);

  // Mock order data
  const order = {
    orderId: "ORD-123456789",
    time: "2025-02-19 14:30 UTC",
    fromWallet: "0x1234...5678",
    toWallet: "0x8765...4321",
    status: "Pending",
    trackingId: "TRACK-987654321",
    nftImage: "/api/placeholder/300/300",
    nftName: "Cosmic Dreams #123",
    price: "2.5 ETH"
  };

  const handleAccept = () => {
    console.log('Order accepted');
  };

  const handleReject = () => {
    console.log('Order rejected');
  };

  return (
    <Card sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* NFT Card */}
        <Card sx={{ 
          width: { xs: '100%', md: '33%' },
          height: 'fit-content'
        }}>
          <Box sx={{ p: 2 }}>
            <Box sx={{ 
              position: 'relative',
              '& img': {
                width: '100%',
                borderRadius: 2,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }
            }}>
              <img 
                src={order.nftImage} 
                alt={order.nftName}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {order.nftName}
              </Typography>
              <Typography variant="h6" color="primary">
                {order.price}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Order Details Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Chat Section */}
          <Card sx={{ p: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 2 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MessageCircle size={24} />
                <Typography variant="h6">Chat with Seller</Typography>
              </Box>
              <Button 
                variant="outlined"
                onClick={() => setChatExpanded(!chatExpanded)}
              >
                {chatExpanded ? 'Minimize' : 'Expand'}
              </Button>
            </Box>
            {chatExpanded && (
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'all 0.3s'
              }}>
                <TextField
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  fullWidth
                />
                <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>
                  Send Message
                </Button>
              </Box>
            )}
          </Card>

          {/* Order Information */}
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Information
            </Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2
              }}>
                <Box>
                  <Typography color="text.secondary" variant="subtitle2">
                    Order ID
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {order.orderId}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="subtitle2">
                    Time
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {order.time}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="subtitle2">
                    From Wallet
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {order.fromWallet}
                    </Typography>
                    <ExternalLink size={16} style={{ cursor: 'pointer' }} />
                  </Box>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="subtitle2">
                    To Wallet
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {order.toWallet}
                    </Typography>
                    <ExternalLink size={16} style={{ cursor: 'pointer' }} />
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography color="text.secondary" variant="subtitle2">
                    Status
                  </Typography>
                  <Chip 
                    label={order.status}
                    color="primary"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </Paper>

            {/* Shipping Section */}
            <Typography variant="h6" gutterBottom>
              Shipping Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={shippingType}
                onChange={(e) => setShippingType(e.target.value)}
              >
                <FormControlLabel
                  value="self"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Package size={20} />
                      <Typography>Self Pickup</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="swapchain"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Truck size={20} />
                      <Typography>Swapchain Shipping Service</Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {shippingType === 'swapchain' && (
              <Paper sx={{ 
                mt: 2,
                p: 2,
                bgcolor: 'background.default'
              }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Tracking Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tracking ID: {order.trackingId}
                </Typography>
              </Paper>
            )}

            {/* Action Buttons */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReject}
                disabled={!shippingType}
              >
                Reject Order
              </Button>
              <Button
                variant="gradient"
                onClick={handleAccept}
                disabled={!shippingType}
                sx={{ minWidth: 120 }}
              >
                Accept Order
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </Card>
  );
};

export default OrderDetails;