import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Stack,
  Chip,
  Avatar,
  Tab,
  Fade,
  LinearProgress,
  Divider,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  ContentCopy,
  CheckCircle,
  Pending,
  Timeline,
  ShoppingCart,
  Sell,
  FilterList,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import RouteDisplayC from '../RouteDisplay';
import { API } from '../API/api';
import { useAppSelector } from '../../store';
import { Link } from 'react-router';
import { setLoading } from '../../Redux/alertBackdropSlice';
import { useDispatch } from 'react-redux';

// Types
interface Order {
  id: number;
  ownerId: number
  nftName: string;
  nftImage: string;
  sellerAddress: string;
  buyerAddress: string;
  orderType: 'buy' | 'sell';
  status: 'pending' | 'processing' | 'fulfilled';
  createdAt: string;
}

// Styled Components
const OrderCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateX(8px)',
    boxShadow: theme.shadows[3],
    '&::before': {
      opacity: 1,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    background: theme.palette.gradient.primary,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
}));

const AddressChip = styled(Chip)(({ theme }) => ({
  maxWidth: 200,
  '& .MuiChip-label': {
    textOverflow: 'ellipsis',
  },
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  backgroundColor:
    status === 'fulfilled'
      ? theme.palette.accent.main
      : status === 'processing'
        ? theme.palette.primary.main
        : theme.palette.secondary.light,
  color: theme.palette.surface.contrastText,
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

const StatusDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: `${theme.spacing(3)} 0`,
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const StatusHeader = styled(Typography)(({ theme }) => ({
  margin: `0 ${theme.spacing(2)}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const NFTOrderListing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const dispatch = useDispatch()

  const userId = useAppSelector((state) => state.user.id);
  const userRefId = useRef(userId);

  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      dispatch(setLoading(true))
      const response = await API.get(`/order/list/`);
      const ordersData = response.data.orders;
      ordersData.forEach((order: Order) => {
        if (order.ownerId === userRefId.current) {
          order.orderType = "sell"
        } else {
          order.orderType = "buy"
        }
      })
      setOrders(ordersData);
      console.log(ordersData);
    } catch (error) {
      console.log(error);
    } finally { 
      dispatch(setLoading(false))
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'fulfilled':
        return <CheckCircle fontSize="small" />;
      case 'processing':
        return <Timeline fontSize="small" />;
      case 'pending':
        return <Pending fontSize="small" />;
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // You could add a toast notification here
  };

  const renderOrder = (order: Order) => (
    <Fade in timeout={800} key={order.id}>
      <OrderCard>
        <Stack direction="row" spacing={3} alignItems="center">
          {/* NFT Image */}
          <Avatar
            src={order.nftImage}
            alt={order.nftName}
            variant="rounded"
            sx={{ width: 80, height: 80 }}
          />

          {/* Order Details */}
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Link to={`/order/retrieve/${order.id}`} style={{ textDecoration: "none"}}> 
              <Typography variant="h6" fontWeight="600" sx={{ textDecoration: 'none' }}>
                {order.nftName}
                </Typography>
              </Link>
              <StatusChip
                status={order.status}
                icon={getStatusIcon(order.status)}
                label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              />
            </Stack>

            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  From:
                </Typography>
                <AddressChip
                  label={order.sellerAddress}
                  onDelete={() => handleCopyAddress(order.sellerAddress)}
                  deleteIcon={<ContentCopy fontSize="small" />}
                />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  To:
                </Typography>
                <AddressChip
                  label={order.buyerAddress}
                  onDelete={() => handleCopyAddress(order.buyerAddress)}
                  deleteIcon={<ContentCopy fontSize="small" />}
                />
              </Stack>
            </Stack>

            {order.status === 'processing' && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="indeterminate"
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(77, 161, 169, 0.1)',
                  }}
                />
              </Box>
            )}

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography variant="caption" color="text.secondary">
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </OrderCard>
    </Fade>
  );

  // Group orders by type and status
  const renderOrdersByTypeAndStatus = (orderType: Order['orderType']) => {
    const filteredOrders = orders.filter(order => order.orderType === orderType);
    const statuses: Order['status'][] = ['pending', 'processing', 'fulfilled'];

    return (
      <Box>
        {statuses.map((status) => {
          const statusOrders = filteredOrders.filter(order => order.status === status);

          if (statusOrders.length === 0) return null;

          return (
            <Box key={`${orderType}-${status}`}>
              <StatusDivider>
                <StatusHeader variant="subtitle1" color="text.secondary">
                  {getStatusIcon(status)}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </StatusHeader>
              </StatusDivider>

              {statusOrders.map(order => renderOrder(order))}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (

    
    <Container maxWidth="lg">
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList
            onChange={(_, value) => setActiveTab(value)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="All Orders"
              value="all"
              icon={<FilterList />}
              iconPosition="start"
            />
            <Tab
              label="Buy Orders"
              value="buy"
              icon={<ShoppingCart />}
              iconPosition="start"
            />
            <Tab
              label="Sell Orders"
              value="sell"
              icon={<Sell />}
              iconPosition="start"
            />
          </TabList>
        </Box>

        <TabPanel value="all" sx={{ p: 0 }}>
          <Box mb={4}>
            <StatusDivider>
              <StatusHeader variant="h6" color="primary">
                <ShoppingCart fontSize="small" />
                Buy Orders
              </StatusHeader>
            </StatusDivider>
            {renderOrdersByTypeAndStatus('buy')}
          </Box>

          <Box>
            <StatusDivider>
              <StatusHeader variant="h6" color="primary">
                <Sell fontSize="small" />
                Sell Orders
              </StatusHeader>
            </StatusDivider>
            {renderOrdersByTypeAndStatus('sell')}
          </Box>
        </TabPanel>

        <TabPanel value="buy" sx={{ p: 0 }}>
          {renderOrdersByTypeAndStatus('buy')}
        </TabPanel>

        <TabPanel value="sell" sx={{ p: 0 }}>
          {renderOrdersByTypeAndStatus('sell')}
        </TabPanel>

      </TabContext>
    </Container>
  );
};

export default NFTOrderListing;