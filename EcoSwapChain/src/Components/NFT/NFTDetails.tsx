import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Button,
  Stack,
  IconButton,
  Divider,
  Tab,
  Paper,
  Fade,
  Zoom,
  CircularProgress,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  LinearProgress,
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
  CheckCircle,
  RecyclingOutlined,
  Co2,
  BatteryChargingFull,
  Construction,
  Build,
  PetsOutlined,
  NoDrinks,
  ForestOutlined,
  DeleteOutline,
  Warning,
  Info,
  Description,
  Link,
  CalendarMonth,
  Person,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router';
import { PublicAPI } from '../API/api';
import { motion } from 'framer-motion';
import RouteDisplayC from '../RouteDisplay';
import { useAppSelector } from '../../store';

// Types
interface ProductImage {
  id: number | string;
  url: string;
  alt: string;
}

interface Certification {
  name: string;
  description: string;
  certificationNumber: string;
}

interface Product {
  id: number;
  rootCategory: string;
  mainCategory: string;
  condition: string;
  materials: string[];
  certifications: Certification[];
  features: Record<string, string>;
  additionalMaterials: string[] | null;
  recycledContent: number;
  recyclability: boolean;
  carbonFootprint: number;
  energyEfficiency: number;
  durability: number;
  repairabilityScore: number;
  ethicalSourcing: boolean;
  crueltyFree: boolean;
  plasticFree: boolean;
  natural: boolean;
  destructible: boolean;
  hazardous: boolean;
  additionalImages: ProductImage[];
}

interface NFTDetails {
  id: number;
  name: string;
  description: string;
  price: string;
  mainImage: ProductImage;
  address: string;
  uri: string;
  createdAt: string;
  leafIndex: number;
  treeAddress: string;
  ownerPublicKey: string;
  nftType: string;
  exchange: boolean;
  status: boolean;
  traderid: number;
  product: Product;
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


const ScoreIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const AnimatedBox = styled(Box)(() => ({
  transition: 'all 0.5s ease',
}));

const NFTInfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [nftData, setNFTData] = useState<NFTDetails>({
    id: 0,
    name: "",
    description: "",
    price: "0",
    mainImage: {
      id: 0,
      url: "",
      alt: "NFT Image",
    },
    address: "",
    uri: "",
    createdAt: "",
    leafIndex: 0,
    treeAddress: "",
    ownerPublicKey: "",
    nftType: "",
    exchange: false,
    status: false,
    traderid: 0,
    product: {
      id: 0,
      rootCategory: "",
      mainCategory: "",
      condition: "",
      materials: [],
      certifications: [],
      features: {},
      additionalMaterials: null,
      recycledContent: 0,
      recyclability: false,
      carbonFootprint: 0,
      energyEfficiency: 0,
      durability: 0,
      repairabilityScore: 0,
      ethicalSourcing: false,
      crueltyFree: false,
      plasticFree: false,
      natural: false,
      destructible: false,
      hazardous: false,
      additionalImages: [],
    },
  });

  const [selectedImage, setSelectedImage] = useState<ProductImage>({
    id: 0,
    url: "",
    alt: "NFT Image",
  });

  const userData = useAppSelector((state) => state.user)

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('1');
  const [expandedCertification, setExpandedCertification] = useState<number | null>(null);

  // Function to get all images (main image + additional images)
  const getAllImages = (data: NFTDetails) => {
    const images = [data.mainImage];
    if (data.product.additionalImages && data.product.additionalImages.length > 0) {
      images.push(...data.product.additionalImages);
    }
    return images;
  };

  async function fetchNFTDetails() {
    setLoading(true);
    try {
      // For demonstration, using the example data
      // In a real implementation, uncomment the API call below

      const response = await PublicAPI.get(`nfts/retrieve/${id}/`);
      console.log(response.data);
      setNFTData(response.data.nft);
      setSelectedImage(response.data.nft.mainImage);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNFTDetails();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Truncate blockchain address
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 20)}...${address.substring(address.length - 4)}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Box textAlign="center">
          <CircularProgress size={60} color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading product details...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      <RouteDisplayC />
      <Fade in timeout={600}>
        <Grid container spacing={4}>
          {/* Left Column - Images */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <AnimatedBox  >
                <MainImage elevation={3}>
                  <img src={`http://localhost:8000${selectedImage.url}`} alt={selectedImage.alt} />
                </MainImage>
                <Stack direction="row" spacing={2} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
                  {getAllImages(nftData).map((image, index) => (
                    <Zoom in key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                      <ThumbnailImage
                        elevation={selectedImage.id === image.id ? 3 : 1}
                        onClick={() => setSelectedImage(image)}
                        sx={{
                          border: (theme) =>
                            selectedImage.url === image.url
                              ? `2px solid ${theme.palette.primary.main}`
                              : 'none',
                        }}
                      >
                        <img src={`http://localhost:8000${image.url}`} alt={image.alt} />
                      </ThumbnailImage>
                    </Zoom>
                  ))}
                </Stack>
              </AnimatedBox>
            </motion.div>

            {/* NFT Information */}
            <Fade in timeout={1200}>
              <NFTInfoCard elevation={2} sx={{ mt: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  NFT Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List dense>
                  <ListItem>
                    <ListItemIcon><Link color="primary" /></ListItemIcon>
                    <ListItemText
                      primary="NFT Address"
                      secondary={
                        <Tooltip title={nftData.address}>
                          <Typography variant="body2">{truncateAddress(nftData.address)}</Typography>
                        </Tooltip>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Description color="primary" /></ListItemIcon>
                    <ListItemText
                      primary="NFT Type"
                      secondary={nftData.nftType}
                    />
                  </ListItem>

                  {/* Conditionally render Tree Address and Leaf Index only if it's a CNFT */}
                  {nftData.nftType === "CNFT" && (
                    <>
                      <ListItem>
                        <ListItemIcon><Info color="primary" /></ListItemIcon>
                        <ListItemText
                          primary="Leaf Index"
                          secondary={nftData.leafIndex}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Link color="primary" /></ListItemIcon>
                        <ListItemText
                          primary="Tree Address"
                          secondary={
                            <Tooltip title={nftData.treeAddress}>
                              <Typography variant="body2">{truncateAddress(nftData.treeAddress)}</Typography>
                            </Tooltip>
                          }
                        />
                      </ListItem>
                    </>
                  )}

                  <ListItem>
                    <ListItemIcon><Person color="primary" /></ListItemIcon>
                    <ListItemText
                      primary="Owner"
                      secondary={
                        <Tooltip title={nftData.ownerPublicKey}>
                          <Typography variant="body2">{truncateAddress(nftData.ownerPublicKey)}</Typography>
                        </Tooltip>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CalendarMonth color="primary" /></ListItemIcon>
                    <ListItemText
                      primary="Created At"
                      secondary={formatDate(nftData.createdAt)}
                    />
                  </ListItem>
                </List>

              </NFTInfoCard>
            </Fade>
          </Grid>

          {/* Right Column - Details */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={800}>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="600" component={motion.h4} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
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
                  <Chip
                    label={nftData.product.condition}
                    color="secondary"
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                </Stack>

                {/* Price and Status */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    color="primary"
                    fontWeight="700"
                    component={motion.h5}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    ${Number(nftData.price).toFixed(2)}
                  </Typography>
                  <Chip
                    label={nftData.exchange ? "Available for Exchange" : "Not Available"}
                    color={nftData.exchange ? "success" : "error"}
                    variant="outlined"
                    icon={nftData.exchange ? <CheckCircle /> : <Warning />}
                  />
                </Stack>

                <Typography variant="body1" sx={{ mb: 3 }}>
                  {nftData.description}
                </Typography>

                {/* Materials Section */}
                <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
                  <Box>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Materials Used
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {nftData.product.materials.map((material, index) => (
                      <Chip
                        key={index}
                        label={material}
                        size="small"
                        variant="outlined"
                        color="default"
                        sx={{ mt: 1 }}
                      />
                    ))}
                    </Stack>
                  </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Additional Materials
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {nftData.product.additionalMaterials?.map((material, index) => (
                          <Chip
                            key={index}
                            label={material}
                            size="small"
                            variant="outlined"
                            color="default"
                            sx={{ mt: 1 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                </Box>

                {/* Add to Cart Section */}
                <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 4 }}>
                  {/* <Stack direction="row" alignItems="center">
                    <IconButton
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      size="small"
                      color="primary"
                    >
                      <Remove />
                    </IconButton>
                    <Typography sx={{ px: 2, fontWeight: "600" }}>{quantity}</Typography>
                    <IconButton
                      onClick={() => setQuantity(quantity + 1)}
                      size="small"
                      color="primary"
                    >
                      <Add />
                    </IconButton>
                  </Stack> */}
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      flex: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Cart
                  </Button>
                  {/* <IconButton color="primary" sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}>
                    <Favorite />
                  </IconButton>
                  <IconButton color="primary" sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}>
                    <Share />
                  </IconButton> */}
                </Stack>

                <Divider sx={{ my: 3 }} />

                <TabContext value={activeTab}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                      onChange={(_, value: string) => setActiveTab(value)}
                      textColor="primary"
                      indicatorColor="primary"
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="Features" value="1" />
                      <Tab label="Sustainability" value="2" />
                      <Tab label="Certifications" value="3" />
                      <Tab label="Shipping" value="4" />
                    </TabList>
                  </Box>

                  {/* Features Tab */}
                  <TabPanel value="1">
                    <Fade in timeout={500}>
                      <Stack spacing={2}>
                        {Object.entries(nftData.product.features).map(([key, value], index) => (
                          <Box key={index} component={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              {key}
                            </Typography>
                            <Typography variant="body1">{value}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Fade>
                  </TabPanel>

                  {/* Sustainability Tab */}
                  <TabPanel value="2">
                    <Fade in timeout={500}>
                      <Stack spacing={3}>
                        <ScoreIndicator>
                          <RecyclingOutlined color="primary" />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">Recycled Content</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={nftData.product.recycledContent}
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="bold">{nftData.product.recycledContent}%</Typography>
                        </ScoreIndicator>

                        <ScoreIndicator>
                          <Co2 color="primary" />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">Carbon Footprint (Lower is better)</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={Math.max(0, 100 - nftData.product.carbonFootprint * 20)}
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="bold">{nftData.product.carbonFootprint}/5</Typography>
                        </ScoreIndicator>

                        <ScoreIndicator>
                          <BatteryChargingFull color="primary" />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">Energy Efficiency</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={nftData.product.energyEfficiency * 20}
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="bold">{nftData.product.energyEfficiency}/5</Typography>
                        </ScoreIndicator>

                        <ScoreIndicator>
                          <Construction color="primary" />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">Durability</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={nftData.product.durability * 20}
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="bold">{nftData.product.durability}/5</Typography>
                        </ScoreIndicator>

                        <ScoreIndicator>
                          <Build color="primary" />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">Repairability Score</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={nftData.product.repairabilityScore * 20}
                              sx={{ height: 10, borderRadius: 5 }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="bold">{nftData.product.repairabilityScore}/5</Typography>
                        </ScoreIndicator>

                        <Divider sx={{ my: 1 }} />

                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={4}>
                            <Chip
                              icon={<NoDrinks color={nftData.product.ethicalSourcing ? "success" : "disabled"} />}
                              label="Ethical Sourcing"
                              color={nftData.product.ethicalSourcing ? "success" : "default"}
                              variant={nftData.product.ethicalSourcing ? "filled" : "outlined"}
                              sx={{ width: '100%' }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip
                              icon={<PetsOutlined color={nftData.product.crueltyFree ? "success" : "disabled"} />}
                              label="Cruelty Free"
                              color={nftData.product.crueltyFree ? "success" : "default"}
                              variant={nftData.product.crueltyFree ? "filled" : "outlined"}
                              sx={{ width: '100%' }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip
                              icon={<NoDrinks color={nftData.product.plasticFree ? "success" : "disabled"} />}
                              label="Plastic Free"
                              color={nftData.product.plasticFree ? "success" : "default"}
                              variant={nftData.product.plasticFree ? "filled" : "outlined"}
                              sx={{ width: '100%' }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip
                              icon={<ForestOutlined color={nftData.product.natural ? "success" : "disabled"} />}
                              label="Natural"
                              color={nftData.product.natural ? "success" : "default"}
                              variant={nftData.product.natural ? "filled" : "outlined"}
                              sx={{ width: '100%' }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip
                              icon={<DeleteOutline color={nftData.product.destructible ? "success" : "disabled"} />}
                              label="Biodegradable"
                              color={nftData.product.destructible ? "success" : "default"}
                              variant={nftData.product.destructible ? "filled" : "outlined"}
                              sx={{ width: '100%' }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip
                              icon={<Warning color={nftData.product.hazardous ? "error" : "success"} />}
                              label="Hazardous"
                              color={nftData.product.hazardous ? "error" : "success"}
                              variant={nftData.product.hazardous ? "filled" : "outlined"}
                              sx={{ width: '100%' }}
                            />
                          </Grid>
                        </Grid>
                      </Stack>
                    </Fade>
                  </TabPanel>

                  {/* Certifications Tab */}
                  <TabPanel value="3">
                    <Fade in timeout={500}>
                      <Stack spacing={2}>
                        {nftData.product.certifications.map((cert, index) => (
                          <Paper
                            key={index}
                            elevation={1}
                            sx={{ p: 2, cursor: 'pointer' }}
                            onClick={() => setExpandedCertification(expandedCertification === index ? null : index)}
                            component={motion.div}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle1" fontWeight="600">{cert.name}</Typography>
                              <Chip label={`#${cert.certificationNumber}`} size="small" />
                            </Stack>
                            <Collapse in={expandedCertification === index}>
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {cert.description}
                                </Typography>
                              </Box>
                            </Collapse>
                          </Paper>
                        ))}
                      </Stack>
                    </Fade>
                  </TabPanel>

                  {/* Shipping Tab */}
                  <TabPanel value="4">
                    <Fade in timeout={500}>
                      <Stack spacing={3}>
                        <motion.div initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <FeatureCard
                            elevation={1}
                          >
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <LocalShipping />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">Free Shipping</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Free shipping on all orders over $50
                              </Typography>
                            </Box>
                          </FeatureCard>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}>
                          <FeatureCard elevation={1}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <Cached />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">30-Day Returns</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Easy returns within 30 days of purchase
                              </Typography>
                            </Box>
                          </FeatureCard>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}>
                          <FeatureCard
                            elevation={1}
                          >
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <Shield />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">Secure Transactions</Typography>
                              <Typography variant="body2" color="text.secondary">
                                All payments and NFT transfers are securely processed
                              </Typography>
                            </Box>
                          </FeatureCard>
                        </motion.div>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                            Estimated Delivery
                          </Typography>
                          <Typography variant="body2">
                            3-5 business days for physical items. Digital NFT transfer is immediate upon payment.
                          </Typography>
                        </Box>
                      </Stack>
                    </Fade>
                  </TabPanel>
                </TabContext>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Fade>
    </Container>
  );
};

export default ProductDetailPage;