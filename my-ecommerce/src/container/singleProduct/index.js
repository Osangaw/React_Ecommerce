import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, Paper, Divider, CircularProgress } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Layout from "../../components/layout";
import { addToCart } from "../../actions/cart.Action";
import { getProductDetails } from "../../actions/product.Action";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Select from 'productDetails' in Redux, not the general list
  const product = useSelector((state) => state.product.productDetails);
  const loading = useSelector((state) => state.product.loading);

  // ✅ Fetch data from DB when the component mounts
  useEffect(() => {
    if (productId) {
      dispatch(getProductDetails(productId));
    }
  }, [dispatch, productId]);

  // Loading State
  if (loading) {
    return (
      <Layout>
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress color="inherit" />
         </Box>
      </Layout>
    );
  }

  // Error/Empty State
  if (!product || !product._id) {
    return (
      <Layout>
        <Box sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h5">Product not found</Typography>
          <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Go Back Home</Button>
        </Box>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    const item = { 
        _id: product._id, 
        name: product.name, 
        price: product.price, 
        // Handle image safely
        image: product.productPictures && product.productPictures.length > 0 
          ? product.productPictures[0].img 
          : product.image 
    };
    dispatch(addToCart(item));
    navigate('/cart');
  };

  // Helper to get the main image safely
  const displayImage = product.productPictures && product.productPictures.length > 0 
      ? product.productPictures[0].img 
      : (product.image || "https://via.placeholder.com/400");

  return (
    <Layout>
      <Box sx={{ p: 4, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: "center" }}>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, width: '100%', maxWidth: '1000px' }}>
            
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/')}
                sx={{ mb: 2, color: '#333' }}
            >
                Back to Products
            </Button>

            <Grid container spacing={6}>
                {/* LEFT: Product Image */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ 
                        height: '400px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        border: '1px solid #f0f0f0', 
                        borderRadius: 2,
                        bgcolor: '#fafafa',
                        overflow: 'hidden'
                    }}>
                    <img
                        src={displayImage}
                        alt={product.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                    </Box>
                </Grid>

                {/* RIGHT: Product Details */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'sans-serif' }}>
                        {product.name}
                    </Typography>
                    
                    <Typography variant="h4" color="green" sx={{ fontWeight: 'bold', mb: 3 }}>
                        ₦{product.price}
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
                        {product.description || "No description available."}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleAddToCart}
                            sx={{
                                bgcolor: '#6A1B1A',
                                '&:hover': { bgcolor: '#8B2323' },
                                fontWeight: 'bold',
                                py: 1.5,
                                fontSize: '1.1rem'
                            }}
                        >
                            Add to Cart
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ProductDetails;