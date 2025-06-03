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
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Send as SendIcon,
  ContentCopy as ContentCopyIcon,
  LocalShipping as LocalShippingIcon,
  AccountBalanceWallet as WalletIcon,
  TrackChanges as TrackChangesIcon,
  Check as CheckIcon,
  Payments as PaymentsIcon,
  Assignment as AssignmentIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  ChatBubbleOutline as ChatIcon,
  ArrowForward as ArrowForwardIcon,
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
import { Node, Edge } from '../Hub/HubConnectionMap';
import TrackingModal from './Tracking';
import ConfirmationModalDemo from './VerificationConfirmationModal';


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
  latitude: number;
  longitude: number;
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
  shippingRoutes: Edge[];
  verificationStatus: 'approved' | 'rejected' | 'pending';
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
        latitude: 0,
        longitude: 0,
      },
      seller_address: {
        house_no_or_name: "",
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        landmark: "",
        latitude: 0,
        longitude: 0,
      },
      isSellerConfirmed: false,
      isBuyerConfirmed: false,
      trackingNumber: "",
      shippingMethod: "",
      sourceHub: {} as Hub,
      destinationHub: {} as Hub,
      shippingRoutes: [],
      verificationStatus: 'pending'
    },
    escrowTransaction: {} as Transaction,
    ownershipTransferTransaction: {} as NFTTransaction,
    ownershipTransferStatus: "pending",

  });



  const [messages, setMessages] = useState<Message[]>([]);

  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("swap");

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


  const handleRoutes = () => {
    const routes = orderData.shippingDetails.shippingRoutes;

    // Prevent duplicate insertion of initial/final edges
    const hasInitialEdge = routes.length > 0 && routes[0].id === 0;
    const hasFinalEdge = routes.length > 2 && routes[routes.length - 1].id === -1;

    if (routes.length > 0 && !hasInitialEdge && !hasFinalEdge) {
      const updatedRoutes: Edge[] = [];

      const sellerSource: Node = {
        id: 0,
        position: [
          orderData.shippingDetails.seller_address.latitude,
          orderData.shippingDetails.seller_address.longitude,
        ] as [number, number],
        title: orderData.shippingDetails.seller_address.city,
      };

      const buyerDest: Node = {
        id: -1,
        position: [
          orderData.shippingDetails.buyer_address.latitude,
          orderData.shippingDetails.buyer_address.longitude,
        ] as [number, number],
        title: orderData.shippingDetails.buyer_address.city,
      };

      const firstRoute = routes[0];
      const lastRoute = routes[routes.length - 1];

      const initialEdge: Edge = {
        id: 0,
        fromNode: sellerSource,
        to: orderData.shippingDetails.sourceHub.id === firstRoute.fromNode.id
          ? firstRoute.fromNode
          : firstRoute.to,
        distance: 0,
        cost: 0,
        time: ""
      };

      const finalEdge: Edge = {
        id: -1,
        fromNode: orderData.shippingDetails.destinationHub.id === lastRoute.fromNode.id
          ? lastRoute.fromNode
          : lastRoute.to,
        to: buyerDest,
        distance: 0,
        cost: 0,
        time: ""
      };

      updatedRoutes.push(initialEdge, ...routes, finalEdge);

      setOrderData((prev) => ({
        ...prev,
        shippingDetails: {
          ...prev.shippingDetails,
          shippingRoutes: updatedRoutes,
        },
      }));
    }
  }


  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const socketChatUrl = `wss://swapchain.duckdns.org/ws/chat/${id}/`;
  const socketUpdateUrl = `wss://swapchain.duckdns.org/ws/updates/${id}/`

  const [socket, setSocket] = useState<WebSocket | null>(null);


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
          shippingDetails: {
            ...prev.shippingDetails,
            isSellerConfirmed: true,
          },
        }));
      } else if (data.type === "order_update") {
        setOrderData((prev) => ({
          ...prev,
          orderStatus: data.shippingMethod === "self" ? "confirmed" : "processing",
          shippingDetails: {
            ...prev.shippingDetails,
            shippingMethod: data.shippingMethod === "self" ? "self" : "swap",
            sourceHub: data.shippingMethod === "swap" ? data.sourceHub : null,
            destinationHub: data.shippingMethod === "swap" ? data.destinationHub : null,
            trackingNumber: data.shippingMethod === "swap" ? data.trackingNumber : null,
          },
        }));

      } else if (data.type === "shipping_update") {
        setOrderData((prev) => ({
          ...prev,
          orderStatus: "confirmed",
          shippingDetails: {
            ...prev.shippingDetails,
            shippingMethod: data.method,
            shippingRoutes: data.method === "swap" ? data.routes : prev.shippingDetails.shippingRoutes,
          }
        }));
      } else if (data.type === "ownership_transfer") {
        setOrderData((prev) => ({
          ...prev,
          paymentStatus: "paid",
          escrowTransaction: {
            ...prev.escrowTransaction,
            transactionHash: data.transaction_hash,
            status: data.status,
            timeStamp: Date.now(), // Fixed here
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

  const getConfirmationStatusColor = () => {
    switch (orderData.shippingDetails.verificationStatus) {
      case 'pending': return theme.palette.warning.main; // Waiting for confirmation
      case 'approved': return theme.palette.success.main; // Order confirmed by seller
      case 'rejected': return theme.palette.error.main; // Order was canceled
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


  const handleShippingMethodSubmit = async (method: string) => {
    try {
      const response = await API.post('order/shipping/shortest/', {
        orderId: orderData.orderId,
        method: method
      })

      if (method === "swap") {

        setOrderData((prev) => ({
          ...prev,
          shippingDetails: {
            ...prev.shippingDetails,
            shippingMethod: method,
            shippingRoutes: response.data.routes
          }
        }))
      } else {
        setOrderData((prev) => ({
          ...prev,
          shippingDetails: {
            ...prev.shippingDetails,
            shippingMethod: method
          }
        }))
      }
    } catch (error) {
      alert(error)
    }
  };


  const [trackingOpen, setTrackingOpen] = useState(false);

  const handleTrackingModal = () => {
    if (!trackingOpen) {
      handleRoutes();
      setTrackingOpen(true);
    } else {
      setTrackingOpen(false);
    }

  }


  const handleVerification = async (isValid: boolean) => {
    try {
      await API.post('hub/product/verify/', {
        orderId: orderData.orderId,
        verificationStatus: isValid ? "approved" : "rejected",
      });
      setOrderData((prev) => ({
        ...prev,
        shippingDetails: {
          ...prev.shippingDetails,
          verificationStatus: isValid ? "approved" : "rejected"
        }
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

      <TrackingModal
        edges={orderData.shippingDetails.shippingRoutes}
        open={trackingOpen}
        onClose={handleTrackingModal}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', height: "75%", overflow: "hidden" }}>


        <Grid2 container>
          <Grid2 size={{ xs: 12, md: 5 }}>

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
                  src={`https://swapchain.duckdns.org${orderData.nftImageUrl}`}
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
          <Grid2 size={{ xs: 12, md: 7 }}>
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
        <Box sx={{ height: '50%', p: { xs: 1, sm: 2, md: 3 }, pt: 2, overflow: "auto" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssignmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
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
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
              gap: { xs: 2, sm: 3 }
            }}
          >
            {/* Left column */}
            <Box>
              <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 }, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssignmentIcon fontSize="small" sx={{ mr: 0.5 }} /> Order ID
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2" fontFamily="monospace" sx={{
                    wordBreak: 'break-all',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
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
                  elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 }, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalShippingIcon sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Shipping Details
                      </Typography>
                    </Box>
                  </Box>

                  <Grid2 container spacing={{ xs: 2, sm: 3 }}>
                    {/* Shipping From (Seller) */}
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          bgcolor: 'background.default',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <LocationOnIcon sx={{ color: 'secondary.main', mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            Shipping From
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          {orderData.shippingDetails.shippingMethod === "self" ?
                            <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} /> :
                            (userId === orderData.ownerId ?
                              <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} /> :
                              <WalletIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />)}
                          <Typography variant="body1" fontWeight="medium" sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            wordBreak: 'break-word'
                          }}>
                            {orderData.sellerName}
                          </Typography>
                        </Box>

                        <Box sx={{ pl: { xs: 2, sm: 3 } }}>
                          {formatAddress(orderData.shippingDetails?.seller_address)}
                        </Box>
                      </Paper>
                    </Grid2>

                    {/* Shipping To (Buyer) */}
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          bgcolor: 'background.default',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <HomeIcon sx={{ color: 'accent.main', mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            Shipping To
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          {orderData.shippingDetails.shippingMethod === "self" ?
                            <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} /> :
                            (userId === orderData.ownerId ?
                              <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} /> :
                              <WalletIcon sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />)}
                          <Typography variant="body1" fontWeight="medium" sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            wordBreak: 'break-word'
                          }}>
                            {orderData.buyerName}
                          </Typography>
                        </Box>

                        <Box sx={{ pl: { xs: 2, sm: 3 } }}>
                          {formatAddress(orderData.shippingDetails?.buyer_address)}
                        </Box>
                      </Paper>
                    </Grid2>
                  </Grid2>

                  <Divider sx={{ my: 3 }} />

                  {/* Additional Shipping Info */}
                  <Grid2 container spacing={{ xs: 2, sm: 3 }}>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <CalendarTodayIcon sx={{ color: 'secondary.main', mr: 1, fontSize: '1.25rem' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Order Date
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {new Date(orderData.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <AccessTimeIcon sx={{ color: 'secondary.main', mr: 1, fontSize: '1.25rem' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Last Updated
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
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
              <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 }, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  gap: { xs: 2, sm: 0 },
                  mb: 2
                }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrackChangesIcon fontSize="small" sx={{ mr: 0.5 }} /> Order Status
                    </Typography>
                    <Chip
                      label={orderData.orderStatus.toUpperCase()}
                      sx={{
                        bgcolor: getStatusColor(),
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrackChangesIcon fontSize="small" sx={{ mr: 0.5 }} /> Verification Status
                    </Typography>
                    <Chip
                      label={String(orderData.shippingDetails.verificationStatus).toUpperCase()}
                      sx={{
                        bgcolor: getConfirmationStatusColor(),
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' }
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
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                      }}
                    />
                    {orderData.shippingDetails.verificationStatus === "approved" &&
                      <>
                        {(orderData.ownerId !== userId) &&
                          (orderData.paymentStatus === "unpaid")
                          && (orderData.orderStatus !== "pending"
                            && orderData.orderStatus !== "processing")

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
                      </>
                    }
                  </Box>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: "#fff",
                  boxShadow: 1,
                }}
              >
                {!orderData.shippingDetails.isBuyerConfirmed || !orderData.shippingDetails.isSellerConfirmed ? (
                  <OrderManagement
                    orderId={orderData.orderId}
                    price={Number(orderData.price).toFixed(2)}
                    isSeller={orderData.ownerId === userId}
                    updatePrice={updatePrice}
                    buyerConfirmed={orderData.shippingDetails.isBuyerConfirmed}
                    onConfirm={confirmOrder}
                  />
                ) : (
                  <Box sx={{ mt: 2 }}>

                    {/* ESCROW / PAYMENT STATUS MESSAGES */}

                    {orderData.shippingDetails.verificationStatus === "pending" ? <>
                      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        Once the verification is complete the payment can be made and the ownership can be transfered respectively
                      </Typography>
                    </> : orderData.shippingDetails.verificationStatus === "approved" ? <>
                      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        Product has been successfully verified and the payment can be made and the ownership can be transfered respectively
                      </Typography>
                    </> : null}


                    {orderData.shippingDetails.verificationStatus === "approved" && (
                      <>
                        {orderData.paymentStatus === "unpaid" && orderData.orderStatus !== "pending" && (
                          <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Once the payment is made, it will be held in escrow until the ownership is transferred.
                          </Typography>
                        )}
                        {orderData.ownerId === userId &&
                          orderData.paymentStatus === "escrow" &&
                          orderData.ownershipTransferStatus === "pending" && (
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Payment from the buyer is held in escrow and will be credited to your wallet when the ownership transfer is completed.
                            </Typography>
                          )}
                      </>
                    )}




                    {orderData.ownerId !== userId && orderData.paymentStatus === "escrow" && orderData.ownershipTransferStatus === "pending" && (
                      <>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Your payment is safe and held in escrow.</Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                          <Typography variant="body2" color="text.secondary">
                            Payment Transaction Hash:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{
                              wordBreak: 'break-all',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                              {orderData.escrowTransaction.transaction_hash?.slice(0, 8)}...
                              {orderData.escrowTransaction.transaction_hash?.slice(-4)}
                            </Typography>
                            <Tooltip title={orderData.escrowTransaction.transaction_hash || 'No hash available'}>
                              <IconButton
                                size="small"
                                onClick={() => handleCopy(orderData.escrowTransaction.transaction_hash, 'transactionHash')}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Stack>
                      </>
                    )}

                    {orderData.ownershipTransferStatus === "confirmed" && orderData.paymentStatus === "escrow" && (
                      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        Payment from escrow in progress. Please wait for confirmation.
                      </Typography>
                    )}

                    {orderData.paymentStatus === "paid" && orderData.ownershipTransferStatus === "confirmed" && (
                      <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        Payment and ownership transfer have been successfully completed.
                      </Typography>
                    )}

                    {/* SELECT SHIPPING METHOD IF NOT ALREADY SET */}
                    {(orderData.shippingDetails.shippingMethod === "swap"
                      && orderData.orderStatus === "processing"
                      && orderData.ownerId !== userId)
                      ? (
                        <FormControl component="fieldset" sx={{
                          mt: 3,
                          p: { xs: 2, sm: 3 },
                          borderRadius: 2,
                          boxShadow: 3,
                          backgroundColor: '#f9f9f9',
                          width: '100%'
                        }}>
                          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            Swap Shipping (Platform-based) is available with product verification.
                          </Typography>
                          <Typography variant="body1" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            You can either choose to buy the item yourself or opt for platform-based shipping.
                            <br />
                            Which is your preference?
                          </Typography>

                          <FormLabel component="legend" sx={{ mt: 2 }}>Select Shipping Method</FormLabel>
                          <RadioGroup
                            name="shippingMethod"
                            value={selectedShippingMethod} onChange={(e) => setSelectedShippingMethod(e.target.value)}
                            defaultValue="swap" sx={{ mt: 1 }}
                          >
                            <FormControlLabel value="swap" control={<Radio />} label="Platform Shipping (Swap)" />
                            <FormControlLabel value="self" control={<Radio />} label="Self Shipping" />
                          </RadioGroup>

                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              mt: 3,
                              width: { xs: '100%', sm: 'auto' }
                            }}
                            onClick={() => handleShippingMethodSubmit(selectedShippingMethod)}
                          >
                            Submit
                          </Button>
                        </FormControl>
                      ) : (orderData.shippingDetails.shippingMethod === "swap"
                        && orderData.orderStatus === "processing"
                        && orderData.ownerId === userId
                      ) ? (<>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body1" fontWeight="medium" component="span" sx={{
                            ml: 1,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}>
                            Swap Shipping (Platform-based) is available. waiting for confirmation from buyer.
                          </Typography>
                        </Box>
                      </>) : null}

                    {(orderData.ownerId !== userId &&
                      orderData.shippingDetails.shippingMethod === "self" &&
                      orderData.shippingDetails.verificationStatus === "pending"
                    ) && <Box>
                        <ConfirmationModalDemo
                          handleVerification={handleVerification}
                        />
                      </Box>}

                    {/* SHIPPING DETAILS */}
                    {(orderData.shippingDetails.shippingMethod && orderData.orderStatus === "confirmed") && (
                      <>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" component="span">
                            Shipping Method:
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" component="span" sx={{
                            ml: 1,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}>
                            {String(orderData.shippingDetails.shippingMethod).toUpperCase()}
                          </Typography>
                          {orderData.shippingDetails.shippingMethod === "swap" && <>
                            <Button
                              sx={{
                                ml: { xs: 0, sm: 1 },
                                mt: { xs: 1, sm: 0 },
                                display: { xs: 'block', sm: 'inline-block' },
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                              }}
                              variant='outlined'
                              onClick={handleTrackingModal}
                            >
                              View shipping Routes
                            </Button>
                          </>}
                        </Box>
                      </>
                    )}

                    {/* ORDER PRICE */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" component="span">
                        Price:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" component="span" sx={{
                        ml: 1,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        $ {Number(orderData.price).toFixed()}
                      </Typography>
                    </Box>

                    {/* PAYMENT HASHES & HUBS */}
                    {orderData.paymentStatus === "paid" && (
                      <Box sx={{ mt: 3 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                          <Typography variant="body2" color="text.secondary">
                            Payment Transaction Hash:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{
                              wordBreak: 'break-all',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                              {orderData.escrowTransaction.transaction_hash?.slice(0, 8)}...
                              {orderData.escrowTransaction.transaction_hash?.slice(-4)}
                            </Typography>
                            <Tooltip title={orderData.escrowTransaction.transaction_hash || 'No hash available'}>
                              <IconButton
                                size="small"
                                onClick={() => handleCopy(orderData.escrowTransaction.transaction_hash, 'transactionHash')}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Ownership Transfer Transaction Hash:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{
                              wordBreak: 'break-all',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}>
                              {orderData.ownershipTransferTransaction.transactionHash?.slice(0, 8)}...
                              {orderData.ownershipTransferTransaction.transactionHash?.slice(-4)}
                            </Typography>
                            <Tooltip title={orderData.ownershipTransferTransaction.transactionHash || 'No hash available'}>
                              <IconButton
                                size="small"
                                onClick={() => handleCopy(orderData.ownershipTransferTransaction.transactionHash, 'transactionHash')}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {orderData.shippingDetails.sourceHub.pincode || '-'}
                          </Typography>
                          <ArrowForwardIcon fontSize="small" />
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {orderData.shippingDetails.destinationHub.pincode || '-'}
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                )}
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