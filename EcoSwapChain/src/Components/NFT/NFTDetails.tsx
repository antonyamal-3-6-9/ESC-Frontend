import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Rating,
  Chip,
  Button,
  Stack,
  IconButton,
  Divider,
  Tab,
  Paper,
  Fade,
  Zoom,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Add,
  Remove,
  Favorite,
  Share,
  LocalShipping,
  Cached,
  Shield,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router';
import { PublicAPI } from '../API/api';

// Types
interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface Certification{
  name: string;
  description: string;
  registerNumber: string;
}

interface Product{
  rootCategory: string | null; 
  mainCategory: string | null; 
  condition: string | null;
  materials: string[];
  certifications: Certification;
  features: Record<string, string>
  additionalMaterials: string[] | null; 
  recycledContent: number | null; // Flattened from product.recycled_content
  recyclability: boolean;
  carbonFootprint: number | null; // Flattened from product.carbon_footprint
  energyEfficiency: number | null; // Flattened from product.energy_efficiency
  durability: number | null; // Flattened from product.durability
  repairabilityScore: number | null; // Flattened from product.repairability_score
  ethicalSourcing: boolean;
  crueltyFree: boolean;
  plasticFree: boolean;
  natural: boolean;
  destructible: boolean;
  hazardous: boolean;
  additionalImages: ProductImage[]; 
}


interface Details {
  id: string;
  name: string;
  symbol: string
  description: string;
  price: number;
  image: string;
  address: string;
  uri: string;
  createdAt: string;
  leafIndex: number | null; // Flattened from nft.leaf_index
  treeAddress: string | null; // Flattened from nft.tree_address
  ownerPublicKey: string;
  nftType: string;
  exchange: boolean;
  product: Product;
}

interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  sku: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  features: string[];
  specifications: Record<string, string>;
  images: ProductImage[];
  tags: string[];
}

// Styled Components
const MainImage = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: 500,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
  marginBottom: theme.spacing(2),
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

const ThumbnailImage = styled(Paper)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
}));

const ProductDetailPage: React.FC = () => {
  // Sample data - replace with your actual data
  const { id } = useParams()
  console.log(useParams())
  
  const [nftData, setNFTData] = useState<Details>({
    id: "",
    name: "",
    symbol: "",
    description: "",
    price: 0,
    image: "",
    address: "",
    uri: "",
    createdAt: "",
    leafIndex: null,
    treeAddress: null,
    ownerPublicKey: "",
    nftType: "",
    exchange: false,
    product: {
      rootCategory: null,
      mainCategory: null,
      condition: null,
      materials: [],
      certifications: {
        name: "",
        description: "",
        registerNumber: "",
      },
      features: {},
      additionalMaterials: null,
      recycledContent: null,
      recyclability: false,
      carbonFootprint: null,
      energyEfficiency: null,
      durability: null,
      repairabilityScore: null,
      ethicalSourcing: false,
      crueltyFree: false,
      plasticFree: false,
      natural: false,
      destructible: false,
      hazardous: false,
      additionalImages: [],
    },
  });


  async function fetchNFTDetails() {
    try {
      const response = await PublicAPI.get(`nfts/retrieve/${id}/`);
      console.log(response.data);
      setNFTData(response.data.nft);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchNFTDetails();
  }, [])

  const product: ProductDetails = {
    id: '1',
    name: 'Premium Product',
    description: 'High-quality premium product with exceptional features and elegant design.',
    price: 299.99,
    rating: 4.5,
    reviewCount: 128,
    sku: 'PRD001',
    stockStatus: 'In Stock',
    features: [
      'Premium Quality Materials',
      'Ergonomic Design',
      'Advanced Technology',
      'Sustainable Manufacturing'
    ],
    specifications: {
      'Material': 'Premium Grade',
      'Dimensions': '12 x 8 x 4 inches',
      'Weight': '2.5 lbs',
      'Warranty': '2 Years'
    },
    images: [
      { id: '1', url: '/api/placeholder/800/800', alt: 'Product Main' },
      { id: '2', url: '/api/placeholder/800/800', alt: 'Product Side' },
      { id: '3', url: '/api/placeholder/800/800', alt: 'Product Back' },
    ],
    tags: ['Premium', 'New Arrival', 'Best Seller']
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('1');

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8}}>
      <Grid container spacing={4}>
        {/* Left Column - Images */}
        <Grid item xs={12} md={6}>
          <Fade in timeout={800}>
            <Box>
              <MainImage elevation={2}>
                <img src={`http://localhost:8000/${nftData.image}`} alt={selectedImage.alt} />
              </MainImage>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {nftData.product.additionalImages.map((image) => (
                  <Zoom in key={image.id} style={{ transitionDelay: '200ms' }}>
                    <ThumbnailImage
                      elevation={selectedImage.id === image.id ? 3 : 1}
                      onClick={() => setSelectedImage(image)}
                      sx={{
                        border: (theme) =>
                          selectedImage.id === image.id
                            ? `2px solid ${theme.palette.primary.main}`
                            : 'none',
                      }}
                    >
                      <img src={`http://localhost:8000/${image.url}`} alt={image.alt} />
                    </ThumbnailImage>
                  </Zoom>
                ))}
              </Stack>
            </Box>
          </Fade>
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={6}>
          <Fade in timeout={1000}>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="600">
                {nftData.name}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          
                  <Chip
                    label={nftData.product.rootCategory}
                    color="primary"
                    size="small"
                    sx={{ borderRadius: 1 }}
                />
                <Chip
                  label={nftData.product.mainCategory}
                  color="primary"
                  size="small"
                  sx={{ borderRadius: 1 }}
                />
                
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Rating value={product.rating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({product.reviewCount} reviews)
                </Typography>
              </Stack>

              <Typography
                variant="h5"
                color="primary"
                fontWeight="700"
                sx={{ mb: 3 }}
              >
                ${Number(nftData.price).toFixed(2)}
              </Typography>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {nftData.description}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center">
                  <IconButton
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    size="small"
                  >
                    <Remove />
                  </IconButton>
                  <Typography sx={{ px: 2 }}>{quantity}</Typography>
                  <IconButton
                    onClick={() => setQuantity(quantity + 1)}
                    size="small"
                  >
                    <Add />
                  </IconButton>
                </Stack>
                <Button
                  variant="gradient"
                  size="large"
                  sx={{ flex: 1 }}
                >
                  Add to Cart
                </Button>
                <IconButton color="primary">
                  <Favorite />
                </IconButton>
                <IconButton color="primary">
                  <Share />
                </IconButton>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <TabContext value={activeTab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    onChange={(_, value: string) => setActiveTab(value)}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab label="Features" value="1" />
                    <Tab label="Specifications" value="2" />
                    <Tab label="Shipping" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <Stack spacing={2}>
                    {nftData.product.materials.map((feature, index) => (
                      <Typography key={index} variant="body1">
                        • {feature}
                      </Typography>
                    ))}
                  </Stack>
                </TabPanel>
                <TabPanel value="2">
                  <Stack spacing={2}>
                    {Object.entries(nftData.product.features).map(([key, value]) => (
                      <Box key={key}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {key}
                        </Typography>
                        <Typography variant="body1">{value}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </TabPanel>
                <TabPanel value="3">
                  <Stack spacing={3}>
                    <FeatureCard elevation={1}>
                      <LocalShipping color="primary" />
                      <Box>
                        <Typography variant="subtitle1">Free Shipping</Typography>
                        <Typography variant="body2" color="text.secondary">
                          On orders over $50
                        </Typography>
                      </Box>
                    </FeatureCard>
                    <FeatureCard elevation={1}>
                      <Cached color="primary" />
                      <Box>
                        <Typography variant="subtitle1">Easy Returns</Typography>
                        <Typography variant="body2" color="text.secondary">
                          30-day return policy
                        </Typography>
                      </Box>
                    </FeatureCard>
                    <FeatureCard elevation={1}>
                      <Shield color="primary" />
                      <Box>
                        <Typography variant="subtitle1">Secure Shopping</Typography>
                        <Typography variant="body2" color="text.secondary">
                          SSL Encrypted Checkout
                        </Typography>
                      </Box>
                    </FeatureCard>
                  </Stack>
                </TabPanel>
              </TabContext>
            </Box>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;