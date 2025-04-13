import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  Paper,
  Grow,
  Tooltip,
  Zoom,
  Grid2,
  useTheme,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Send as SendIcon,
  ContentCopy as ContentCopyIcon,
  LocalShipping as LocalShippingIcon,
  AccountBalanceWallet as WalletIcon,
  Schedule as ScheduleIcon,
  Update as UpdateIcon,
  TrackChanges as TrackChangesIcon,
  Check as CheckIcon,
  Payments as PaymentsIcon,
  Assignment as AssignmentIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  ChatBubbleOutline as ChatIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router';
import { API } from '../API/api';
import { useAppSelector } from '../../store';
import { useRef } from 'react';
import { Hub } from '../Hub/Hub';
import OrderManagement from './OrderUpdate';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { setAlertMessage, setAlertOn, setAlertSeverity, setLoading } from '../../Redux/alertBackdropSlice';
import { useDispatch } from 'react-redux';
import Payment from './OrderPayment';
import TransferOwnershipModal from './TransferOwnership';
import { Transaction } from '../Wallet/Wallet';
import { NFTTransaction } from '../NFT/NFTDetails';
import { setTimeout } from 'timers';



// Types for our component
interface Message {
  message: string;
  sender: number;
  timestamp: Date;
}

interface Address {
  house_no_or_name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  landmark: string;
}

interface ShippingDetails {
  buyer_address: Address;
  seller_address: Address;
  isSellerConfirmed: boolean;
  isBuyerConfirmed: boolean;
  trackingNumber: string;
  shippingMethod: string;
  sourceHub: Hub;
  destinationHub: Hub;
}


interface NFTOrderDetailsProps {
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
  orderStatus:
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'escrow' | 'failed' | 'processing';
  createdAt: Date;
  updatedAt: Date;
  ownerId: number;
  price: string;
  shippingDetails: ShippingDetails;
  escrowTransaction: Transaction;
  ownershipTransferTransaction: NFTTransaction;
  ownershipTransferStatus: 'pending' | 'processing' | 'confirmed' | 'failed';
}

// Function to truncate Ethereum addresses
const truncateAddress = (address: string) => {
  return `${address.substring(0, 12)}...${address.substring(address.length - 4)}`;
};

const NFTOrderDetails: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams();

  const userId = useAppSelector((state) => state.user.id);
  const userIdRef = useRef(userId); // Store latest userId

  const dispatch = useDispatch()

  // Keep ref updated whenever Redux state changes
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const [orderData, setOrderData] = useState<NFTOrderDetailsProps>({
    orderId: "",
    nftName: "",
    nftSymbol: "",
    nftAddress: "",
    nftUri: "",
    nftImageUrl: "",
    sellerAddress: "",
    sellerName: "",
    sellerAvatar: "",
    buyerAddress: "",
    buyerName: "",
    buyerAvatar: "",
    orderStatus: "pending",
    paymentStatus: "unpaid",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    ownerId: 0,
    price: "",
    shippingDetails: {
      buyer_address: {
        house_no_or_name: "",
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        landmark: "",
      },
      seller_address: {
        house_no_or_name: "",
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        landmark: "",
      },
      isSellerConfirmed: false,
      isBuyerConfirmed: false,
      trackingNumber: "TRK-1Z999AA10123456784",
      shippingMethod: "FedEx",
      sourceHub: {} as Hub,
      destinationHub: {} as Hub,
    },
    escrowTransaction: {} as Transaction,
    ownershipTransferTransaction: {} as NFTTransaction,
    ownershipTransferStatus: "pending"
  });



  const [messages, setMessages] = useState<Message[]>([]);

  const [newMessage, setNewMessage] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (socket && newMessage.trim()) {
      const message = {
        message: newMessage,
        sender: userId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5)
      }
      socket.send(JSON.stringify({
        message: newMessage,
        sender: userId,
      }));
      setMessages((prev) => [...prev, message]); // Append new messages to state
      setNewMessage('');
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
    console.log(orderData)
  };



  async function fetchOrder() {
    dispatch(setLoading(true))
    try {
      const response = await API.get(`/order/retrieve/${id}`);
      console.log(response.data);
      setOrderData(response.data.order);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function fetchMessages() {
    dispatch(setLoading(true))
    try {
      const response = await API.get(`/order/retrieve/${id}/messages`);
      console.log(response.data);
      setMessages(response.data.messages);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    fetchOrder();
    fetchMessages();
  }, []);


  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const socketChatUrl = `ws://127.0.0.1:8000/ws/chat/${id}/`;
  const socketUpdateUrl = `ws://127.0.0.1:8000/ws/updates/${id}/`

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [updateSocket, setUpdateSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const newSocket = new WebSocket(socketUpdateUrl);

    newSocket.onopen = () => {
      console.log("✅ Update Socket Connected");
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      if (data.type === "update_price") {
        setOrderData((prev) => ({
          ...prev,
          price: data.updated_price,
        }));
      } else if (data.type === "buyer_confirmation") {
        setOrderData((prev) => ({
          ...prev,
          shippingDetails: {
            ...prev.shippingDetails,
            isBuyerConfirmed: true,
          },
        }));
      } else if (data.type === "seller_confirmation") {
        setOrderData((prev) => ({
          ...prev,
          orderStatus: "confirmed",
          shippingDetails: {
            ...prev.shippingDetails,
            isSellerConfirmed: true,
          },
        }));
      } else if (data.type === "order_update") {
        setOrderData((prev) => ({
          ...prev,
          shippingDetails: {
            ...prev.shippingDetails,
            shippingMethod: data.shipping_method === "self" ? "self" : "swap",
            sourceHub: data.shipping_method === "swap" ? data.source_hub : null,
            destinationHub: data.shipping_method === "swap" ? data.destination_hub : null,
          },
        }));
      } else if (data.type === "ownership_transfer") {
        setOrderData((prev) => ({
          ...prev,
          paymentStatus: "paid",
          escrowTransaction: {
            ...prev.escrowTransaction,
            transactionHash: data.transaction_hash,
            status: data.status,
            timeStamp: data.timestamp,
          },
        }));
      } else if (data.type === "nft_transfer") {
        setOrderData((prev) => ({
          ...prev,
          ownershipTransferTransaction: data.transactionData,
          ownershipTransferStatus: "confirmed"
        }));
      } else if (data.type === "initiate_escrow") {
        if (userId === orderData.ownerId) {
          setOrderData((prev) => ({
            ...prev,
            escrowTransaction: data.transactionData,
            paymentStatus: "escrow",
            ownershipTransferStatus: "pending"
          }));
        }
      }
    };

    newSocket.onerror = (err) => {
      console.error("❌ WebSocket Error:", err);
    };

    newSocket.onclose = () => {
      console.log("🔴 WebSocket disconnected");
    };

    setUpdateSocket(newSocket);

    return () => {
      newSocket.close(); // Cleanup on unmount
    };
  }, [socketUpdateUrl, userId, orderData.ownerId]);



  useEffect(() => {
    const newSocket = new WebSocket(socketChatUrl);

    newSocket.onopen = () => {
      console.log("✅ WebSocket connected!");
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Received:", data, userIdRef.current); // Always latest userId

      if (data.sender !== userIdRef.current) {
        setMessages((prev) => [...prev, data]); // Append new messages to state
      }
    };

    newSocket.onerror = (err) => console.error("❌ WebSocket Error:", err);

    newSocket.onclose = () => {
      console.log("🔴 WebSocket disconnected");
    };

    setSocket(newSocket);

    return () => {
      newSocket.close(); // Cleanup on unmount
    };
  }, [socketChatUrl]); // Reconnect only if `socketUrl` changes



  // Order status color mapping
  const getStatusColor = () => {
    switch (orderData.orderStatus) {
      case 'pending': return theme.palette.warning.main; // Waiting for confirmation
      case 'confirmed': return theme.palette.info.light; // Order confirmed by seller
      case 'processing': return theme.palette.info.main; // Preparing for shipment
      case 'packed': return theme.palette.secondary.main; // Order is packed and ready
      case 'shipped': return theme.palette.primary.main; // In transit
      case 'out-for-delivery': return theme.palette.success.light; // Last-mile delivery
      case 'delivered': return theme.palette.success.main; // Successfully delivered
      case 'cancelled': return theme.palette.error.main; // Order was canceled
      default: return theme.palette.grey[500]; // Default/fallback color
    }
  };


  // Payment status color mapping
  const getPaymentStatusColor = () => {
    switch (orderData.paymentStatus) {
      case 'paid': return theme.palette.success.main;
      case 'escrow': return theme.palette.warning.main;
      case 'failed': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };

  const updatePrice = async (newPrice: number) => {
    if (newPrice > Number(orderData.price)) {
      dispatch(setAlertOn(true))
      dispatch(setAlertSeverity("warning"))
      dispatch(setAlertMessage("New price cannot be greater than the current price"))
      return
    }
    try {
      dispatch(setLoading(true))
      await API.put(`/order/update/${orderData.orderId}/price/`, {
        price: newPrice
      });
      setOrderData((prev) => ({ ...prev, price: String(newPrice) }));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false))
    }
  }

  const confirmOrder = async () => {
    try {
      await API.put(`order/confirm/${orderData.orderId}/`)
    } catch (error) {
      console.log(error)
    }
  }


  const onComplete = async (amount: number, tx: string) => {
    try {
      const { data } = await API.post('order/init/escrow/', {
        amount: amount,
        orderId: orderData.orderId,
        tx: tx
      })
      setOrderData((prev) => ({
        ...prev,
        paymentStatus: "escrow",
        ownershipTransferStatus: "pending",
        escrowTransaction: data.transactionData
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const onNFTTransferComplete = async (tx: string) => {
    try {
      await API.post("nfts/transfer/", {
        txHash: tx,
        orderId: orderData.orderId,
      })
      setOrderData((prev) => ({
        ...prev,
        ownershipTransferStatus: "confirmed"
      }))
    } catch (error) {
      console.error(error)
    }
  }


  // Helper function to format address
  const formatAddress = (address: Address) => {
    if (!address) return "Address Not Updated Yet";

    const {
      house_no_or_name,
      street,
      city,
      state,
      postal_code,
      country,
      landmark
    } = address;

    return (
      <Box>
        <Typography variant="body1" fontWeight="medium">
          {house_no_or_name && `${house_no_or_name}, `}
          {street}
        </Typography>
        <Typography variant="body1">
          {city}{city && state && ", "}{state} {postal_code}
        </Typography>
        <Typography variant="body1">{country}</Typography>
        {landmark && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Landmark: {landmark}
          </Typography>
        )}
      </Box>
    );
  };

  return (

    <Container maxWidth="lg" >
      {/* <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{

          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[2],
        }}
      > */}
      {/* Left Side - NFT Details */}





      {/* Right Side - Communication and Order Details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: "75%", overflow: "hidden" }}>


        <Grid2 container>
          <Grid2 size={5}>

            <Box
              sx={{
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
                  src={`http://localhost:8000${orderData.nftImageUrl}`}
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
                <LinkIcon fontSize="small" sx={{ mr: 0.5 }} /> NFT Address
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
          </Grid2>
          <Grid2 size={7}>
            <Box sx={{ height: "500px", p: 3, pb: 0, overflow: "scroll" }}>
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
                <Box ref={messagesContainerRef} sx={{
                  flex: 1,
                  overflowY: 'auto',
                  p: 2,
                  bgcolor: 'rgba(246, 244, 240, 0.5)'
                }}>
                  <List>
                    {messages.map((message, index) => (
                      <Grow
                        key={index}
                        in={true}
                        style={{ transformOrigin: message.sender === userId ? 'right' : 'left' }}
                        timeout={500}
                      >
                        <ListItem
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: message.sender === userId ? 'flex-end' : 'flex-start',
                            px: 1
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                            <Box
                              sx={{
                                p: 2,
                                bgcolor: message.sender === userId
                                  ? theme.palette.primary.main
                                  : theme.palette.background.paper,
                                color: message.sender === userId
                                  ? theme.palette.primary.contrastText
                                  : theme.palette.text.primary,
                                borderRadius: 2,
                                maxWidth: '70%',
                                boxShadow: message.sender === userId
                                  ? 'none'
                                  : theme.shadows[1]
                              }}
                            >
                              <Typography variant="body2">
                                {message.message}
                              </Typography>
                            </Box>

                            <ListItemAvatar sx={{ minWidth: 40 }}>
                              <Avatar
                                src={orderData.buyerAvatar}
                                sx={{ width: 32, height: 32 }}
                              />
                            </ListItemAvatar>

                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              px: 2,
                              color: theme.palette.text.secondary
                            }}
                          >
                            {new Date(message.timestamp).toLocaleString()}
                          </Typography>
                        </ListItem>
                      </Grow>
                    ))}
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
                    onClick={sendMessage}
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
          </Grid2>
        </Grid2>

        <Divider />
        {/* Order Details Section */}
        <Box sx={{ height: '50%', p: 3, pt: 2, overflow: "auto" }}>
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
              {orderData.orderStatus !== "pending" &&
                <Paper
                  elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalShippingIcon sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Shipping Details
                      </Typography>
                    </Box>
                  </Box>

                  <Grid2 container spacing={3}>
                    {/* Shipping From (Seller) */}
                    <Grid2 size={6}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          bgcolor: 'background.default',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <LocationOnIcon sx={{ color: 'secondary.main', mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Shipping From
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          {orderData.shippingDetails.shippingMethod === "self" ?
                            <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} /> :
                            (userId === orderData.ownerId ?
                              <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} /> :
                              <WalletIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />)}
                          <Typography variant="body1" fontWeight="medium">
                            {orderData.sellerName}
                          </Typography>
                        </Box>

                        <Box sx={{ pl: 3 }}>
                          {orderData.shippingDetails.shippingMethod === "self" ?
                            formatAddress(orderData.shippingDetails?.seller_address) :
                            (
                              userId === orderData.ownerId ?
                                formatAddress(orderData.shippingDetails?.seller_address) :
                                truncateAddress(orderData.sellerAddress)
                            )
                          }

                        </Box>
                      </Paper>
                    </Grid2>

                    {/* Shipping To (Buyer) */}
                    <Grid2 size={6}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          bgcolor: 'background.default',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <HomeIcon sx={{ color: 'accent.main', mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Shipping To
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          {orderData.shippingDetails.shippingMethod === "self" ?
                            <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} /> :
                            (userId === orderData.ownerId ?
                              <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} /> :
                              <WalletIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />)}
                          <Typography variant="body1" fontWeight="medium">
                            {orderData.buyerName}
                          </Typography>
                        </Box>

                        <Box sx={{ pl: 3 }}>
                          {orderData.shippingDetails.shippingMethod === "self" ?
                            formatAddress(orderData.shippingDetails?.buyer_address) :
                            (
                              userId === orderData.ownerId ?
                                formatAddress(orderData.shippingDetails?.buyer_address) :
                                truncateAddress(orderData.sellerAddress)
                            )
                          }
                        </Box>
                      </Paper>
                    </Grid2>
                  </Grid2>

                  <Divider sx={{ my: 3 }} />

                  {/* Additional Shipping Info */}
                  <Grid2 container spacing={3}>
                    <Grid2 size={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <CalendarTodayIcon sx={{ color: 'secondary.main', mr: 1, fontSize: '1.25rem' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Order Date
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {new Date(orderData.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid2>

                    <Grid2 size={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <AccessTimeIcon sx={{ color: 'secondary.main', mr: 1, fontSize: '1.25rem' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Last Updated
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {new Date(orderData.updatedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid2>
                  </Grid2>
                </Paper>}
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

                    {(orderData.ownerId !== userId) &&
                      (orderData.paymentStatus === "unpaid")
                      && (orderData.orderStatus !== "pending")

                      ? <Payment
                        amount={Number(orderData.price) / 2}
                        walletAddress={orderData.buyerAddress}
                        onComplete={onComplete}
                      /> : (orderData.ownerId === userId) &&
                        (orderData.paymentStatus === "escrow")
                        && (orderData.orderStatus !== "pending") &&
                        (orderData.ownershipTransferStatus === "pending")
                        ?
                        <TransferOwnershipModal
                          entityName={orderData.nftName}
                          onTransferComplete={onNFTTransferComplete}
                          orderId={orderData.orderId}
                          buyerAddress={orderData.buyerAddress}
                          mintAddress={orderData.nftAddress}
                        />
                        : null}
                  </Box>
                </Box>


              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                {!orderData.shippingDetails.isBuyerConfirmed || !orderData.shippingDetails.isSellerConfirmed ? (
                  <OrderManagement
                    orderId={orderData.orderId}
                    price={orderData.price}
                    isSeller={orderData.ownerId === userId}
                    updatePrice={updatePrice}
                    buyerConfirmed={orderData.shippingDetails.isBuyerConfirmed}
                    onConfirm={confirmOrder}
                  />
                ) : (
                  <Box sx={{ mt: 2 }}>
                    {(orderData.ownerId !== userId) &&
                      (orderData.paymentStatus === "unpaid")
                      && (orderData.orderStatus !== "pending")
                      ?
                      <Typography>
                        Once the payment is made, it will be held in escrow until the ownership is transfered
                      </Typography>
                      : (orderData.ownerId === userId) &&
                        (orderData.paymentStatus === "escrow")
                        && (orderData.orderStatus !== "pending")
                        ?
                        <>
                          <Typography>
                            Payment from the buyer is held at escrow and will be credited to your wallet when the ownership transfer is completed
                          </Typography>
                          <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                            <Tooltip title={orderData.escrowTransaction.transaction_hash}>
                              <IconButton
                                size="small"
                                onClick={() => handleCopy(orderData.escrowTransaction.transaction_hash, 'transactionHash')}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </>
                        : (orderData.ownerId !== userId) &&
                          (orderData.paymentStatus === "escrow")
                          && (orderData.orderStatus !== "pending")
                          ? <>
                            <Typography>
                              Your Payment is safe and held at escrow
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                              <Tooltip title={orderData.escrowTransaction.transaction_hash}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleCopy(orderData.escrowTransaction.transaction_hash, 'transactionHash')}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Typography>
                          </>
                          : (orderData.ownershipTransferStatus === "confirmed") &&
                            (orderData.paymentStatus === "escrow") ? <>
                            <Typography>
                              Payment from escrow in progress. Please wait for confirmation.
                            </Typography>
                          </> : (orderData.paymentStatus === "paid") && (orderData.ownershipTransferStatus === "confirmed") ? <>
                            <Typography>
                              Payment from escrow completed.
                            </Typography>
                          </> :
                            (orderData.ownershipTransferStatus === "processing") ? <>
                              <Typography>
                                Ownership Transfer Initiated. Please wait for confirmation.
                              </Typography>
                            </> : (orderData.ownershipTransferStatus === "confirmed") ? <>
                              <Typography>
                                Ownership Transfer Completed.
                              </Typography>
                            </> : null}

                    {orderData.shippingDetails.shippingMethod === "swap" &&
                      <>
                        <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrackChangesIcon fontSize="small" sx={{ mr: 0.5 }} /> Tracking Number
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" fontFamily="monospace" sx={{ mr: 1 }}>
                            {orderData.shippingDetails.trackingNumber}
                          </Typography>
                          <Tooltip
                            title={copied === 'tracking' ? 'Copied!' : 'Copy Tracking'}
                            slots={{ transition: Zoom }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(orderData.shippingDetails.trackingNumber || '', 'tracking')}
                            >
                              {copied === 'tracking' ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" component="span">
                        Shipping Method:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" component="span" sx={{ ml: 1 }}>
                        {String(orderData.shippingDetails.shippingMethod).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" component="span">
                        Price:
                      </Typography>
                      <Typography variant="body1" color="dark" fontWeight="medium" component="span" sx={{ ml: 1 }}>
                        ${orderData.price}
                      </Typography>
                    </Box>
                    <Box>
                      {orderData.paymentStatus === "paid" && <>
                        <Typography variant="body2" color="text.secondary">
                          Payment and Ownership Transfer has been successfully completed...
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ mr: 1 }}>
                          Payment Transaction Hash:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                          <Tooltip title={orderData.escrowTransaction.transaction_hash}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(orderData.escrowTransaction.transaction_hash, 'transactionHash')}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                        <Typography>
                          amount: {orderData.escrowTransaction.amount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ mr: 1 }}>
                          Ownership Transfer Transaction Hash:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                          <Tooltip title={orderData.ownershipTransferTransaction.transactionHash}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(orderData.ownershipTransferTransaction.transactionHash, 'transactionHash')}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                      </>}
                    </Box>
                  </Box>
                )
                }

              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* </Card> */}
    </Container>
  );
};


export default NFTOrderDetails