import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Grow,
  Tooltip,
  Zoom,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Send as SendIcon,
  ContentCopy as ContentCopyIcon,
  LocalShipping as LocalShippingIcon,
  Person as PersonIcon,
  AccountBalanceWallet as WalletIcon,
  Schedule as ScheduleIcon,
  Update as UpdateIcon,
  TrackChanges as TrackChangesIcon,
  Check as CheckIcon,
  Payments as PaymentsIcon,
  Assignment as AssignmentIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  ChatBubbleOutline as ChatIcon
} from '@mui/icons-material';

// Types for our component
interface Message {
  id: string;
  text: string;
  sender: 'buyer' | 'seller';
  timestamp: Date;
}

interface NFTOrderDetailsProps {
  orderData: {
    orderId: string;
    nftName: string;
    nftSymbol: string;
    nftAddress: string;
    nftUri: string;
    nftImageUrl: string;
    sellerAddress: string;
    sellerName: string;
    sellerAvatar: string;
    buyerAddress: string;
    buyerName: string;
    buyerAvatar: string;
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'paid' | 'processing' | 'failed';
    createdAt: Date;
    updatedAt: Date;
    trackingNumber?: string;
  };
}

// Function to truncate Ethereum addresses
const truncateAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const NFTOrderDetails: React.FC<NFTOrderDetailsProps> = ({ orderData }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I just purchased your amazing NFT!',
      sender: 'buyer',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: '2',
      text: 'Thanks for your purchase! Let me know if you have any questions about the shipping.',
      sender: 'seller',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23)
    },
    {
      id: '3',
      text: 'When can I expect the physical item to be shipped?',
      sender: 'buyer',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5)
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [shippingMethod, setShippingMethod] = useState('swapship');
  const [copied, setCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'buyer', // Assuming the user is the buyer
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleShippingMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShippingMethod(event.target.value);
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Order status color mapping
  const getStatusColor = () => {
    switch (orderData.orderStatus) {
      case 'pending': return theme.palette.warning.main;
      case 'processing': return theme.palette.info.main;
      case 'shipped': return theme.palette.primary.main;
      case 'delivered': return theme.palette.success.main;
      case 'cancelled': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };

  // Payment status color mapping
  const getPaymentStatusColor = () => {
    switch (orderData.paymentStatus) {
      case 'paid': return theme.palette.success.main;
      case 'processing': return theme.palette.warning.main;
      case 'failed': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        minHeight: '80vh',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[2]
      }}
    >
      {/* Left Side - NFT Details */}
      <Box
        sx={{
          width: '25%',
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          p: 3
        }}
      >
        <Typography
          variant="h5"
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          NFT Details
        </Typography>

        <Box
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          sx={{
            position: 'relative',
            mb: 2,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: theme.shadows[1]
          }}
        >
          <Box
            component="img"
            src={orderData.nftImageUrl}
            alt={orderData.nftName}
            sx={{
              width: '100%',
              height: 220,
              objectFit: 'cover',
              backgroundColor: 'rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            <ImageIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {orderData.nftName}
        </Typography>

        <Chip
          label={orderData.nftSymbol}
          size="small"
          color="primary"
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        />

        <Typography variant="subtitle2" sx={{ mb: 0.5, color: theme.palette.text.secondary, display: 'flex', alignItems: 'center' }}>
          <LinkIcon fontSize="small" sx={{ mr: 0.5 }} /> Contract Address
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ mr: 1, fontFamily: 'monospace' }}>
            {truncateAddress(orderData.nftAddress)}
          </Typography>
          <Tooltip
            title={copied === 'address' ? 'Copied!' : 'Copy Address'}
            TransitionComponent={Zoom}
          >
            <IconButton
              size="small"
              onClick={() => handleCopy(orderData.nftAddress, 'address')}
            >
              {copied === 'address' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 0.5, color: theme.palette.text.secondary, display: 'flex', alignItems: 'center' }}>
          <LinkIcon fontSize="small" sx={{ mr: 0.5 }} /> Metadata URI
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1, fontFamily: 'monospace' }} noWrap>
            {orderData.nftUri.substring(0, 20)}...
          </Typography>
          <Tooltip
            title={copied === 'uri' ? 'Copied!' : 'Copy URI'}
            TransitionComponent={Zoom}
          >
            <IconButton
              size="small"
              onClick={() => handleCopy(orderData.nftUri, 'uri')}
            >
              {copied === 'uri' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Right Side - Communication and Order Details */}
      <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column' }}>
        {/* Chat Section */}
        <Box sx={{ height: '50%', p: 3, pb: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ChatIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Communication
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              height: 'calc(100% - 40px)',
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {/* Messages container */}
            <Box sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: 'rgba(246, 244, 240, 0.5)'
            }}>
              <List>
                {messages.map((message) => (
                  <Grow
                    key={message.id}
                    in={true}
                    style={{ transformOrigin: message.sender === 'buyer' ? 'right' : 'left' }}
                    timeout={500}
                  >
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.sender === 'buyer' ? 'flex-end' : 'flex-start',
                        px: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                        {message.sender === 'seller' && (
                          <ListItemAvatar sx={{ minWidth: 40 }}>
                            <Avatar
                              src={orderData.sellerAvatar}
                              sx={{ width: 32, height: 32 }}
                            />
                          </ListItemAvatar>
                        )}
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: message.sender === 'buyer'
                              ? theme.palette.primary.main
                              : theme.palette.background.paper,
                            color: message.sender === 'buyer'
                              ? theme.palette.primary.contrastText
                              : theme.palette.text.primary,
                            borderRadius: 2,
                            maxWidth: '70%',
                            boxShadow: message.sender === 'buyer'
                              ? 'none'
                              : theme.shadows[1]
                          }}
                        >
                          <Typography variant="body2">
                            {message.text}
                          </Typography>
                        </Box>
                        {message.sender === 'buyer' && (
                          <ListItemAvatar sx={{ minWidth: 40 }}>
                            <Avatar
                              src={orderData.buyerAvatar}
                              sx={{ width: 32, height: 32 }}
                            />
                          </ListItemAvatar>
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 2,
                          color: theme.palette.text.secondary
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </ListItem>
                  </Grow>
                ))}
                <div ref={messagesEndRef} />
              </List>
            </Box>

            {/* Input field */}
            <Box sx={{
              display: 'flex',
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper
            }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                sx={{
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  minWidth: 'auto',
                  borderRadius: 2,
                  px: 2
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Order Details Section */}
        <Box sx={{ height: '50%', p: 3, pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssignmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Order Details
            </Typography>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 3
            }}
          >
            {/* Left column */}
            <Box>
              <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssignmentIcon fontSize="small" sx={{ mr: 0.5 }} /> Order ID
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontFamily="monospace" sx={{ mr: 1 }}>
                    {orderData.orderId}
                  </Typography>
                  <Tooltip
                    title={copied === 'orderId' ? 'Copied!' : 'Copy Order ID'}
                    TransitionComponent={Zoom}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(orderData.orderId, 'orderId')}
                    >
                      {copied === 'orderId' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <WalletIcon fontSize="small" sx={{ mr: 0.5 }} /> Seller
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar src={orderData.sellerAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                  <Typography variant="body2">{orderData.sellerName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontFamily="monospace" sx={{ mr: 1 }}>
                    {truncateAddress(orderData.sellerAddress)}
                  </Typography>
                  <Tooltip
                    title={copied === 'sellerAddress' ? 'Copied!' : 'Copy Address'}
                    TransitionComponent={Zoom}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(orderData.sellerAddress, 'sellerAddress')}
                    >
                      {copied === 'sellerAddress' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <WalletIcon fontSize="small" sx={{ mr: 0.5 }} /> Buyer
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar src={orderData.buyerAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                  <Typography variant="body2">{orderData.buyerName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontFamily="monospace" sx={{ mr: 1 }}>
                    {truncateAddress(orderData.buyerAddress)}
                  </Typography>
                  <Tooltip
                    title={copied === 'buyerAddress' ? 'Copied!' : 'Copy Address'}
                    TransitionComponent={Zoom}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(orderData.buyerAddress, 'buyerAddress')}
                    >
                      {copied === 'buyerAddress' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>

            {/* Right column */}
            <Box>
              <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrackChangesIcon fontSize="small" sx={{ mr: 0.5 }} /> Order Status
                    </Typography>
                    <Chip
                      label={orderData.orderStatus.toUpperCase()}
                      sx={{
                        bgcolor: getStatusColor(),
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <PaymentsIcon fontSize="small" sx={{ mr: 0.5 }} /> Payment
                    </Typography>
                    <Chip
                      label={orderData.paymentStatus.toUpperCase()}
                      sx={{
                        bgcolor: getPaymentStatusColor(),
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon fontSize="small" sx={{ mr: 0.5 }} /> Created
                  </Typography>
                  <Typography variant="body2">
                    {orderData.createdAt.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <UpdateIcon fontSize="small" sx={{ mr: 0.5 }} /> Updated
                  </Typography>
                  <Typography variant="body2">
                    {orderData.updatedAt.toLocaleString()}
                  </Typography>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShippingIcon fontSize="small" sx={{ mr: 0.5 }} /> Shipping Method
                </Typography>

                <FormControl component="fieldset">
                  <RadioGroup
                    value={shippingMethod}
                    onChange={handleShippingMethodChange}
                  >
                    <Box
                      component={motion.div}
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        border: `1px solid ${shippingMethod === 'self' ? theme.palette.primary.main : theme.palette.divider}`,
                        p: 1.5,
                        cursor: 'pointer'
                      }}
                      onClick={() => setShippingMethod('self')}
                    >
                      <FormControlLabel
                        value="self"
                        control={<Radio color="primary" />}
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={500}>Self Shipping</Typography>
                            <Typography variant="caption" color="textSecondary">
                              Handle shipping yourself
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>

                    <Box
                      component={motion.div}
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        borderRadius: 2,
                        border: `1px solid ${shippingMethod === 'swapship' ? theme.palette.primary.main : theme.palette.divider}`,
                        p: 1.5,
                        cursor: 'pointer',
                        background: shippingMethod === 'swapship' ? 'rgba(77, 161, 169, 0.05)' : 'transparent'
                      }}
                      onClick={() => setShippingMethod('swapship')}
                    >
                      <FormControlLabel
                        value="swapship"
                        control={<Radio color="primary" />}
                        label={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight={500}>SwapShip Service</Typography>
                              <Chip
                                label="Recommended"
                                size="small"
                                color="primary"
                                sx={{ ml: 1, height: 20, '& .MuiChip-label': { px: 1, py: 0 } }}
                              />
                            </Box>
                            <Typography variant="caption" color="textSecondary">
                              We handle the shipping logistics for you
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  </RadioGroup>
                </FormControl>

                {orderData.trackingNumber && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrackChangesIcon fontSize="small" sx={{ mr: 0.5 }} /> Tracking Number
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" fontFamily="monospace" sx={{ mr: 1 }}>
                        {orderData.trackingNumber}
                      </Typography>
                      <Tooltip
                        title={copied === 'tracking' ? 'Copied!' : 'Copy Tracking'}
                        TransitionComponent={Zoom}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(orderData.trackingNumber || '', 'tracking')}
                        >
                          {copied === 'tracking' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

// Example usage with mock data
export default function NFTOrderDetailsExample() {
  const mockData = {
    orderId: "ORD-8475-TXNFT-2025",
    nftName: "Celestial Harmony #42",
    nftSymbol: "CLHM",
    nftAddress: "0x7c5EA222F21711fA42e8D1377e65E853A1e2c717",
    nftUri: "ipfs://QmT8jMsV5zWjhdHydfE2mLJvvCCuKqNXQvnHEKKzc3dQfZ",
    nftImageUrl: "https://placehold.co/400",
    sellerAddress: "0x1b7Ef8578D26CC87AE8FD9f9621fa578Ed92D54C",
    sellerName: "CryptoCreator",
    sellerAvatar: "https://placehold.co/100",
    buyerAddress: "0x9d3A3D87D8f55d7B390912bcaA1D3b12E620778C",
    buyerName: "DigitalCollector",
    buyerAvatar: "https://placehold.co/100",
    orderStatus: "shipped" as const,
    paymentStatus: "paid" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    trackingNumber: "TRK-1Z999AA10123456784"
  };

  return <NFTOrderDetails orderData={mockData} />;
}