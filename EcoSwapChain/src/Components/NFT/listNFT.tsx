/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { 
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  Rating,
  IconButton,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingCart, Favorite } from '@mui/icons-material';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  tags: string[];
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

// Styled Components
const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
    '& .product-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const ProductActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(1),
  opacity: 0,
  transform: 'translateY(-10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const TagsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  marginTop: theme.spacing(1),
}));

const StockChip = styled(Chip)<{ stockstatus: string }>(({ theme, stockstatus }) => ({
  backgroundColor: 
    stockstatus === 'In Stock' 
      ? theme.palette.accent.main 
      : stockstatus === 'Low Stock'
      ? theme.palette.secondary.light
      : theme.palette.primary.light,
  color: theme.palette.surface.contrastText,
  fontWeight: 600,
}));

// Component
const ProductGrid: React.FC = () => {
  // Sample data - replace with your actual data
  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Product',
      description: 'High-quality product with premium features and elegant design.',
      price: 299.99,
      rating: 4.5,
      image: '/api/placeholder/400/320',
      tags: ['Premium', 'New Arrival'],
      stockStatus: 'In Stock',
    },
    // Add more products as needed
  ];

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Fade in timeout={800}>
            <ProductCard>
              <ProductActions className="product-actions">
                <StyledIconButton size="small">
                  <Favorite />
                </StyledIconButton>
                <StyledIconButton size="small">
                  <ShoppingCart />
                </StyledIconButton>
              </ProductActions>
              
              <StyledCardMedia
                image={product.image}
                title={product.name}
              />
              
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {product.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, height: 48, overflow: 'hidden' }}
                >
                  {product.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating 
                    value={product.rating} 
                    precision={0.5} 
                    readOnly 
                    size="small"
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ ml: 1 }}
                  >
                    ({product.rating})
                  </Typography>
                </Box>
                
                <Typography 
                  variant="h6" 
                  color="primary" 
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
                
                <TagsContainer>
                  {product.tags.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'background.default',
                        fontWeight: 500,
                      }} 
                    />
                  ))}
                  <StockChip 
                    label={product.stockStatus}
                    size="small"
                    stockstatus={product.stockStatus}
                  />
                </TagsContainer>
              </CardContent>
            </ProductCard>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;