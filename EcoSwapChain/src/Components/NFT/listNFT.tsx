import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  IconButton,
  Button,
  Fade,
  Stack,
  Chip,
  Tooltip,
  Container,
  InputBase,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
  Divider,
  FormControlLabel,
  RadioGroup,
  Radio,
  Zoom,
  Breadcrumbs,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Favorite,
  ShoppingCart,
  ArrowForward,
  Sell,
  Category,
  Search,
  FilterAlt,
  Sort,
  NavigateNext,
  Home,
  AccessTime,
  AttachMoney,
  Refresh
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicAPI } from '../API/api';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rootCategory: string;
  mainCategory: string;
  symbol: string;
  condition?: string;
  createdAt?: string;
}

interface Category {
  id: number,
  name: string
}

// Styled Components
const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.16)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.08)',
    },
    '& .product-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 260,
  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundPosition: 'center center',
}));

const ProductActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  display: 'flex',
  gap: theme.spacing(1),
  opacity: 0,
  transform: 'translateY(-10px)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.75rem',
  height: 24,
  marginRight: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
}));

const ConditionChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  left: 8,
  zIndex: 1,
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
}));

const ViewButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: theme.spacing(1, 3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
  },
}));

const PriceTag = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  position: 'absolute',
  bottom: 200,
  right: 16,
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  zIndex: 2,
}));

const FilterBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const SearchBox = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  '&:focus-within': {
    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: theme.palette.primary.main,
  }
}));


const FilterButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(2),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 40,
    height: 3,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 3,
  },
}));

// Component
const ProductGrid: React.FC = () => {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();

  // Filter and Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRootCategory, setSelectedRootCategory] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Path segments for breadcrumbs
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  // Extract unique categories

  const [rootCategories, setRootCategories] = useState<Category[]>([]);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);

 const fetchProducts = async () => {
  
      try {
          const response = await PublicAPI.get('/nfts/list/all/');
          setProducts(response.data.nfts);
      } catch (error) {
          console.log(error)
      }
 };
  
  
    async function getCat() {
      try {
        const response = await PublicAPI.get('product/cat/get/all');
        setRootCategories(response.data.root)
        setMainCategories(response.data.main)
        console.log(response.data)
      } catch (error) {
        console.log(error)
  
      }
    }

  useEffect(() => {
    fetchProducts()
    getCat()
  }, []);

  // Filter and sort products
  useEffect(() => {
    setIsLoading(true);

    // Apply filters and search
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRootCategory) {
      filtered = filtered.filter(product => product.rootCategory === selectedRootCategory);
    }

    if (selectedMainCategory) {
      filtered = filtered.filter(product => product.mainCategory === selectedMainCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'nameAZ':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameZA':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    // Simulate loading for better UX
    setTimeout(() => {
      setFilteredProducts(filtered);
      setIsLoading(false);
    }, 400);

  }, [products, searchQuery, selectedRootCategory, selectedMainCategory, sortBy]);

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Handle filter apply
  const handleApplyFilter = () => {
    // This function can be extended with additional functionality
    // Currently, filtering is handled by the useEffect
  };

  // Reset filters
  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedRootCategory('');
    setSelectedMainCategory('');
    setSortBy('newest');
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
    

      {/* Filter Box */}
      <FilterBox elevation={3}>
        <Grid container spacing={3}>
          {/* Search */}
          <Grid item xs={12}>
            <SectionTitle variant="h6">Find Products</SectionTitle>
            <SearchBox>
              <InputBase
                sx={{ ml: 2, flex: 1 }}
                placeholder="Search products by name, description, or symbol..."
                inputProps={{ 'aria-label': 'search products' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton sx={{ p: '10px', color: theme.palette.primary.main }} aria-label="search">
                <Search />
              </IconButton>
            </SearchBox>
          </Grid>

          {/* Filters */}
          <Grid item xs={12} md={6}>
            <SectionTitle variant="h6">Filter Options</SectionTitle>
            <Stack spacing={2}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="root-category-label">Root Category</InputLabel>
                <Select
                  labelId="root-category-label"
                  id="root-category"
                  value={selectedRootCategory}
                  onChange={(e) => setSelectedRootCategory(e.target.value)}
                  label="Root Category"
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {rootCategories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="main-category-label">Main Category</InputLabel>
                <Select
                  labelId="main-category-label"
                  id="main-category"
                  value={selectedMainCategory}
                  onChange={(e) => setSelectedMainCategory(e.target.value)}
                  label="Main Category"
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {mainCategories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          {/* Sorting */}
          <Grid item xs={12} md={6}>
            <SectionTitle variant="h6">Sort Options</SectionTitle>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="sort-options"
                name="sort-options"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <FormControlLabel
                      value="newest"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">Newest First</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      value="oldest"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">Oldest First</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      value="priceHigh"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoney fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">Price: High to Low</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      value="priceLow"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoney fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">Price: Low to High</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      value="nameAZ"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Sort fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">Name: A to Z</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      value="nameZA"
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Sort fontSize="small" sx={{ mr: 1, transform: 'scaleY(-1)' }} />
                          <Typography variant="body2">Name: Z to A</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <FilterButton
                variant="outlined"
                color="secondary"
                startIcon={<Refresh />}
                onClick={handleResetFilter}
              >
                Reset Filters
              </FilterButton>
              <FilterButton
                variant="contained"
                color="primary"
                startIcon={<FilterAlt />}
                onClick={handleApplyFilter}
              >
                Apply Filters
              </FilterButton>
            </Stack>
          </Grid>
        </Grid>
      </FilterBox>

      {/* Products Grid */}
      <Box>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <AnimatePresence>
          {!isLoading && (
            <Fade in={!isLoading} timeout={800}>
              <Grid container spacing={4}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Zoom in style={{ transitionDelay: `${index * 50}ms` }}>
                          <ProductCard>
                            {/* Condition Badge */}
                            {product.condition && (
                              <ConditionChip
                                label={product.condition}
                                color="success"
                              />
                            )}

                            {/* Product Actions */}
                            <ProductActions className="product-actions">
                              <Tooltip title="Add to favorites">
                                <StyledIconButton size="small">
                                  <Favorite />
                                </StyledIconButton>
                              </Tooltip>
                              <Tooltip title="Add to cart">
                                <StyledIconButton size="small">
                                  <ShoppingCart />
                                </StyledIconButton>
                              </Tooltip>
                            </ProductActions>

                            {/* Price Tag */}
                            <PriceTag>
                              <Sell fontSize="small" />
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {product.price} $
                              </Typography>
                            </PriceTag>

                            {/* Product Image */}
                            <StyledCardMedia
                              image={`http://localhost:8000${product.image}`}
                              title={product.name}
                            />

                            <CardContent sx={{ px: 3, pt: 3, pb: 3 }}>
                              {/* Name */}
                              <Typography
                                variant="h6"
                                component="h2"
                                gutterBottom
                                sx={{
                                  fontWeight: 700,
                                  mb: 1.5,
                                  lineHeight: 1.3
                                }}
                              >
                                {product.name} ({product.symbol})
                              </Typography>

                              {/* Categories */}
                              <Stack direction="row" spacing={1} sx={{ mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
                                <CategoryChip
                                  size="small"
                                  label={product.rootCategory}
                                  icon={<Category fontSize="small" />}
                                />
                                <CategoryChip
                                  size="small"
                                  label={product.mainCategory}
                                />
                              </Stack>

                              {/* Description */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mb: 3,
                                  minHeight: 60,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {truncateText(product.description, 120)}
                              </Typography>

                              {/* View Details Button */}
                              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ViewButton
                                  component={Link}
                                  to={`/nft/retrieve/${product.id}`}
                                  variant="contained"
                                  color="primary"
                                  endIcon={<ArrowForward />}
                                  fullWidth
                                >
                                  View Details
                                </ViewButton>
                              </Box>
                            </CardContent>
                          </ProductCard>
                        </Zoom>
                      </motion.div>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: theme.shape.borderRadius * 2,
                        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Typography variant="h6" gutterBottom>No products found</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Try adjusting your search or filter criteria
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleResetFilter}
                        startIcon={<Refresh />}
                      >
                        Reset Filters
                      </Button>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Fade>
          )}
        </AnimatePresence>
      </Box>
    </Container>
  );
};

export default ProductGrid;