/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
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
  Grid2,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {  Favorite, ShoppingCart} from '@mui/icons-material';
import { useAppSelector } from '../../store';
import { Link } from 'react-router';
import { fetchProducts } from '../../Redux/nftActions';
import { useDispatch } from 'react-redux';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rootCategory: string; // Flattened from product.rootCategory.name
  mainCategory: string; // Flattened from product.mainCategory.name
  address: string;
  uri: string;
  symbol: string;
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
      transform: 'translateY(7)',
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

// Component
const ProductGrid: React.FC = () => {

  const products = useAppSelector((state) => state.nft.products);;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts() as never);
  }, []);

  return (
    <Grid container spacing={5} sx={{ p: 5, mb: 2 }}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Fade in timeout={800}>
            <ProductCard>
              {/* Product Actions */}
              <ProductActions className="product-actions">
                <StyledIconButton size="small">
                  <Favorite />
                </StyledIconButton>
                <StyledIconButton size="small">
                  <ShoppingCart />
                </StyledIconButton>
              </ProductActions>

              <Grid2 container spacing={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1}}>
                <Typography variant="body1" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {product.price} $
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {product.symbol}
                </Typography>
              </Grid2>



              {/* Product Image */}
              <StyledCardMedia
                image={`http://localhost:8000/${product.image}`}
                title={product.name}
              />

              <CardContent>


                {/* Name */}
                <Grid2 container spacing={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', mb: 2 }}>
                  <Grid2 >
                    <Typography sx={{ color: 'text.secondary', mr: 1 }}>
                      {`Name:`}
                    </Typography>
                  </Grid2>
                  <Grid2 >
                    <Link to={`/nft/retrieve/${product.id}`} style={{ textDecoration: 'none' }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                    </Link>
                  </Grid2>
                </Grid2>

                {/* Address */}
                <Grid2 container spacing={1} sx={{ display: 'flex', alignItems: 'start', flexDirection: "column", justifyContent: 'start', mb: 2 }}>
                  <Grid2 >
                    <Typography sx={{ color: 'text.secondary', mr: 1 }}>
                      {`Mint Address:`}
                    </Typography>
                  </Grid2>
                  <Grid2 >
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                      {product.address}
                    </Typography>
                  </Grid2>
                </Grid2>

                {/* Description */}
                <Grid2 container spacing={1} sx={{ display: 'flex', alignItems: 'start', flexDirection: "column", justifyContent: 'start', mb: 2 }}>
                  <Grid2 >
                    <Typography sx={{ color: 'text.secondary', mr: 1 }}>
                      {`Description:`}
                    </Typography>
                  </Grid2>
                  <Grid2 >
                    <Typography variant="body2" gutterBottom sx={{ fontWeight: 400 }}>
                      {product.description}
                    </Typography>
                  </Grid2>
                </Grid2>

                {/* URI */}
                <Grid2 container spacing={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', mb: 2 }}>
                  <Grid2 >
                    <Typography sx={{ color: 'text.secondary', mr: 1 }}>
                      {`URI:`}
                    </Typography>
                  </Grid2>
                  <Grid2 >
                    <Typography variant="body2" gutterBottom sx={{ fontWeight: 400 }}>
                      <a href={product.uri} target="_blank" rel="noopener noreferrer">
                        {product.uri}
                      </a>
                    </Typography>
                  </Grid2>
                </Grid2>

                <Grid2 container spacing={1} sx={{ display: 'flex', alignItems: 'start', justifyContent: 'start', mb: 2 }}>
                  <Grid2 >
                    <Typography variant="body2" gutterBottom sx={{ fontWeight: 400 }}>
                      {product.rootCategory}
                    </Typography>
                  </Grid2>
                  <Grid2 >
                    <Typography variant="body2" gutterBottom sx={{ fontWeight: 400 }}>
                      {product.mainCategory}
                    </Typography>
                  </Grid2>
                </Grid2>
                

               
              </CardContent>
            </ProductCard>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;