import { Box, Card, Typography, Button, Grid } from "@mui/material"; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllProducts } from "../../actions/product.Action";
import Layout from "../../components/layout";
import { productConstants } from "../../actions/constants";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Homepage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.product);
  
  const allProducts = productState?.products || [];
  const searchResults = productState?.searchResults || [];
  const loading = productState?.loading || false;

  // Logic: Switch between Search Results and All Products
  const isSearching = searchResults.length > 0;
  const productsToDisplay = isSearching ? searchResults : allProducts;

  useEffect(() => {
    // Fetch products if the list is empty
    if (allProducts.length === 0) {
       dispatch(getAllProducts());
    }
  }, [dispatch, allProducts.length]);

  const clearSearch = () => {
    dispatch({ 
        type: productConstants.SEARCH_PRODUCT_SUCCESS, 
        payload: { products: [] } 
    });
    // Optional: Refresh list to ensure it's up to date
    if (allProducts.length === 0) dispatch(getAllProducts());
  };

  return (
    <Layout> 
      <Box sx={{ borderRadius: 4, height: "100%", minHeight: "80vh" }}>
        
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
             <Typography style={{ fontFamily: "cursive", fontSize: "20px" }}>
                Loading products...
             </Typography>
          </Box>
        )}

        {/* Back Button (Only shows when searching) */}
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

        {/* Product Grid */}
        {productsToDisplay && productsToDisplay.length > 0 ? (
          <Box style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {productsToDisplay.map((productItem) => {
                
                // ✅ FIXED IMAGE LOGIC
                // 1. Check 'images' array (New System)
                // 2. Check 'image' string (Legacy System)
                // 3. Fallback to Placeholder
                const displayImage = 
                    (productItem.images && productItem.images.length > 0 ? productItem.images[0].img : null) || 
                    productItem.image || 
                    "https://via.placeholder.com/150";

                return (
                  <Box
                    key={productItem._id}
                    style={{ flex: "0 0 calc(20% - 20px)", minWidth: "220px", marginBottom: "25px" }}
                  >
                    <Card
                      sx={{
                        padding: 2,
                        textAlign: "center",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        transition: "0.3s",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        borderRadius: 3,
                        "&:hover": { transform: "scale(1.03)", boxShadow: "0 6px 18px rgba(0,0,0,0.15)" },
                      }}
                      onClick={() => navigate(`/product/${productItem._id}`)}
                    >
                        {/* Image Container */}
                        <Box style={{ width: "100%", height: 180, overflow: "hidden", borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
                          <img
                            src={displayImage}
                            alt={productItem.name}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                          />
                        </Box>
                        
                        <Box>
                            <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: 4, fontSize: '1rem', lineHeight: 1.2 }}>
                            {productItem.name}
                            </Typography>
                            
                            <Typography variant="body1" style={{ color: "green", fontWeight: "bold", fontSize: '1.1rem' }}>
                            ₦{productItem.price.toLocaleString()}
                            </Typography>
                        </Box>
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
      </Box>
    </Layout>
  );
};

export default Homepage;