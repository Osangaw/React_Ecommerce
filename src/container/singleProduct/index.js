import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, Paper, Divider, CircularProgress, Chip } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import Layout from "../../components/layout";
import { addToCart } from "../../actions/cart.Action";
import { getProductDetails } from "../../actions/product.Action";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const product = useSelector((state) => state.product.productDetails);
  const loading = useSelector((state) => state.product.loading);
  const auth = useSelector((state) => state.auth); // ✅ Get Auth State

  // Check if Admin
  const isAdmin = auth.user?.role === 'admin';

  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (productId) {
      dispatch(getProductDetails(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
        if (product.images && product.images.length > 0) {
            setActiveImage(product.images[0].img);
        } else if (product.image) {
            setActiveImage(product.image);
        }
    }
  }, [product]);

  if (loading) {
    return (
      <Layout>
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress color="inherit" />
         </Box>
      </Layout>
    );
  }

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
    // Double check to prevent admins from forcing it
    if (isAdmin) return; 

    const item = { 
        _id: product._id, 
        name: product.name, 
        price: product.price, 
        image: activeImage
    };
    dispatch(addToCart(item));
    navigate('/cart');
  };

  return (
    <Layout>
      <Box sx={{ p: 1, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: "center" }}>
        
        <Paper elevation={3} sx={{ p: 2, borderRadius: 4, width: '100%', maxWidth: '1000px' }}>
            
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/')}
                sx={{ mb: 2, color: '#333' }}
            >
                Back to Products
            </Button>

            <Grid container spacing={6}>
                
                {/* LEFT: Images */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ 
                        height: '400px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        border: '1px solid #f0f0f0', 
                        borderRadius: 2,
                        bgcolor: '#fafafa',
                        overflow: 'hidden',
                        mb: 2
                    }}>
                        <img
                            src={activeImage || "https://via.placeholder.com/400"}
                            alt={product.name}
                            style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
                        />
                    </Box>

                    {product.images && product.images.length > 1 && (
                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1 }}>
                            {product.images.map((imgObj, index) => (
                                <Box
                                    key={index}
                                    onClick={() => setActiveImage(imgObj.img)}
                                    sx={{
                                        width: 70,
                                        height: 70,
                                        border: activeImage === imgObj.img ? '2px solid #6A1B1A' : '1px solid #ddd',
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        opacity: activeImage === imgObj.img ? 1 : 0.6,
                                    }}
                                >
                                    <img src={imgObj.img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Grid>

                {/* RIGHT: Details */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {product.name}
                    </Typography>
                    
                    <Typography variant="h4" color="green" sx={{ fontWeight: 'bold', mb: 3 }}>
                        ₦{product.price.toLocaleString()}
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
                        {product.description || "No description available."}
                    </Typography>

                    {/* ✅ CONDITIONAL BUTTON RENDERING */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                        {!isAdmin ? (
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
                                }}
                            >
                                Add to Cart
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                disabled
                                startIcon={<BlockIcon />}
                                sx={{
                                    fontWeight: 'bold',
                                    py: 1.5,
                                    borderColor: '#999',
                                    color: '#999 !important'
                                }}
                            >
                                Admin View Only
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ProductDetails;