import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Fade,
  Collapse,
  Paper,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Favorite,
  SwapHoriz,
  ContentCopy,
  Launch,
  MoreVert,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { API } from '../../API/api';

// Types
interface NFTAsset {
  id: string;
  name: string;
  description: string;
  image: string;
  uri: string;
  price: number;
  symbol: string;
  nftType: 'CNFT' | 'NFT' | "" ;
  features: Record<string, string>;
  rootCategory?: string;
  mainCategory: string;
  condition?: string;
}

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    '& .card-actions': {
      transform: 'translateY(0)',
      opacity: 1,
    },
    '& .card-overlay': {
      opacity: 1,
    },
  },
}));

const CardActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  transform: 'translateY(100%)',
  opacity: 0,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 2,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.2)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 1,
}));

const URIChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  zIndex: 2,
  maxWidth: '60%',
  '& .MuiChip-label': {
    textOverflow: 'ellipsis',
  },
}));

const NFTCollection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [nftAssets, setNftAssets] = useState<NFTAsset[]>([  // ✅ Corrected type as an array
    {
      id: '0',
      name: '',
      description: '',
      image: '',
      uri: '',
      price: 0,
      symbol: '',
      nftType: '',
      features: {},
      rootCategory: '',
      mainCategory: "",
      condition: '',
    }
  ]);

  const fetchData = async () => {
    try {
      const response = await API.get("nfts/owner/list/")
      setNftAssets(response.data.nfts)
      console.log(response.data.nfts)
      console.log(nftAssets)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() =>  {
    fetchData();
  }, [])

  const handleCopyURI = (uri: string) => {
    navigator.clipboard.writeText(uri);
    // You could add a toast notification here
  };

  const renderNFTCard = (nft: NFTAsset) => (
    <Fade in timeout={800}>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard>
          <CardOverlay className="card-overlay" />
          <URIChip
            label={nft.uri}
            onDelete={() => handleCopyURI(nft.uri)}
            deleteIcon={<ContentCopy />}
          />
          <CardMedia
            component="img"
            height="240"
            image={`http://localhost:8000${nft.image}`}
            alt={nft.name}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom noWrap>
              {nft.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {nft.description}
            </Typography>
            <Stack direction="row" spacing={1} mt={2}>
              <Chip
                label={`${nft.price} ETH`}
                color="primary"
                size="small"
              />
              <Chip
                label={nft.symbol}
                color="secondary"
                size="small"
              />
            </Stack>
          </CardContent>
          <CardActions className="card-actions">
            <Box>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  sx={{ color: 'white' }}
                  onClick={() => setExpandedId(expandedId === nft.id ? null : nft.id)}
                >
                  <Launch />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add to Favorites">
                <IconButton size="small" sx={{ color: 'white' }}>
                  <Favorite />
                </IconButton>
              </Tooltip>

                <Tooltip title="Transfer">
                  <IconButton size="small" sx={{ color: 'white' }}>
                    <SwapHoriz />
                  </IconButton>
                </Tooltip>

            </Box>
            <Tooltip title="More Options">
              <IconButton size="small" sx={{ color: 'white' }}>
                <MoreVert />
              </IconButton>
            </Tooltip>
          </CardActions>
          <Collapse in={expandedId === nft.id}>
            <Paper sx={{ m: 2, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Features
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
                {Object.entries(nft.features).map(([key, value]) => (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
              {(nft.rootCategory || nft.mainCategory || nft.condition) && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Additional Details
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    {nft.rootCategory && (
                      <Typography variant="body2">
                        Root Category: {nft.rootCategory}
                      </Typography>
                    )}
                    {nft.mainCategory && (
                      <Typography variant="body2">
                        Main Category: {nft.mainCategory}
                      </Typography>)}
                    {nft.condition && (
                      <Typography variant="body2">
                        Condition: {nft.condition}
                      </Typography>
                    )}
                  </Stack>
                </>
              )}
            </Paper>
          </Collapse>
        </StyledCard>
      </Grid>
    </Fade>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="600">
        My NFT Collection
      </Typography>
      
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <TabList onChange={(_, value) => setActiveTab(value)}>
            <Tab label="NFTs" value="1" />
            <Tab label="CNFTs" value="2" />
          </TabList>
        </Box>
        
        <TabPanel value="1">
          <Grid container spacing={3}>
            {nftAssets
              .filter(nft => nft.nftType === null)
              .map(nft => renderNFTCard(nft))}
          </Grid>
        </TabPanel>
        
        <TabPanel value="2">
          <Grid container spacing={3}>
            {nftAssets
              .filter(nft => nft.nftType === 'CNFT')
              .map(nft => renderNFTCard(nft))}
          </Grid>
        </TabPanel>
        
      </TabContext>
    </Container>
  );
};

export default NFTCollection;