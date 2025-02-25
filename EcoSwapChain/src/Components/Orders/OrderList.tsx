import React, { useState } from 'react';
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
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Launch,
  ContentCopy,
  CheckCircle,
  Pending,
  Timeline,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Types
interface Order {
  id: string;
  nftName: string;
  nftImage: string;
  fromAddress: string;
  toAddress: string;
  status: 'pending' | 'processing' | 'fulfilled';
  timestamp: string;
  transactionHash?: string;
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

const NFTOrderListing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Sample data - replace with your actual data
  const orders: Order[] = [
    {
      id: '1',
      nftName: 'Digital Art Collection #1',
      nftImage: '/api/placeholder/100/100',
      fromAddress: '0x1234...5678',
      toAddress: '0x9876...5432',
      status: 'pending',
      timestamp: '2025-02-19T10:00:00Z',
    },
    // Add more sample orders...
  ];

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
    <Fade in timeout={800}>
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
              <Typography variant="h6" fontWeight="600">
                {order.nftName}
              </Typography>
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
                  label={order.fromAddress}
                  onDelete={() => handleCopyAddress(order.fromAddress)}
                  deleteIcon={<ContentCopy fontSize="small" />}
                />
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  To:
                </Typography>
                <AddressChip
                  label={order.toAddress}
                  onDelete={() => handleCopyAddress(order.toAddress)}
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
                {new Date(order.timestamp).toLocaleString()}
              </Typography>
              
              {order.transactionHash && (
                <Tooltip title="View Transaction">
                  <IconButton size="small" color="primary">
                    <Launch fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </Stack>
      </OrderCard>
    </Fade>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="600">
        My Orders
      </Typography>

      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <TabList 
            onChange={(_, value) => setActiveTab(value)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="All Orders" value="all" />
            <Tab label="Pending" value="pending" />
            <Tab label="Processing" value="processing" />
            <Tab label="Fulfilled" value="fulfilled" />
          </TabList>
        </Box>

        <TabPanel value="all" sx={{ p: 0 }}>
          {orders.map(order => renderOrder(order))}
        </TabPanel>

        <TabPanel value="pending" sx={{ p: 0 }}>
          {orders
            .filter(order => order.status === 'pending')
            .map(order => renderOrder(order))}
        </TabPanel>

        <TabPanel value="processing" sx={{ p: 0 }}>
          {orders
            .filter(order => order.status === 'processing')
            .map(order => renderOrder(order))}
        </TabPanel>

        <TabPanel value="fulfilled" sx={{ p: 0 }}>
          {orders
            .filter(order => order.status === 'fulfilled')
            .map(order => renderOrder(order))}
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default NFTOrderListing;