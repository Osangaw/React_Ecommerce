import { Box, Card, Typography, Button, Container } from "@mui/material"; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllProducts, deleteProduct } from "../../actions/product.Action";
import Layout from "../../components/layout";
import { productConstants } from "../../actions/constants";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Homepage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.product);
  const auth = useSelector((state) => state.auth); 
  
  const allProducts = productState?.products || [];
  const searchResults = productState?.searchResults || [];
  const loading = productState?.loading || false;
  
  const isAdmin = auth.user?.role === 'admin';
  const isSearching = searchResults.length > 0;
  const productsToDisplay = isSearching ? searchResults : allProducts;

  useEffect(() => {
    if (allProducts.length === 0) {
        dispatch(getAllProducts());
    }
  }, [dispatch, allProducts.length]);

  const clearSearch = () => {
    dispatch({ 
        type: productConstants.SEARCH_PRODUCT_SUCCESS, 
        payload: { products: [] } 
    });
    if (allProducts.length === 0) dispatch(getAllProducts());
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
        dispatch(deleteProduct(id));
    }
  };

  return (
    <Layout> 
      <Container maxWidth="xl" sx={{ p: { xs: 1, sm: 2, md: 3 }, minHeight: "80vh" }}>
  
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
             <Typography sx={{ fontFamily: "cursive", fontSize: "20px", color: '#666' }}>
                Loading products...
             </Typography>
          </Box>
        )}

        {isSearching && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<ArrowBackIcon />}
                    onClick={clearSearch}
                    sx={{ fontFamily: "cursive", fontWeight: "bold" }}
                >
                    Back to All Products
                </Button>
            </Box>
        )}

        {productsToDisplay && productsToDisplay.length > 0 ? (
          <Box sx={{ 
            display: "grid",
            // ✅ FORCE COLUMNS: 2 Mobile, 3 Tablet, 5 Desktop
            gridTemplateColumns: {
                xs: "repeat(2, 1fr)", 
                sm: "repeat(3, 1fr)", 
                md: "repeat(5, 1fr)"  
            },
            gap: { xs: 1.5, sm: 2, md: 3 }, // Gap between grid items
          }}>
            {productsToDisplay.map((productItem) => {
                
                const displayImage = 
                    (productItem.images && productItem.images.length > 0 ? productItem.images[0].img : null) || 
                    productItem.image || 
                    "https://via.placeholder.com/150";

                return (
                  <Box
                    key={productItem._id}
                    sx={{
                        position: "relative",
                        borderRadius: 3,
                        p: 0.5, 
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-5px)'
                        }
                    }}
                  >
                    <Card
                      sx={{
                        p: { xs: 1, md: 2 }, 
                        textAlign: "center",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        borderRadius: 2,
                        bgcolor: 'white'
                      }}
                      onClick={() => navigate(`/product/${productItem._id}`)}
                    >
                        <Box sx={{ 
                            height: { xs: 120, sm: 150, md: 180 }, 
                            overflow: "hidden", 
                            borderRadius: 2, 
                            mb: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            bgcolor: '#f9f9f9' 
                        }}>
                          <img
                            src={displayImage}
                            alt={productItem.name}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                          />
                        </Box>
                        
                        <Box>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: "bold", 
                                    mb: 0.5, 
                                    fontSize: { xs: '0.85rem', md: '1rem' }, // Responsive Font
                                    lineHeight: 1.3,
                                    height: '2.6em', 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}
                            >
                                {productItem.name}
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: "green", 
                                    fontWeight: "bold", 
                                    fontSize: { xs: '0.95rem', md: '1.1rem' } 
                                }}
                            >
                                ₦{productItem.price.toLocaleString()}
                            </Typography>
                        </Box>

                        {/* --- ADMIN ACTIONS --- */}
                        {isAdmin && (
                            <Box 
                                sx={{ mt: 1, pt: 1, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'center', gap: 1 }}
                                onClick={(e) => e.stopPropagation()} 
                            >
                                <Button 
                                    size="small" 
                                    sx={{ minWidth: 0, p: 0.5, color: '#1976d2' }}
                                    onClick={() => navigate(`product/edit/${productItem._id}`)}
                                >
                                    <EditIcon fontSize="small" />
                                </Button>
                                <Button 
                                    size="small" 
                                    color="error"
                                    sx={{ minWidth: 0, p: 0.5 }}
                                    onClick={() => handleDelete(productItem._id)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </Button>
                            </Box>
                        )}
                    </Card>
                  </Box>
                );
            })}
          </Box>
        ) : (
          !loading && (
            <Box sx={{ textAlign: "center", p: 4, mt: 5 }}>
                <Typography sx={{ fontFamily: "cursive", fontSize: "24px", fontWeight: "bold", color: "#888" }}>
                  No Products Found
                </Typography>
                {isSearching && (
                    <Button onClick={clearSearch} sx={{ mt: 2, color: "#6A1B1A" }}>Clear Search</Button>
                )}
            </Box>
          )
        )}
      </Container>
    </Layout>
  );
};

export default Homepage;